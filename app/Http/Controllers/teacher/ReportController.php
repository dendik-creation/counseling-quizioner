<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    /** Helper – origin_id tunggal guru */
    private function myOriginId(): int
    {
        return (int) Auth::user()->origin_id;
    }

    /** Base query sudah terscope ke 1 origin + date range */
    private function buildQuery(Request $request)
    {
        $originId  = $this->myOriginId();
        $dateRange = $request->get('date_range');
        $query     = Result::query()->where('origin_id', $originId);

        if ($dateRange && str_contains($dateRange, ' - ')) {
            [$from, $to] = explode(' - ', $dateRange);
            $from = Carbon::parse(trim($from))->startOfDay();
            $to   = Carbon::parse(trim($to))->endOfDay();
            $query->whereBetween('completed_at', [$from, $to]);
        }

        return $query;
    }

    public function index(Request $request)
    {
        $default_start_date = Carbon::now()->startOfMonth()->format('Y-m-d');
        $default_end_date   = Carbon::now()->endOfMonth()->format('Y-m-d');
        $dateRange          = $request->get('date_range', $default_start_date . ' - ' . $default_end_date);

        $baseQ = $this->buildQuery($request);

        /* ── Summary ── */
        $totalResults      = (clone $baseQ)->count();
        $totalParticipants = (clone $baseQ)->distinct('participant_id')->count('participant_id');
        $avgGus            = round((clone $baseQ)->avg('gus_point')  ?? 0, 1);
        $avgJi             = round((clone $baseQ)->avg('ji_point')   ?? 0, 1);
        $avgGang           = round((clone $baseQ)->avg('gang_point') ?? 0, 1);

        /* ── Results per Day ── */
        $resultsPerDay = (clone $baseQ)
            ->select(DB::raw('date(completed_at) as date'), DB::raw('COUNT(*) as total'))
            ->groupBy(DB::raw('date(completed_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'total' => $r->total]);

        /* ── Score per Questionnaire ── */
        $scoreByQuestionnaire = (clone $baseQ)
            ->join('questionnaires', 'results.questionnaire_id', '=', 'questionnaires.id')
            ->select(
                'questionnaires.title',
                DB::raw('ROUND(AVG(gus_point),1) as avg_gus'),
                DB::raw('ROUND(AVG(ji_point),1) as avg_ji'),
                DB::raw('ROUND(AVG(gang_point),1) as avg_gang'),
                DB::raw('COUNT(*) as total_submissions'),
            )
            ->groupBy('questionnaires.id', 'questionnaires.title')
            ->orderByDesc('total_submissions')
            ->get();

        /* ── Category Dominance ── */
        $totalGus  = (clone $baseQ)->sum('gus_point');
        $totalJi   = (clone $baseQ)->sum('ji_point');
        $totalGang = (clone $baseQ)->sum('gang_point');
        $grandSum  = $totalGus + $totalJi + $totalGang;
        $categoryDominance = [
            ['label' => 'Gus',  'total' => $totalGus,  'percentage' => $grandSum > 0 ? round(($totalGus  / $grandSum) * 100, 1) : 0],
            ['label' => 'Ji',   'total' => $totalJi,   'percentage' => $grandSum > 0 ? round(($totalJi   / $grandSum) * 100, 1) : 0],
            ['label' => 'Gang', 'total' => $totalGang, 'percentage' => $grandSum > 0 ? round(($totalGang / $grandSum) * 100, 1) : 0],
        ];

        /* ── Monthly Trend ── */
        $monthlyTrend = (clone $baseQ)
            ->select(
                DB::raw("strftime('%Y-%m', completed_at) as month"),
                DB::raw('COUNT(*) as total'),
                DB::raw('ROUND(AVG(gus_point + ji_point + gang_point),1) as avg_total_score'),
            )
            ->groupBy(DB::raw("strftime('%Y-%m', completed_at)"))
            ->orderBy('month')
            ->get()
            ->map(fn($r) => ['month' => $r->month, 'total' => $r->total, 'avg_total_score' => $r->avg_total_score]);

        /* ── Score Range Distribution ── */
        $scoreRanges = (clone $baseQ)
            ->select(
                DB::raw("
                    CASE
                        WHEN (gus_point + ji_point + gang_point) < 30  THEN 'Sangat Rendah (<30)'
                        WHEN (gus_point + ji_point + gang_point) < 60  THEN 'Rendah (30–59)'
                        WHEN (gus_point + ji_point + gang_point) < 90  THEN 'Sedang (60–89)'
                        WHEN (gus_point + ji_point + gang_point) < 120 THEN 'Tinggi (90–119)'
                        ELSE 'Sangat Tinggi (≥120)'
                    END AS range_label
                "),
                DB::raw('COUNT(*) as total'),
            )
            ->groupBy('range_label')
            ->orderBy(DB::raw('MIN(gus_point + ji_point + gang_point)'))
            ->get();

        /* ── Recent Results ── */
        $recentResults = (clone $baseQ)
            ->with(['participant', 'origin', 'questionnaire'])
            ->orderByDesc('completed_at')
            ->limit(20)
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'participant'   => $r->participant?->name ?? '-',
                'unique_code'   => $r->participant_unique_code,
                'origin'        => $r->origin?->name ?? '-',
                'questionnaire' => $r->questionnaire?->title ?? '-',
                'gus_point'     => $r->gus_point,
                'ji_point'      => $r->ji_point,
                'gang_point'    => $r->gang_point,
                'total_point'   => $r->gus_point + $r->ji_point + $r->gang_point,
                'completed_at'  => $r->completed_at,
            ]);

        return Inertia::render('Teacher/Report/Index', [
            'title'                 => 'Laporan Kuisioner',
            'description'           => 'Visualisasi dan analisis data hasil kuisioner sekolah Anda',
            'filters'               => ['date_range' => $dateRange],
            'summary'               => [
                'total_results'      => $totalResults,
                'total_participants' => $totalParticipants,
                'avg_gus'            => $avgGus,
                'avg_ji'             => $avgJi,
                'avg_gang'           => $avgGang,
            ],
            'results_per_day'       => $resultsPerDay,
            'score_by_questionnaire'=> $scoreByQuestionnaire,
            'category_dominance'    => $categoryDominance,
            'score_ranges'          => $scoreRanges,
            'monthly_trend'         => $monthlyTrend,
            'recent_results'        => $recentResults,
        ]);
    }

    public function printPDF(Request $request)
    {
        $dateRange = $request->get('date_range', '');
        $baseQ     = $this->buildQuery($request);

        $totalResults      = (clone $baseQ)->count();
        $totalParticipants = (clone $baseQ)->distinct('participant_id')->count('participant_id');
        $avgGus            = round((clone $baseQ)->avg('gus_point')  ?? 0, 1);
        $avgJi             = round((clone $baseQ)->avg('ji_point')   ?? 0, 1);
        $avgGang           = round((clone $baseQ)->avg('gang_point') ?? 0, 1);

        $scoreByQuestionnaire = (clone $baseQ)
            ->join('questionnaires', 'results.questionnaire_id', '=', 'questionnaires.id')
            ->select(
                'questionnaires.title',
                DB::raw('ROUND(AVG(gus_point),1) as avg_gus'),
                DB::raw('ROUND(AVG(ji_point),1) as avg_ji'),
                DB::raw('ROUND(AVG(gang_point),1) as avg_gang'),
                DB::raw('COUNT(*) as total_submissions'),
            )
            ->groupBy('questionnaires.id', 'questionnaires.title')
            ->orderByDesc('total_submissions')
            ->get();

        $totalGus  = (clone $baseQ)->sum('gus_point');
        $totalJi   = (clone $baseQ)->sum('ji_point');
        $totalGang = (clone $baseQ)->sum('gang_point');
        $grandSum  = $totalGus + $totalJi + $totalGang;
        $categoryDominance = [
            ['label' => 'Gus',  'total' => $totalGus,  'percentage' => $grandSum > 0 ? round(($totalGus  / $grandSum) * 100, 1) : 0],
            ['label' => 'Ji',   'total' => $totalJi,   'percentage' => $grandSum > 0 ? round(($totalJi   / $grandSum) * 100, 1) : 0],
            ['label' => 'Gang', 'total' => $totalGang, 'percentage' => $grandSum > 0 ? round(($totalGang / $grandSum) * 100, 1) : 0],
        ];

        $allResults = (clone $baseQ)
            ->with(['participant', 'origin', 'questionnaire'])
            ->orderByDesc('completed_at')
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'participant'   => $r->participant?->name ?? '-',
                'unique_code'   => $r->participant_unique_code,
                'origin'        => $r->origin?->name ?? '-',
                'questionnaire' => $r->questionnaire?->title ?? '-',
                'gus_point'     => $r->gus_point,
                'ji_point'      => $r->ji_point,
                'gang_point'    => $r->gang_point,
                'total_point'   => $r->gus_point + $r->ji_point + $r->gang_point,
                'completed_at'  => $r->completed_at,
            ]);

        return Inertia::render('Teacher/Report/Print', [
            'title'                 => 'Cetak Laporan Kuisioner',
            'description'           => 'Laporan lengkap hasil kuisioner sekolah Anda',
            'filters'               => ['date_range' => $dateRange],
            'summary'               => [
                'total_results'      => $totalResults,
                'total_participants' => $totalParticipants,
                'avg_gus'            => $avgGus,
                'avg_ji'             => $avgJi,
                'avg_gang'           => $avgGang,
            ],
            'score_by_questionnaire'=> $scoreByQuestionnaire,
            'category_dominance'    => $categoryDominance,
            'all_results'           => $allResults,
        ]);
    }
}

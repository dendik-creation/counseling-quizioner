<?php

namespace App\Http\Controllers\mgbk;

use App\Http\Controllers\Controller;
use App\Models\Origin;
use App\Models\Result;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Origin IDs milik MGBK yang sedang login.
     */
    private function myOriginIds(): array
    {
        return Origin::where('mgbk_id', Auth::id())->pluck('id')->toArray();
    }

    /**
     * Build base query — sudah terscope ke origin MGBK + date range.
     */
    private function buildQuery(Request $request)
    {
        $myOriginIds = $this->myOriginIds();
        $dateRange   = $request->get('date_range');
        $query       = Result::query()->whereIn('origin_id', $myOriginIds);

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

        /* ── Summary Cards ── */
        $totalResults      = (clone $baseQ)->count();
        $totalParticipants = (clone $baseQ)->distinct('participant_id')->count('participant_id');
        $avgGus            = round((clone $baseQ)->avg('gus_point')  ?? 0, 1);
        $avgJi             = round((clone $baseQ)->avg('ji_point')   ?? 0, 1);
        $avgGang           = round((clone $baseQ)->avg('gang_point') ?? 0, 1);

        /* ── Results per Day (line chart) ── */
        $resultsPerDay = (clone $baseQ)
            ->select(DB::raw('date(completed_at) as date'), DB::raw('COUNT(*) as total'))
            ->groupBy(DB::raw('date(completed_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'total' => $r->total]);

        /* ── Score Distribution per Questionnaire (bar chart) ── */
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

        /* ── Category Dominance (pie) ── */
        $totalGus  = (clone $baseQ)->sum('gus_point');
        $totalJi   = (clone $baseQ)->sum('ji_point');
        $totalGang = (clone $baseQ)->sum('gang_point');
        $grandSum  = $totalGus + $totalJi + $totalGang;
        $categoryDominance = [
            ['label' => 'Gus',  'total' => $totalGus,  'percentage' => $grandSum > 0 ? round(($totalGus  / $grandSum) * 100, 1) : 0],
            ['label' => 'Ji',   'total' => $totalJi,   'percentage' => $grandSum > 0 ? round(($totalJi   / $grandSum) * 100, 1) : 0],
            ['label' => 'Gang', 'total' => $totalGang, 'percentage' => $grandSum > 0 ? round(($totalGang / $grandSum) * 100, 1) : 0],
        ];

        /* ── Per-Institusi Breakdown (horizontal bar — MGBK specific) ── */
        $perOrigin = (clone $baseQ)
            ->join('origins', 'results.origin_id', '=', 'origins.id')
            ->select('origins.id', 'origins.name', DB::raw('COUNT(*) as total'))
            ->groupBy('origins.id', 'origins.name')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'total' => $r->total]);

        /* ── Monthly Trend (area chart) ── */
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

        /* ── Recent Results Table ── */
        $recentResults = (clone $baseQ)
            ->with(['participant', 'origin', 'questionnaire'])
            ->orderByDesc('completed_at')
            ->limit(20)
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'participant'  => $r->participant?->name ?? '-',
                'unique_code'  => $r->participant_unique_code,
                'origin'       => $r->origin?->name ?? '-',
                'questionnaire'=> $r->questionnaire?->title ?? '-',
                'gus_point'    => $r->gus_point,
                'ji_point'     => $r->ji_point,
                'gang_point'   => $r->gang_point,
                'total_point'  => $r->gus_point + $r->ji_point + $r->gang_point,
                'completed_at' => $r->completed_at,
            ]);

        return Inertia::render('Mgbk/Report/Index', [
            'title'               => 'Laporan Kuisioner',
            'description'         => 'Visualisasi dan analisis data hasil kuisioner institusi Anda',
            'filters'             => ['date_range' => $dateRange],
            'summary'             => [
                'total_results'      => $totalResults,
                'total_participants' => $totalParticipants,
                'avg_gus'            => $avgGus,
                'avg_ji'             => $avgJi,
                'avg_gang'           => $avgGang,
            ],
            'results_per_day'       => $resultsPerDay,
            'score_by_questionnaire'=> $scoreByQuestionnaire,
            'category_dominance'    => $categoryDominance,
            'per_origin'            => $perOrigin,     // ← MGBK-specific
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

        $perOrigin = (clone $baseQ)
            ->join('origins', 'results.origin_id', '=', 'origins.id')
            ->select('origins.id', 'origins.name', DB::raw('COUNT(*) as total'))
            ->groupBy('origins.id', 'origins.name')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => ['name' => $r->name, 'total' => $r->total]);

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
                'id'           => $r->id,
                'participant'  => $r->participant?->name ?? '-',
                'unique_code'  => $r->participant_unique_code,
                'origin'       => $r->origin?->name ?? '-',
                'questionnaire'=> $r->questionnaire?->title ?? '-',
                'gus_point'    => $r->gus_point,
                'ji_point'     => $r->ji_point,
                'gang_point'   => $r->gang_point,
                'total_point'  => $r->gus_point + $r->ji_point + $r->gang_point,
                'completed_at' => $r->completed_at,
            ]);

        return Inertia::render('Mgbk/Report/Print', [
            'title'               => 'Cetak Laporan Kuisioner',
            'description'         => 'Laporan lengkap hasil kuisioner konseling institusi Anda',
            'filters'             => ['date_range' => $dateRange],
            'summary'             => [
                'total_results'      => $totalResults,
                'total_participants' => $totalParticipants,
                'avg_gus'            => $avgGus,
                'avg_ji'             => $avgJi,
                'avg_gang'           => $avgGang,
            ],
            'score_by_questionnaire'=> $scoreByQuestionnaire,
            'per_origin'            => $perOrigin,     // ← MGBK-specific
            'category_dominance'    => $categoryDominance,
            'all_results'           => $allResults,
        ]);
    }

    private function humanizeOriginType(string $type): string
    {
        return match ($type) {
            'SCHOOL'    => 'Sekolah',
            'COMMUNITY' => 'Komunitas',
            'COMMON'    => 'Masyarakat Umum',
            default     => 'Lainnya',
        };
    }
}

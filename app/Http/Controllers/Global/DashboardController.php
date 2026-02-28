<?php

namespace App\Http\Controllers\global;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Questionnaire;
use App\Models\Origin;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function adminIndex()
    {
        /* ── Base query — ALL results (no date filter) ── */
        $baseQ = Result::query();

        /* ── Summary Cards ── */
        $totalResults      = (clone $baseQ)->count();
        $totalParticipants = (clone $baseQ)->distinct('participant_id')->count('participant_id');
        $avgGus            = round((clone $baseQ)->avg('gus_point') ?? 0, 1);
        $avgJi             = round((clone $baseQ)->avg('ji_point')  ?? 0, 1);
        $avgGang           = round((clone $baseQ)->avg('gang_point') ?? 0, 1);

        /* ── This month ── */
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth   = Carbon::now()->endOfMonth();
        $monthQ = (clone $baseQ)->whereBetween('completed_at', [$startOfMonth, $endOfMonth]);
        $thisMonthResults      = (clone $monthQ)->count();
        $thisMonthParticipants = (clone $monthQ)->distinct('participant_id')->count('participant_id');

        /* ── Results per Day (last 30 days) ── */
        $from30 = Carbon::now()->subDays(29)->startOfDay();
        $resultsPerDay = (clone $baseQ)
            ->where('completed_at', '>=', $from30)
            ->select(DB::raw('date(completed_at) as date'), DB::raw('COUNT(*) as total'))
            ->groupBy(DB::raw('date(completed_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'total' => $r->total]);

        /* ── Monthly Trend (last 12 months) ── */
        $from12 = Carbon::now()->subMonths(11)->startOfMonth();
        $monthlyTrend = (clone $baseQ)
            ->where('completed_at', '>=', $from12)
            ->select(
                DB::raw("DATE_FORMAT('%Y-%m', completed_at) as month"),
                DB::raw('COUNT(*) as total'),
                DB::raw('ROUND(AVG(gus_point + ji_point + gang_point), 1) as avg_total_score')
            )
            ->groupBy(DB::raw("DATE_FORMAT('%Y-%m', completed_at)"))
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'           => $r->month,
                'total'           => $r->total,
                'avg_total_score' => $r->avg_total_score,
            ]);

        /* ── Score per Questionnaire ── */
        $scoreByQuestionnaire = (clone $baseQ)
            ->join('questionnaires', 'results.questionnaire_id', '=', 'questionnaires.id')
            ->select(
                'questionnaires.title',
                DB::raw('ROUND(AVG(gus_point), 1) as avg_gus'),
                DB::raw('ROUND(AVG(ji_point), 1) as avg_ji'),
                DB::raw('ROUND(AVG(gang_point), 1) as avg_gang'),
                DB::raw('COUNT(*) as total_submissions')
            )
            ->groupBy('questionnaires.id', 'questionnaires.title')
            ->orderByDesc('total_submissions')
            ->get();

        /* ── By Origin Type ── */
        $byOriginType = (clone $baseQ)
            ->join('origins', 'results.origin_id', '=', 'origins.id')
            ->select('origins.type', DB::raw('COUNT(*) as total'))
            ->groupBy('origins.type')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => [
                'type'  => $r->type,
                'label' => $this->humanizeOriginType($r->type),
                'total' => $r->total,
            ]);

        /* ── Top 10 Origins ── */
        $topOrigins = (clone $baseQ)
            ->join('origins', 'results.origin_id', '=', 'origins.id')
            ->select('origins.name', DB::raw('COUNT(*) as total'))
            ->groupBy('origins.id', 'origins.name')
            ->orderByDesc('total')
            ->limit(10)
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

        /* ── Recent Results (10 terbaru) ── */
        $recentResults = (clone $baseQ)
            ->with(['participant', 'origin', 'questionnaire'])
            ->orderByDesc('completed_at')
            ->limit(10)
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

        /* ── Counts ── */
        $questionnaireCount = Questionnaire::count();
        $originCount        = Origin::count();

        return Inertia::render('Admin/Dashboard', [
            'title'                  => 'Dashboard',
            'description'            => 'Ringkasan dan statistik keseluruhan sistem kuisioner konseling',
            'summary'                => [
                'total_results'           => $totalResults,
                'total_participants'      => $totalParticipants,
                'avg_gus'                 => $avgGus,
                'avg_ji'                  => $avgJi,
                'avg_gang'                => $avgGang,
                'this_month_results'      => $thisMonthResults,
                'this_month_participants' => $thisMonthParticipants,
            ],
            'results_per_day'        => $resultsPerDay,
            'monthly_trend'          => $monthlyTrend,
            'score_by_questionnaire' => $scoreByQuestionnaire,
            'by_origin_type'         => $byOriginType,
            'top_origins'            => $topOrigins,
            'category_dominance'     => $categoryDominance,
            'score_ranges'           => $scoreRanges,
            'recent_results'         => $recentResults,
            'questionnaire_count'    => $questionnaireCount,
            'origin_count'           => $originCount,
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

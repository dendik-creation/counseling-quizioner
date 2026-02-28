import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/components/helper/helper";
import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    ClipboardList,
    TrendingUp,
    Brain,
    Activity,
    BookOpen,
    Building2,
    ArrowRight,
    CalendarDays,
    UserCheck,
} from "lucide-react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type {
    AdminDashboardProps,
    DashboardResultPerDay,
    DashboardMonthlyTrend,
    DashboardScoreByQuestionnaire,
    DashboardByOriginType,
    DashboardTopOrigin,
    DashboardCategoryDominance,
    DashboardScoreRange,
    DashboardRecentResult,
} from "@/types/dashboard";

/* ── Chart palettes ── */
const CHART_CAT = ["#14b8a6", "#f59e0b", "#f43f5e"]; // Gus / Ji / Gang
const CHART_MULTI = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6"];
const CHART_AREA = ["#6366f1", "#10b981"];

/* ── Stat Card ── */
function StatCard({
    title,
    value,
    sub,
    icon: Icon,
    highlight = false,
}: {
    title: string;
    value: number | string;
    sub?: string;
    icon: React.ElementType;
    highlight?: boolean;
}) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {title}
                    </p>
                    <p
                        className={`mt-1 text-3xl font-bold ${highlight ? "text-indigo-600" : "text-stone-800"}`}
                    >
                        {value}
                    </p>
                    {sub && (
                        <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
                    )}
                </div>
                <div
                    className={`rounded-lg p-2.5 ${highlight ? "bg-indigo-50 text-indigo-500" : "bg-stone-50 text-stone-500"}`}
                >
                    <Icon size={20} />
                </div>
            </div>
            <div
                className={`absolute bottom-0 left-0 h-0.5 w-full ${highlight ? "bg-indigo-100" : "bg-stone-100"}`}
            />
        </div>
    );
}

/* ── Chart Card ── */
function ChartCard({
    title,
    subtitle,
    children,
    action,
    className = "",
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
        >
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

/* ── Empty placeholder ── */
function EmptyChart() {
    return (
        <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-gray-200">
            <ClipboardList size={32} />
            <p className="text-sm text-gray-300">Belum ada data</p>
        </div>
    );
}

/* ── Main Page ── */
const AdminDashboard = ({
    title,
    description,
    summary,
    results_per_day,
    monthly_trend,
    score_by_questionnaire,
    by_origin_type,
    top_origins,
    category_dominance,
    score_ranges,
    recent_results,
    questionnaire_count,
    origin_count,
}: AdminDashboardProps) => {
    const baseOpts = {
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: { enabled: true, speed: 400 },
    };

    /* 1. Area – Results per Day (30 hari terakhir) */
    const lineOptions: ApexOptions = {
        chart: { type: "area", ...baseOpts },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.22,
                opacityTo: 0.02,
                stops: [0, 90],
            },
        },
        colors: ["#6366f1"],
        dataLabels: { enabled: false },
        xaxis: {
            categories: results_per_day.map(
                (r: DashboardResultPerDay) => r.date,
            ),
            labels: {
                rotate: -40,
                style: { fontSize: "9px", colors: "#9ca3af" },
                formatter: (v: string) =>
                    ymdToIdDate(v)?.split(" ").slice(0, 2).join(" ") ?? v,
            },
            tickAmount: Math.min(results_per_day.length, 12),
        },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
        grid: { borderColor: "#f3f4f6" },
        tooltip: {
            x: {
                formatter: (_: number, opts) =>
                    ymdToIdDate(
                        results_per_day[opts.dataPointIndex]?.date ?? "",
                    ) ?? "",
            },
        },
    };
    const lineSeries = [
        { name: "Pengerjaan", data: results_per_day.map((r) => r.total) },
    ];

    /* 2. Area – Monthly Trend */
    const areaOptions: ApexOptions = {
        chart: { type: "area", ...baseOpts },
        stroke: { curve: "smooth", width: [2, 2] },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.18, opacityTo: 0.01 },
        },
        colors: CHART_AREA,
        dataLabels: { enabled: false },
        xaxis: {
            categories: monthly_trend.map(
                (m: DashboardMonthlyTrend) => m.month,
            ),
            labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
        },
        yaxis: [
            {
                seriesName: "Pengerjaan",
                labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
                title: { text: "Pengerjaan", style: { fontSize: "10px" } },
            },
            {
                seriesName: "Rata-rata Poin",
                opposite: true,
                labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
                title: { text: "Rata-rata Poin", style: { fontSize: "10px" } },
            },
        ],
        legend: { position: "top", fontSize: "11px" },
        tooltip: { shared: true, intersect: false },
        grid: { borderColor: "#f3f4f6" },
    };
    const areaSeries = [
        { name: "Pengerjaan", data: monthly_trend.map((m) => m.total) },
        {
            name: "Rata-rata Poin",
            data: monthly_trend.map((m) => m.avg_total_score),
        },
    ];

    /* 3. Bar – Score per Questionnaire */
    const barOptions: ApexOptions = {
        chart: { type: "bar", ...baseOpts },
        plotOptions: {
            bar: { horizontal: false, borderRadius: 4, columnWidth: "55%" },
        },
        colors: CHART_CAT,
        dataLabels: { enabled: false },
        xaxis: {
            categories: score_by_questionnaire.map(
                (q: DashboardScoreByQuestionnaire) => q.title,
            ),
            labels: {
                style: { fontSize: "10px", colors: "#9ca3af" },
                formatter: (v: string) =>
                    v.length > 18 ? v.slice(0, 16) + "…" : v,
            },
        },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
        legend: { position: "top", fontSize: "11px" },
        tooltip: { shared: true, intersect: false },
        grid: { borderColor: "#f3f4f6" },
    };
    const barSeries = [
        { name: "Gus", data: score_by_questionnaire.map((q) => q.avg_gus) },
        { name: "Ji", data: score_by_questionnaire.map((q) => q.avg_ji) },
        { name: "Gang", data: score_by_questionnaire.map((q) => q.avg_gang) },
    ];

    /* 4. Donut – Origin Type */
    const donutOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
            animations: { enabled: true, speed: 400 },
        },
        colors: CHART_MULTI,
        labels: by_origin_type.map((o: DashboardByOriginType) => o.label),
        dataLabels: { enabled: true, style: { fontSize: "11px" } },
        legend: { position: "bottom", fontSize: "11px" },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            fontSize: "12px",
                            fontWeight: 600,
                        },
                    },
                },
            },
        },
        tooltip: { y: { formatter: (v: number) => `${v} pengerjaan` } },
    };
    const donutSeries = by_origin_type.map((o) => o.total);

    /* 5. Horizontal Bar – Top Origins */
    const hBarOptions: ApexOptions = {
        chart: { type: "bar", ...baseOpts },
        plotOptions: {
            bar: { horizontal: true, borderRadius: 4, barHeight: "55%" },
        },
        colors: ["#6366f1"],
        dataLabels: { enabled: true, style: { fontSize: "10px" } },
        xaxis: {
            categories: top_origins.map((o: DashboardTopOrigin) => o.name),
            labels: { style: { fontSize: "9px", colors: "#9ca3af" } },
        },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
        grid: { borderColor: "#f3f4f6" },
        tooltip: { y: { formatter: (v: number) => `${v} pengerjaan` } },
    };
    const hBarSeries = [
        { name: "Pengerjaan", data: top_origins.map((o) => o.total) },
    ];

    /* 6. Pie – Category Dominance */
    const pieOptions: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: "inherit",
            animations: { enabled: true, speed: 400 },
        },
        colors: CHART_CAT,
        labels: category_dominance.map(
            (c: DashboardCategoryDominance) => c.label,
        ),
        dataLabels: {
            enabled: true,
            formatter: (v: number) => `${v.toFixed(1)}%`,
            style: { fontSize: "11px" },
        },
        legend: { position: "bottom", fontSize: "11px" },
        tooltip: { y: { formatter: (v: number) => `${v} poin` } },
    };
    const pieSeries = category_dominance.map((c) => c.total);

    /* 7. Distributed Bar – Score Ranges */
    const rangeOptions: ApexOptions = {
        chart: { type: "bar", ...baseOpts },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                columnWidth: "50%",
                distributed: true,
            },
        },
        colors: CHART_MULTI,
        dataLabels: { enabled: true, style: { fontSize: "10px" } },
        xaxis: {
            categories: score_ranges.map(
                (s: DashboardScoreRange) => s.range_label,
            ),
            labels: {
                style: { fontSize: "10px", colors: "#9ca3af" },
                rotate: -25,
            },
        },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" } } },
        legend: { show: false },
        grid: { borderColor: "#f3f4f6" },
        tooltip: { y: { formatter: (v: number) => `${v} peserta` } },
    };
    const rangeSeries = [
        { name: "Peserta", data: score_ranges.map((s) => s.total) },
    ];

    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            {/* ── Summary Cards ── */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    title="Total Pengerjaan"
                    value={summary.total_results.toLocaleString("id-ID")}
                    sub="sepanjang waktu"
                    icon={ClipboardList}
                />
                <StatCard
                    title="Total Partisipan"
                    value={summary.total_participants.toLocaleString("id-ID")}
                    sub="sepanjang waktu"
                    icon={Users}
                />
                <StatCard
                    title="Bulan Ini"
                    value={summary.this_month_results.toLocaleString("id-ID")}
                    sub="pengerjaan"
                    icon={CalendarDays}
                    highlight
                />
                <StatCard
                    title="Partisipan Bulan Ini"
                    value={summary.this_month_participants.toLocaleString(
                        "id-ID",
                    )}
                    icon={UserCheck}
                    highlight
                />
                <StatCard
                    title="Rata-rata Gus"
                    value={summary.avg_gus}
                    icon={Brain}
                />
                <StatCard
                    title="Rata-rata Ji"
                    value={summary.avg_ji}
                    icon={Activity}
                />
                <StatCard
                    title="Rata-rata Gang"
                    value={summary.avg_gang}
                    icon={TrendingUp}
                />
            </div>

            {/* ── Row 1: Daily Trend + Donut ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    title="Pengerjaan 30 Hari Terakhir"
                    subtitle="Tren harian seluruh kuisioner"
                    className="lg:col-span-2"
                >
                    {results_per_day.length > 0 ? (
                        <ReactApexChart
                            type="area"
                            height={240}
                            options={lineOptions}
                            series={lineSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Distribusi Asal Peserta"
                    subtitle="Berdasarkan tipe institusi"
                >
                    {donutSeries.length > 0 ? (
                        <ReactApexChart
                            type="donut"
                            height={240}
                            options={donutOptions}
                            series={donutSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>
            </div>

            {/* ── Row 2: Monthly Trend + Score per Questionnaire ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <ChartCard
                    title="Tren Bulanan"
                    subtitle="Pengerjaan & rata-rata poin per bulan"
                >
                    {monthly_trend.length > 0 ? (
                        <ReactApexChart
                            type="area"
                            height={260}
                            options={areaOptions}
                            series={areaSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Poin Rata-rata per Kuisioner"
                    subtitle="Perbandingan Gus / Ji / Gang"
                >
                    {score_by_questionnaire.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={260}
                            options={barOptions}
                            series={barSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>
            </div>

            {/* ── Row 3: Top Origins + Category Dominance + Score Range ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    title="Top 10 Institusi"
                    subtitle="Terbanyak mengerjakan kuisioner"
                >
                    {top_origins.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={240}
                            options={hBarOptions}
                            series={hBarSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Dominasi Kategori"
                    subtitle="Proporsi total poin Gus / Ji / Gang"
                >
                    {pieSeries.some((v) => v > 0) ? (
                        <ReactApexChart
                            type="pie"
                            height={240}
                            options={pieOptions}
                            series={pieSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Distribusi Rentang Poin"
                    subtitle="Jumlah peserta per kelompok poin"
                >
                    {score_ranges.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={240}
                            options={rangeOptions}
                            series={rangeSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>
            </div>

            {/* ── Recent Results Table ── */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                            Hasil Terbaru
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            10 pengerjaan paling akhir
                        </p>
                    </div>
                    <Link href="/admin/results">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1.5 text-stone-600 border-stone-200 hover:bg-stone-50"
                        >
                            <ArrowRight size={13} />
                            <span className="text-xs">Lihat Semua</span>
                        </Button>
                    </Link>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                #
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Partisipan
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Asal
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Kuisioner
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                Gus
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                Ji
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                Gang
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                Total
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Selesai Pada
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recent_results.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="py-12 text-center text-sm text-gray-400"
                                >
                                    Belum ada data pengerjaan
                                </TableCell>
                            </TableRow>
                        )}
                        {recent_results.map(
                            (r: DashboardRecentResult, idx: number) => (
                                <TableRow
                                    key={r.id}
                                    className="hover:bg-stone-50/60 transition-colors"
                                >
                                    <TableCell className="text-gray-400 text-xs">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-800">
                                        {r.participant}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-xs">
                                        {r.origin}
                                    </TableCell>
                                    <TableCell className="max-w-[180px] truncate text-gray-600">
                                        {r.questionnaire}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700">
                                            {r.gus_point}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
                                            {r.ji_point}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700">
                                            {r.gang_point}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-block rounded px-2.5 py-0.5 text-xs font-bold bg-stone-700 text-white">
                                            {r.total_point}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                                        {ymdToIdDate(r.completed_at, true)}
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default AdminDashboard;

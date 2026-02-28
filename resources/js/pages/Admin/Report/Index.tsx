import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { DatePickerInput } from "@/components/custom/FormElement";
import { ymdToIdDate } from "@/components/helper/helper";
import { router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
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
    Printer,
    Users,
    ClipboardList,
    TrendingUp,
    Brain,
    Activity,
    RefreshCw,
} from "lucide-react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
    ReportIndexProps,
    ResultPerDay,
    ScoreByQuestionnaire,
    ByOriginType,
    TopOrigin,
    ScoreRange,
    CategoryDominance,
    MonthlyTrend,
    RecentResult,
} from "@/types/report";

// Card & button — solid stone
const C = {
    base: "#4f46e5",
    dark: "#3730a3",
    mid: "#6366f1",
    soft: "#e0e7ff",
    muted: "#818cf8",
    text: "#1e1b4b",
};

// Chart palettes — natural varied colours
const CHART_CAT = ["#14b8a6", "#f59e0b", "#f43f5e"]; // GUS / JI / GANG
const CHART_MULTI = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6"]; // donut / distributed
const CHART_AREA = ["#6366f1", "#10b981"]; // dual-area
const CHART_SOLID = ["#6366f1"]; // single-series

function StatCard({
    title,
    value,
    icon: Icon,
    accent = false,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    accent?: boolean;
}) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="mt-1.5 text-3xl font-bold text-stone-700">
                        {value}
                    </p>
                </div>
                <div className="rounded-lg bg-stone-50 p-2.5 text-stone-600">
                    <Icon size={20} />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-stone-100" />
        </div>
    );
}

/* ─────────────────────────────────────────────────
   Chart Card wrapper
───────────────────────────────────────────────── */
function ChartCard({
    title,
    subtitle,
    children,
    className = "",
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
                {subtitle && (
                    <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
                )}
            </div>
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────── */
const AdminReportIndex = ({
    title,
    description,
    filters,
    summary,
    results_per_day,
    score_by_questionnaire,
    by_origin_type,
    top_origins,
    score_ranges,
    category_dominance,
    monthly_trend,
    recent_results,
}: ReportIndexProps) => {
    const firstRender = useRef(true);
    const [dateRange, setDateRange] = useState<string>(
        filters.date_range || "",
    );

    /* Auto-reload when date_range changes (debounced) */
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get(
                "/admin/reports",
                { date_range: dateRange },
                { preserveState: true, replace: true },
            );
        }, 1000);
        return () => clearTimeout(timer);
    }, [dateRange]);

    /* ── Build print URL with current filters ── */
    const buildPrintUrl = () => {
        const params = new URLSearchParams();
        if (dateRange) params.set("date_range", dateRange);
        return `/admin/reports/print?${params.toString()}`;
    };

    /* ── Display label for date range ── */
    const dateRangeLabel = dateRange
        ? dateRange
              .split(" - ")
              .map((d) => ymdToIdDate(d.trim()) ?? d.trim())
              .join(" – ")
        : "Semua waktu";

    /* ── Common chart base options ── */
    const baseAxisOpts = {
        toolbar: { show: false },
        fontFamily: "inherit",
        animations: { enabled: true, speed: 500 },
    };

    /* 1. Area – Results per Day */
    const lineOptions: ApexOptions = {
        chart: { type: "area", ...baseAxisOpts },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.25,
                opacityTo: 0.02,
                stops: [0, 90],
            },
        },
        colors: [C.base],
        dataLabels: { enabled: false },
        xaxis: {
            categories: results_per_day.map((r: ResultPerDay) => r.date),
            labels: {
                rotate: -45,
                style: { fontSize: "10px", colors: "#6b7280" },
                formatter: (val: string) =>
                    ymdToIdDate(val)?.split(" ").slice(0, 2).join(" ") ?? val,
            },
            tickAmount: Math.min(results_per_day.length, 10),
        },
        yaxis: { labels: { style: { fontSize: "11px", colors: "#6b7280" } } },
        tooltip: {
            x: {
                formatter: (val: number) =>
                    ymdToIdDate(results_per_day[val - 1]?.date ?? "") ?? "",
            },
        },
        grid: { borderColor: "#f3f4f6" },
    };
    const lineSeries = [
        {
            name: "Pengerjaan",
            data: results_per_day.map((r: ResultPerDay) => r.total),
        },
    ];

    /* 2. Bar – Scores per Questionnaire */
    const barOptions: ApexOptions = {
        chart: { type: "bar", ...baseAxisOpts },
        plotOptions: {
            bar: { horizontal: false, borderRadius: 4, columnWidth: "55%" },
        },
        colors: CHART_CAT,
        dataLabels: { enabled: false },
        xaxis: {
            categories: score_by_questionnaire.map(
                (q: ScoreByQuestionnaire) => q.title,
            ),
            labels: {
                style: { fontSize: "10px", colors: "#6b7280" },
                formatter: (v: string) =>
                    v.length > 18 ? v.slice(0, 16) + "…" : v,
            },
        },
        yaxis: { labels: { style: { fontSize: "11px", colors: "#6b7280" } } },
        legend: { position: "top", fontSize: "11px" },
        tooltip: { shared: true, intersect: false },
        grid: { borderColor: "#f3f4f6" },
    };
    const barSeries = [
        {
            name: "Gus",
            data: score_by_questionnaire.map(
                (q: ScoreByQuestionnaire) => q.avg_gus,
            ),
        },
        {
            name: "Ji",
            data: score_by_questionnaire.map(
                (q: ScoreByQuestionnaire) => q.avg_ji,
            ),
        },
        {
            name: "Gang",
            data: score_by_questionnaire.map(
                (q: ScoreByQuestionnaire) => q.avg_gang,
            ),
        },
    ];

    /* 3. Donut – by Origin Type */
    const donutOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
            animations: { enabled: true, speed: 500 },
        },
        colors: CHART_MULTI,
        labels: by_origin_type.map((o: ByOriginType) => o.label),
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
    const donutSeries = by_origin_type.map((o: ByOriginType) => o.total);

    /* 4. Horizontal Bar – Top Origins */
    const hBarOptions: ApexOptions = {
        chart: { type: "bar", ...baseAxisOpts },
        plotOptions: {
            bar: { horizontal: true, borderRadius: 4, barHeight: "55%" },
        },
        colors: CHART_SOLID,
        dataLabels: { enabled: true, style: { fontSize: "10px" } },
        xaxis: {
            categories: top_origins.map((o: TopOrigin) => o.name),
            labels: { style: { fontSize: "10px", colors: "#6b7280" } },
        },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#6b7280" } } },
        grid: { borderColor: "#f3f4f6" },
        tooltip: { y: { formatter: (v: number) => `${v} pengerjaan` } },
    };
    const hBarSeries = [
        {
            name: "Pengerjaan",
            data: top_origins.map((o: TopOrigin) => o.total),
        },
    ];

    /* 5. Bar – Score Range Distribution */
    const rangeOptions: ApexOptions = {
        chart: { type: "bar", ...baseAxisOpts },
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
            categories: score_ranges.map((s: ScoreRange) => s.range_label),
            labels: {
                style: { fontSize: "10px", colors: "#6b7280" },
                rotate: -25,
            },
        },
        yaxis: { labels: { style: { fontSize: "11px", colors: "#6b7280" } } },
        legend: { show: false },
        grid: { borderColor: "#f3f4f6" },
        tooltip: { y: { formatter: (v: number) => `${v} peserta` } },
    };
    const rangeSeries = [
        { name: "Peserta", data: score_ranges.map((s: ScoreRange) => s.total) },
    ];

    /* 6. Pie – Category Dominance */
    const pieOptions: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: "inherit",
            animations: { enabled: true, speed: 500 },
        },
        colors: CHART_CAT,
        labels: category_dominance.map((c: CategoryDominance) => c.label),
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`,
            style: { fontSize: "11px" },
        },
        legend: { position: "bottom", fontSize: "11px" },
        tooltip: { y: { formatter: (v: number) => `${v} poin` } },
    };
    const pieSeries = category_dominance.map((c: CategoryDominance) => c.total);

    /* 7. Area – Monthly Trend */
    const areaOptions: ApexOptions = {
        chart: { type: "area", ...baseAxisOpts },
        stroke: { curve: "smooth", width: [2, 2] },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02 },
        },
        colors: CHART_AREA,
        dataLabels: { enabled: false },
        xaxis: {
            categories: monthly_trend.map((m: MonthlyTrend) => m.month),
            labels: { style: { fontSize: "10px", colors: "#6b7280" } },
        },
        yaxis: [
            {
                seriesName: "Pengerjaan",
                labels: { style: { fontSize: "10px", colors: "#6b7280" } },
                title: { text: "Pengerjaan", style: { fontSize: "10px" } },
            },
            {
                seriesName: "Rata-rata Poin",
                opposite: true,
                labels: { style: { fontSize: "10px", colors: "#6b7280" } },
                title: { text: "Poin Rata-rata", style: { fontSize: "10px" } },
            },
        ],
        legend: { position: "top", fontSize: "11px" },
        tooltip: { shared: true, intersect: false },
        grid: { borderColor: "#f3f4f6" },
    };
    const areaSeries = [
        {
            name: "Pengerjaan",
            data: monthly_trend.map((m: MonthlyTrend) => m.total),
        },
        {
            name: "Rata-rata Poin",
            data: monthly_trend.map((m: MonthlyTrend) => m.avg_total_score),
        },
    ];

    return (
        <AppLayout>
            {/* ── Header ── */}
            <PageTitle title={title} description={description} />

            {/* ── Filter Bar ── */}
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Rentang Tanggal
                    </label>
                    <div className="min-w-[280px]">
                        <DatePickerInput
                            value={dateRange}
                            onChange={(v) => setDateRange(v ?? "")}
                            mode="range"
                            placeholder="Pilih rentang tanggal"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={buildPrintUrl()} target="_blank">
                        <Button
                            variant="default"
                            className="flex items-center gap-2 bg-stone-600 text-white hover:bg-stone-700"
                        >
                            <Printer size={14} />
                            <span>Cetak Laporan</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    title="Total Pengerjaan"
                    value={summary.total_results.toLocaleString("id-ID")}
                    icon={ClipboardList}
                />
                <StatCard
                    title="Total Partisipan"
                    value={summary.total_participants.toLocaleString("id-ID")}
                    icon={Users}
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

            {/* ── Charts Row 1 ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    title="Pengerjaan per Hari"
                    subtitle="Tren jumlah pengerjaan kuisioner harian"
                    className="lg:col-span-2"
                >
                    {results_per_day.length > 0 ? (
                        <ReactApexChart
                            type="area"
                            height={260}
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
                    {by_origin_type.length > 0 ? (
                        <ReactApexChart
                            type="donut"
                            height={260}
                            options={donutOptions}
                            series={donutSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>
            </div>

            {/* ── Charts Row 2 ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <ChartCard
                    title="Poin Rata-rata per Kuisioner"
                    subtitle="Dipisahkan per kuisioner"
                >
                    {score_by_questionnaire.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={280}
                            options={barOptions}
                            series={barSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Top 10 Asal Terbanyak"
                    subtitle="Institusi dengan pengerjaan terbanyak"
                >
                    {top_origins.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={280}
                            options={hBarOptions}
                            series={hBarSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>
            </div>

            {/* ── Charts Row 3 ── */}
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    title="Distribusi Rentang Poin"
                    subtitle="Jumlah peserta per kelompok Poin"
                >
                    {score_ranges.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={260}
                            options={rangeOptions}
                            series={rangeSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Dominasi Kategori"
                    subtitle="Proporsi total poin per kategori"
                >
                    {pieSeries.some((v) => v > 0) ? (
                        <ReactApexChart
                            type="pie"
                            height={260}
                            options={pieOptions}
                            series={pieSeries}
                        />
                    ) : (
                        <EmptyChart />
                    )}
                </ChartCard>

                <ChartCard
                    title="Tren Bulanan"
                    subtitle="Pengerjaan & rata-rata Poin per bulan"
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
            </div>

            {/* ── Recent Results Table ── */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                            Hasil Terbaru
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            20 pengerjaan terakhir dalam periode yang dipilih
                        </p>
                    </div>
                    <Link href={buildPrintUrl()} target="_blank">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1.5 text-stone-600 border-stone-200 hover:bg-stone-50"
                        >
                            <Printer size={13} />
                            <span className="text-xs">Cetak</span>
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
                                ID Unik
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Asal
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600">
                                Kuisioner
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                GUS
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                JI
                            </TableHead>
                            <TableHead className="bg-stone-100 font-semibold text-gray-600 text-right">
                                GANG
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
                                    colSpan={10}
                                    className="py-12 text-center text-sm text-gray-400"
                                >
                                    Tidak ada data pada periode ini
                                </TableCell>
                            </TableRow>
                        )}
                        {recent_results.map((r: RecentResult, idx: number) => (
                            <TableRow key={r.id}>
                                <TableCell className="text-gray-400 text-xs">
                                    {idx + 1}
                                </TableCell>
                                <TableCell className="font-medium text-gray-800">
                                    {r.participant}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    {r.unique_code}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {r.origin}
                                </TableCell>
                                <TableCell className="max-w-[160px] truncate text-gray-600">
                                    {r.questionnaire}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-stone-50 text-stone-700">
                                        {r.gus_point}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-stone-50 text-stone-700">
                                        {r.ji_point}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-stone-50 text-stone-700">
                                        {r.gang_point}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-block rounded px-2.5 py-0.5 text-xs font-bold bg-stone-600 text-white">
                                        {r.total_point}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    {ymdToIdDate(r.completed_at, true)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

/* ─────────────────────────────────────────────────
   Empty Chart Placeholder
───────────────────────────────────────────────── */
function EmptyChart() {
    return (
        <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-gray-200">
            <ClipboardList size={34} />
            <p className="text-sm text-gray-300">Tidak ada data</p>
        </div>
    );
}

export default AdminReportIndex;

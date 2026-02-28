import React, { useEffect } from "react";
import { ymdToIdDate } from "@/components/helper/helper";
import {
    ReportPrintProps,
    RecentResult,
    ScoreByQuestionnaire,
    ByOriginType,
    CategoryDominance,
} from "@/types/report";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/* ─────────────────────────────────────────────────
   Chart palettes — varied natural colours
───────────────────────────────────────────────── */
const CHART_CAT = ["#14b8a6", "#f59e0b", "#f43f5e"]; // Gus / Ji / Gang
const CHART_MULTI = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6"]; // donut

/* ─────────────────────────────────────────────────
   Print-friendly colour tokens (ink-saving)
   Tidak ada background solid kecuali chart
───────────────────────────────────────────────── */
const T = {
    text: "#111827", // hampir hitam
    muted: "#6b7280", // abu
    border: "#d1d5db", // abu terang
    accent: "#111827", // aksen header garis
    line: "#e5e7eb",
};

/* ─────────────────────────────────────────────────
   Font-face injection – Space Grotesk dari /assets/fonts
───────────────────────────────────────────────── */
const FONT_CSS = `
@font-face {
    font-family: 'SpaceGrotesk';
    src: url('/assets/fonts/SpaceGrotesk-Light.ttf') format('truetype');
    font-weight: 300;
}
@font-face {
    font-family: 'SpaceGrotesk';
    src: url('/assets/fonts/SpaceGrotesk-Regular.ttf') format('truetype');
    font-weight: 400;
}
@font-face {
    font-family: 'SpaceGrotesk';
    src: url('/assets/fonts/SpaceGrotesk-Medium.ttf') format('truetype');
    font-weight: 500;
}
@font-face {
    font-family: 'SpaceGrotesk';
    src: url('/assets/fonts/SpaceGrotesk-SemiBold.ttf') format('truetype');
    font-weight: 600;
}
@font-face {
    font-family: 'SpaceGrotesk';
    src: url('/assets/fonts/SpaceGrotesk-Bold.ttf') format('truetype');
    font-weight: 700;
}
* {
    font-family: 'SpaceGrotesk', sans-serif !important;
    box-sizing: border-box;
}
@media print {
    @page { margin: 12mm; size: A4 potrait; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

const AdminReportPrint = ({
    filters,
    summary,
    score_by_questionnaire,
    by_origin_type,
    category_dominance,
    all_results,
}: ReportPrintProps) => {
    /* Auto print + close setelah selesai/cancel */
    useEffect(() => {
        const handleAfterPrint = () => window.close();
        window.addEventListener("afterprint", handleAfterPrint);
        const timer = setTimeout(() => window.print(), 900);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    /* Label periode */
    const dateRangeLabel = filters.date_range
        ? filters.date_range
              .split(" - ")
              .map((d) => ymdToIdDate(d.trim()) ?? d.trim())
              .join(" – ")
        : "Semua Waktu";

    /* ── Chart options ── */
    const donutOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "SpaceGrotesk, sans-serif",
            animations: { enabled: false },
        },
        colors: CHART_MULTI,
        labels: by_origin_type.map((o: ByOriginType) => o.label),
        dataLabels: { enabled: true, style: { fontSize: "10px" } },
        legend: { position: "bottom", fontSize: "10px" },
        plotOptions: { pie: { donut: { size: "60%" } } },
        tooltip: { y: { formatter: (v: number) => `${v} pengerjaan` } },
    };
    const donutSeries = by_origin_type.map((o: ByOriginType) => o.total);

    const barOptions: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            fontFamily: "SpaceGrotesk, sans-serif",
            animations: { enabled: false },
        },
        plotOptions: {
            bar: { horizontal: false, borderRadius: 3, columnWidth: "55%" },
        },
        colors: CHART_CAT,
        dataLabels: { enabled: false },
        xaxis: {
            categories: score_by_questionnaire.map(
                (q: ScoreByQuestionnaire) => q.title,
            ),
            labels: {
                style: { fontSize: "9px", colors: T.muted },
                formatter: (v: string) =>
                    v.length > 16 ? v.slice(0, 14) + "…" : v,
            },
        },
        yaxis: { labels: { style: { fontSize: "9px", colors: T.muted } } },
        legend: { position: "top", fontSize: "10px" },
        tooltip: { shared: true, intersect: false },
        grid: { borderColor: T.line },
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

    const pieOptions: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: "SpaceGrotesk, sans-serif",
            animations: { enabled: false },
        },
        colors: CHART_CAT,
        labels: category_dominance.map((c: CategoryDominance) => c.label),
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`,
            style: { fontSize: "10px" },
        },
        legend: { position: "bottom", fontSize: "10px" },
        tooltip: { y: { formatter: (v: number) => `${v} poin` } },
    };
    const pieSeries = category_dominance.map((c: CategoryDominance) => c.total);

    /* ── Shared inline styles ── */
    const wrap: React.CSSProperties = {
        background: "#fff",
        minHeight: "100vh",
        padding: "24px 28px",
        maxWidth: "1080px",
        margin: "0 auto",
        color: T.text,
        fontSize: "12px",
    };

    const thStyle: React.CSSProperties = {
        padding: "7px 10px",
        textAlign: "left",
        fontWeight: 600,
        borderBottom: `1.5px solid ${T.accent}`,
        color: T.text,
        fontSize: "11px",
        background: "transparent",
    };
    const thRStyle: React.CSSProperties = { ...thStyle, textAlign: "right" };
    const tdStyle: React.CSSProperties = {
        padding: "6px 10px",
        borderBottom: `1px solid ${T.line}`,
        color: T.text,
        background: "transparent",
    };
    const tdRStyle: React.CSSProperties = { ...tdStyle, textAlign: "right" };

    return (
        <div style={wrap}>
            {/* inject font + print css */}
            <style>{FONT_CSS}</style>

            {/* ── Header ── */}
            <div
                style={{
                    borderBottom: `2px solid ${T.accent}`,
                    marginBottom: "20px",
                    paddingBottom: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            margin: 0,
                            color: T.text,
                        }}
                    >
                        Laporan Hasil Kuisioner
                    </h1>
                    <p
                        style={{
                            fontSize: "12px",
                            color: T.muted,
                            marginTop: "2px",
                        }}
                    >
                        Periode: {dateRangeLabel}
                    </p>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        fontSize: "11px",
                        color: T.muted,
                    }}
                >
                    <p style={{ margin: 0 }}>Dicetak pada:</p>
                    <p style={{ margin: 0, fontWeight: 600, color: T.text }}>
                        {ymdToIdDate(new Date().toISOString(), true)}
                    </p>
                </div>
            </div>

            {/* ── Ringkasan ── */}
            <SectionTitle>Ringkasan</SectionTitle>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    gap: "8px",
                    marginBottom: "20px",
                }}
            >
                {[
                    { label: "Total Pengerjaan", value: summary.total_results },
                    {
                        label: "Total Partisipan",
                        value: summary.total_participants,
                    },
                    { label: "Rata-rata Gus", value: summary.avg_gus },
                    { label: "Rata-rata Ji", value: summary.avg_ji },
                    { label: "Rata-rata Gang", value: summary.avg_gang },
                ].map((c) => (
                    <div
                        key={c.label}
                        style={{
                            border: `1px solid ${T.border}`,
                            borderRadius: "6px",
                            padding: "10px 12px",
                            background: "transparent",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "9px",
                                color: T.muted,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: "4px",
                            }}
                        >
                            {c.label}
                        </p>
                        <p
                            style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                margin: 0,
                                color: T.text,
                            }}
                        >
                            {c.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Visualisasi ── */}
            <SectionTitle>Visualisasi Data</SectionTitle>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <ChartBox
                    title="Poin Rata-rata per Kuisioner"
                    border={T.border}
                >
                    {score_by_questionnaire.length > 0 ? (
                        <ReactApexChart
                            type="bar"
                            height={190}
                            options={barOptions}
                            series={barSeries}
                        />
                    ) : (
                        <EmptyBlock />
                    )}
                </ChartBox>

                <ChartBox title="Distribusi Asal Peserta" border={T.border}>
                    {by_origin_type.length > 0 ? (
                        <ReactApexChart
                            type="donut"
                            height={190}
                            options={donutOptions}
                            series={donutSeries}
                        />
                    ) : (
                        <EmptyBlock />
                    )}
                </ChartBox>

                <ChartBox title="Dominasi Kategori" border={T.border}>
                    {pieSeries.some((v) => v > 0) ? (
                        <ReactApexChart
                            type="pie"
                            height={190}
                            options={pieOptions}
                            series={pieSeries}
                        />
                    ) : (
                        <EmptyBlock />
                    )}
                </ChartBox>

                {/* Rincian Kategori */}
                <ChartBox title="Rincian Kategori" border={T.border}>
                    <Table noWrapper>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={thStyle}>Kategori</TableHead>
                                <TableHead style={thRStyle}>
                                    Total Poin
                                </TableHead>
                                <TableHead style={thRStyle}>%</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {category_dominance.map((c: CategoryDominance) => (
                                <TableRow key={c.label}>
                                    <TableCell style={tdStyle}>
                                        {c.label}
                                    </TableCell>
                                    <TableCell style={tdRStyle}>
                                        {c.total.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell
                                        style={{ ...tdRStyle, fontWeight: 600 }}
                                    >
                                        {c.percentage}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ChartBox>
            </div>

            {/* ── Ringkasan per Kuisioner ── */}
            <SectionTitle>Ringkasan per Kuisioner</SectionTitle>
            <div
                style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "20px",
                }}
            >
                <Table noWrapper>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={thStyle}>Kuisioner</TableHead>
                            <TableHead style={thRStyle}>Pengerjaan</TableHead>
                            <TableHead style={thRStyle}>
                                Rata-rata Gus
                            </TableHead>
                            <TableHead style={thRStyle}>Rata-rata Ji</TableHead>
                            <TableHead style={thRStyle}>
                                Rata-rata Gang
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {score_by_questionnaire.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        color: T.muted,
                                    }}
                                >
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                        {score_by_questionnaire.map(
                            (q: ScoreByQuestionnaire, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell style={tdStyle}>
                                        {q.title}
                                    </TableCell>
                                    <TableCell
                                        style={{ ...tdRStyle, fontWeight: 600 }}
                                    >
                                        {q.total_submissions}
                                    </TableCell>
                                    <TableCell style={tdRStyle}>
                                        {q.avg_gus}
                                    </TableCell>
                                    <TableCell style={tdRStyle}>
                                        {q.avg_ji}
                                    </TableCell>
                                    <TableCell style={tdRStyle}>
                                        {q.avg_gang}
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Data Lengkap ── */}
            <SectionTitle>
                Data Pengerjaan Lengkap ({all_results.length} entri)
            </SectionTitle>
            <div
                style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                }}
            >
                <Table noWrapper>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={thStyle}>#</TableHead>
                            <TableHead style={thStyle}>Partisipan</TableHead>
                            <TableHead style={thStyle}>ID Unik</TableHead>
                            <TableHead style={thStyle}>Asal</TableHead>
                            <TableHead style={thStyle}>Kuisioner</TableHead>
                            <TableHead style={thRStyle}>Gus</TableHead>
                            <TableHead style={thRStyle}>Ji</TableHead>
                            <TableHead style={thRStyle}>Gang</TableHead>
                            <TableHead style={thRStyle}>Total</TableHead>
                            <TableHead style={thStyle}>Selesai Pada</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {all_results.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        color: T.muted,
                                    }}
                                >
                                    Tidak ada data pada periode ini
                                </TableCell>
                            </TableRow>
                        )}
                        {all_results.map((r: RecentResult, idx: number) => (
                            <TableRow key={r.id}>
                                <TableCell
                                    style={{ ...tdStyle, color: T.muted }}
                                >
                                    {idx + 1}
                                </TableCell>
                                <TableCell
                                    style={{ ...tdStyle, fontWeight: 600 }}
                                >
                                    {r.participant}
                                </TableCell>
                                <TableCell
                                    style={{
                                        ...tdStyle,
                                        fontFamily: "monospace",
                                        fontSize: "10px",
                                        color: T.muted,
                                    }}
                                >
                                    {r.unique_code}
                                </TableCell>
                                <TableCell style={tdStyle}>
                                    {r.origin}
                                </TableCell>
                                <TableCell
                                    style={{
                                        ...tdStyle,
                                        maxWidth: "120px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {r.questionnaire}
                                </TableCell>
                                <TableCell style={tdRStyle}>
                                    {r.gus_point}
                                </TableCell>
                                <TableCell style={tdRStyle}>
                                    {r.ji_point}
                                </TableCell>
                                <TableCell style={tdRStyle}>
                                    {r.gang_point}
                                </TableCell>
                                <TableCell
                                    style={{ ...tdRStyle, fontWeight: 700 }}
                                >
                                    {r.total_point}
                                </TableCell>
                                <TableCell
                                    style={{
                                        ...tdStyle,
                                        whiteSpace: "nowrap",
                                        color: T.muted,
                                    }}
                                >
                                    {ymdToIdDate(r.completed_at, true)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

/* ── Section Title ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p
            style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                color: "#374151",
                borderBottom: "1.5px solid #d1d5db",
                paddingBottom: "4px",
                marginBottom: "10px",
            }}
        >
            {children}
        </p>
    );
}

/* ── Chart Wrapper Box (border only, no fill) ── */
function ChartBox({
    title,
    border,
    children,
}: {
    title: string;
    border: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                border: `1px solid ${border}`,
                borderRadius: "6px",
                padding: "10px 12px",
                background: "transparent",
            }}
        >
            <p
                style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "#111827",
                }}
            >
                {title}
            </p>
            {children}
        </div>
    );
}

/* ── Empty block ── */
function EmptyBlock() {
    return (
        <div
            style={{
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d1d5db",
                fontSize: "11px",
            }}
        >
            Tidak ada data
        </div>
    );
}

export default AdminReportPrint;

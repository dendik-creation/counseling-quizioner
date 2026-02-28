import React, { useEffect } from "react";
import { ymdToIdDate } from "@/components/helper/helper";
import { Result } from "@/types/result";
import { Participant } from "@/types/participant";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/* ── Font + print CSS ── */
const FONT_CSS = `
@font-face { font-family:'SpaceGrotesk'; src:url('/assets/fonts/SpaceGrotesk-Light.ttf') format('truetype'); font-weight:300; }
@font-face { font-family:'SpaceGrotesk'; src:url('/assets/fonts/SpaceGrotesk-Regular.ttf') format('truetype'); font-weight:400; }
@font-face { font-family:'SpaceGrotesk'; src:url('/assets/fonts/SpaceGrotesk-Medium.ttf') format('truetype'); font-weight:500; }
@font-face { font-family:'SpaceGrotesk'; src:url('/assets/fonts/SpaceGrotesk-SemiBold.ttf') format('truetype'); font-weight:600; }
@font-face { font-family:'SpaceGrotesk'; src:url('/assets/fonts/SpaceGrotesk-Bold.ttf') format('truetype'); font-weight:700; }
* { font-family:'SpaceGrotesk', sans-serif !important; box-sizing:border-box; }
@media print {
    @page { margin: 12mm; size: A4 portrait; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

/* ── Ink-saving tokens ── */
const T = {
    text: "#111827",
    muted: "#6b7280",
    border: "#d1d5db",
    line: "#e5e7eb",
};

type PageProps = {
    title?: string;
    description?: string;
    results: Result[];
    participant: Participant;
};

const AdminResultPrintShow = ({ results, participant }: PageProps) => {
    /* Auto print → close */
    useEffect(() => {
        const handleAfterPrint = () => window.close();
        window.addEventListener("afterprint", handleAfterPrint);
        const t = setTimeout(() => window.print(), 900);
        return () => {
            clearTimeout(t);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    /* ── Trend chart (line) ── */
    const trendOptions: ApexOptions = {
        chart: {
            type: "line",
            toolbar: { show: false },
            fontFamily: "SpaceGrotesk, sans-serif",
            animations: { enabled: false },
        },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: ["#10b981", "#3b82f6", "#f59e42"],
        },
        xaxis: {
            categories: results.map((r) => ymdToIdDate(r.completed_at) ?? ""),
        },
        yaxis: {
            title: { text: "Poin", style: { fontSize: "10px" } },
            labels: { style: { fontSize: "9px" } },
        },
        legend: { show: true, horizontalAlign: "right", fontSize: "10px" },
        markers: { size: 4 },
        grid: { borderColor: T.line },
        tooltip: { shared: true, intersect: false },
    };
    const trendSeries = [
        {
            name: "Gus",
            data: results.map((r) => r.gus_point),
            color: "#10b981",
        },
        { name: "Ji", data: results.map((r) => r.ji_point), color: "#3b82f6" },
        {
            name: "Gang",
            data: results.map((r) => r.gang_point),
            color: "#f59e42",
        },
    ];

    /* ── Table cell styles ── */
    const th: React.CSSProperties = {
        padding: "7px 10px",
        textAlign: "left",
        fontWeight: 600,
        borderBottom: `1.5px solid ${T.text}`,
        fontSize: "11px",
        background: "transparent",
        color: T.text,
    };
    const thC: React.CSSProperties = { ...th, textAlign: "center" };
    const thR: React.CSSProperties = { ...th, textAlign: "right" };
    const td: React.CSSProperties = {
        padding: "6px 10px",
        borderBottom: `1px solid ${T.line}`,
        color: T.text,
        background: "transparent",
        fontSize: "12px",
    };
    const tdC: React.CSSProperties = { ...td, textAlign: "center" };
    const tdR: React.CSSProperties = { ...td, textAlign: "right" };

    return (
        <div
            style={{
                background: "#fff",
                minHeight: "100vh",
                padding: "24px 28px",
                maxWidth: "900px",
                margin: "0 auto",
                color: T.text,
                fontSize: "12px",
            }}
        >
            <style>{FONT_CSS}</style>

            {/* ── Header ── */}
            <div
                style={{
                    borderBottom: `2px solid ${T.text}`,
                    marginBottom: "18px",
                    paddingBottom: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div>
                    <h1
                        style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}
                    >
                        Histori Pengerjaan Kuisioner
                    </h1>
                    <p
                        style={{
                            fontSize: "12px",
                            color: T.muted,
                            marginTop: "2px",
                        }}
                    >
                        {results[0]?.questionnaire?.title ?? "-"}
                    </p>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        fontSize: "11px",
                        color: T.muted,
                    }}
                >
                    <p style={{ margin: 0 }}>Dicetak:</p>
                    <p style={{ margin: 0, fontWeight: 600, color: T.text }}>
                        {ymdToIdDate(new Date().toISOString(), true)}
                    </p>
                </div>
            </div>

            {/* ── Info Partisipan ── */}
            <SectionTitle>Info Partisipan</SectionTitle>
            <div
                style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "6px",
                    padding: "12px 14px",
                    marginBottom: "18px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "8px 20px",
                }}
            >
                <InfoItem label="Nama" value={participant.name} />
                <InfoItem label="ID Unik" value={participant.unique_code} />
                <InfoItem
                    label="Total Pengerjaan"
                    value={`${results.length} kali`}
                />
                <InfoItem
                    label="Asal Institusi"
                    value={participant.origin?.name ?? "-"}
                />
                {participant.class && (
                    <InfoItem label="Kelas" value={participant.class} />
                )}
                {participant.work && (
                    <InfoItem label="Pekerjaan" value={participant.work} />
                )}
            </div>

            {/* ── Trend Chart ── */}
            <SectionTitle>Tren Poin Pengerjaan</SectionTitle>
            <div
                style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "6px",
                    padding: "10px 12px",
                    marginBottom: "18px",
                }}
            >
                <ReactApexChart
                    type="line"
                    height={200}
                    options={trendOptions}
                    series={trendSeries}
                />
            </div>

            {/* ── Tabel Histori Pengerjaan ── */}
            <SectionTitle>
                Histori Pengerjaan ({results.length} entri)
            </SectionTitle>
            <div
                style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "18px",
                }}
            >
                <Table noWrapper>
                    <TableHeader>
                        <TableRow>
                            <TableHead style={thC}>#</TableHead>
                            <TableHead style={th}>Tanggal Selesai</TableHead>
                            <TableHead style={th}>Asal Institusi</TableHead>
                            <TableHead style={th}>ID Unik</TableHead>
                            {results.some(
                                (r) => r.origin?.type === "SCHOOL",
                            ) && <TableHead style={th}>Kelas</TableHead>}
                            {results.some(
                                (r) => r.origin?.type !== "SCHOOL",
                            ) && <TableHead style={th}>Pekerjaan</TableHead>}
                            <TableHead style={thR}>Gus</TableHead>
                            <TableHead style={thR}>Ji</TableHead>
                            <TableHead style={thR}>Gang</TableHead>
                            <TableHead style={thR}>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((r, idx) => {
                            const total =
                                r.gus_point + r.ji_point + r.gang_point;
                            const isSchool = r.origin?.type === "SCHOOL";
                            return (
                                <TableRow key={r.id}>
                                    <TableCell
                                        style={{ ...tdC, color: T.muted }}
                                    >
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell style={td}>
                                        {ymdToIdDate(r.completed_at, true)}
                                    </TableCell>
                                    <TableCell style={td}>
                                        {r.origin?.name ?? "-"}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            ...td,
                                            fontSize: "10px",
                                            color: T.muted,
                                        }}
                                    >
                                        {r.participant_unique_code}
                                    </TableCell>
                                    {results.some(
                                        (x) => x.origin?.type === "SCHOOL",
                                    ) && (
                                        <TableCell style={td}>
                                            {isSchool
                                                ? (r.participant_class ?? "-")
                                                : "-"}
                                        </TableCell>
                                    )}
                                    {results.some(
                                        (x) => x.origin?.type !== "SCHOOL",
                                    ) && (
                                        <TableCell style={td}>
                                            {!isSchool
                                                ? (r.participant_work ?? "-")
                                                : "-"}
                                        </TableCell>
                                    )}
                                    <TableCell style={tdR}>
                                        {r.gus_point}
                                    </TableCell>
                                    <TableCell style={tdR}>
                                        {r.ji_point}
                                    </TableCell>
                                    <TableCell style={tdR}>
                                        {r.gang_point}
                                    </TableCell>
                                    <TableCell
                                        style={{ ...tdR, fontWeight: 700 }}
                                    >
                                        {total}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* ── Per-Pengerjaan Bar Chart ── */}
            <SectionTitle>Visualisasi Tiap Pengerjaan</SectionTitle>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                }}
            >
                {results.map((r, idx) => {
                    const opts: ApexOptions = {
                        chart: {
                            type: "bar",
                            toolbar: { show: false },
                            fontFamily: "SpaceGrotesk, sans-serif",
                            animations: { enabled: false },
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: "50%",
                                distributed: true,
                            },
                        },
                        colors: ["#10b981", "#3b82f6", "#f59e42"],
                        dataLabels: {
                            enabled: true,
                            style: { fontSize: "9px" },
                        },
                        xaxis: {
                            categories: ["Gus", "Ji", "Gang"],
                            labels: { style: { fontSize: "9px" } },
                        },
                        yaxis: { labels: { style: { fontSize: "9px" } } },
                        legend: { show: false },
                        grid: { borderColor: T.line },
                    };
                    return (
                        <div
                            key={r.id}
                            style={{
                                border: `1px solid ${T.border}`,
                                borderRadius: "6px",
                                padding: "8px 10px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    marginBottom: "4px",
                                    color: T.text,
                                }}
                            >
                                Pengerjaan #{idx + 1} —{" "}
                                {ymdToIdDate(r.completed_at, true)}
                            </p>
                            <ReactApexChart
                                type="bar"
                                height={140}
                                options={opts}
                                series={[
                                    {
                                        name: "Poin",
                                        data: [
                                            r.gus_point,
                                            r.ji_point,
                                            r.gang_point,
                                        ],
                                    },
                                ]}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Helpers ── */
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

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p
                style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    marginBottom: "1px",
                }}
            >
                {label}
            </p>
            <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>
                {value}
            </p>
        </div>
    );
}

export default AdminResultPrintShow;

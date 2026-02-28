import React, { useEffect } from "react";
import { ymdToIdDate } from "@/components/helper/helper";
import { Result } from "@/types/result";
import { Choice, Question } from "@/types/question";
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
    @page { margin: 10mm; size: A4 portrait; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
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
    result: Result;
    available_questions: Question[];
    available_choices: Choice[];
};

const AdminResultPrintAnswer = ({
    result,
    available_questions,
    available_choices,
}: PageProps) => {
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

    /* ── Bar chart: poin per kategori ── */
    const barOptions: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            fontFamily: "SpaceGrotesk, sans-serif",
            animations: { enabled: false },
        },
        plotOptions: {
            bar: { horizontal: false, columnWidth: "50%", distributed: true },
        },
        colors: ["#10b981", "#3b82f6", "#f59e42"],
        dataLabels: { enabled: true, style: { fontSize: "10px" } },
        xaxis: {
            categories: ["Gus", "Ji", "Gang"],
            labels: { style: { fontSize: "10px" } },
        },
        yaxis: {
            title: { text: "Poin", style: { fontSize: "10px" } },
            labels: { style: { fontSize: "10px" } },
        },
        legend: { show: false },
        grid: { borderColor: T.line },
    };
    const barSeries = [
        {
            name: "Poin",
            data: [result.gus_point, result.ji_point, result.gang_point],
        },
    ];

    /* ── Shared cell styles ── */
    const thBase: React.CSSProperties = {
        padding: "7px 8px",
        fontWeight: 600,
        borderBottom: `1.5px solid ${T.text}`,
        border: `1px solid ${T.border}`,
        background: "transparent",
        color: T.text,
        fontSize: "11px",
        textAlign: "center",
        whiteSpace: "nowrap",
    };
    const tdBase: React.CSSProperties = {
        padding: "5px 8px",
        border: `1px solid ${T.border}`,
        color: T.text,
        background: "transparent",
        fontSize: "11px",
        verticalAlign: "middle",
    };

    return (
        <div
            style={{
                background: "#fff",
                minHeight: "100vh",
                padding: "22px 26px",
                maxWidth: "960px",
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
                    marginBottom: "16px",
                    paddingBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div>
                    <h1
                        style={{ fontSize: "17px", fontWeight: 700, margin: 0 }}
                    >
                        Detail Jawaban Kuisioner
                    </h1>
                    <p
                        style={{
                            fontSize: "12px",
                            color: T.muted,
                            marginTop: "2px",
                        }}
                    >
                        {result.questionnaire?.title ?? "-"} — Pengerjaan ke-
                        {result.try_step}
                    </p>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        fontSize: "11px",
                        color: T.muted,
                    }}
                >
                    <p style={{ margin: 0 }}>Selesai pada:</p>
                    <p style={{ margin: 0, fontWeight: 600, color: T.text }}>
                        {ymdToIdDate(result.completed_at, true)}
                    </p>
                </div>
            </div>

            {/* ── Info Partisipan + Chart (side by side) ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr",
                    gap: "12px",
                    marginBottom: "18px",
                }}
            >
                {/* Info */}
                <div
                    style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: "6px",
                        padding: "12px 14px",
                    }}
                >
                    <SectionTitle>Info Partisipan</SectionTitle>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "7px",
                        }}
                    >
                        <InfoItem
                            label="Nama"
                            value={result.participant?.name ?? "-"}
                        />
                        <InfoItem
                            label="ID Unik"
                            value={result.participant_unique_code ?? "-"}
                        />
                        <InfoItem
                            label="Pengerjaan Ke"
                            value={String(result.try_step ?? "-")}
                        />
                        <InfoItem
                            label="Asal Institusi"
                            value={result.origin?.name ?? "-"}
                        />
                        {result.participant_class && (
                            <InfoItem
                                label="Kelas"
                                value={result.participant_class}
                            />
                        )}
                        {result.participant_work && (
                            <InfoItem
                                label="Pekerjaan"
                                value={result.participant_work}
                            />
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div
                    style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: "6px",
                        padding: "10px 12px",
                    }}
                >
                    <SectionTitle>Poin yang Didapatkan</SectionTitle>
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: "6px",
                        }}
                    >
                        <ScoreBadge
                            label="Gus"
                            value={result.gus_point}
                            color="#10b981"
                        />
                        <ScoreBadge
                            label="Ji"
                            value={result.ji_point}
                            color="#3b82f6"
                        />
                        <ScoreBadge
                            label="Gang"
                            value={result.gang_point}
                            color="#f59e42"
                        />
                        <ScoreBadge
                            label="Total"
                            value={
                                result.gus_point +
                                result.ji_point +
                                result.gang_point
                            }
                            color={T.text}
                            bold
                        />
                    </div>
                    <ReactApexChart
                        type="bar"
                        height={170}
                        options={barOptions}
                        series={barSeries}
                    />
                </div>
            </div>

            {/* ── Tabel Jawaban ── */}
            <SectionTitle>
                Detail Jawaban ({available_questions.length} pertanyaan)
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
                            {/* Row 1 */}
                            <TableHead
                                rowSpan={2}
                                style={{ ...thBase, width: "36px" }}
                            >
                                No
                            </TableHead>
                            <TableHead
                                rowSpan={2}
                                style={{
                                    ...thBase,
                                    textAlign: "left",
                                    minWidth: "200px",
                                }}
                            >
                                Pernyataan
                            </TableHead>
                            <TableHead
                                colSpan={available_choices.length}
                                style={{ ...thBase, background: "transparent" }}
                            >
                                Opsi Jawaban
                            </TableHead>
                        </TableRow>
                        <TableRow>
                            {/* Row 2 – choice columns */}
                            {available_choices.map((c) => (
                                <TableHead
                                    key={c.id}
                                    style={{
                                        ...thBase,
                                        fontSize: "10px",
                                        fontWeight: 500,
                                        minWidth: "54px",
                                    }}
                                >
                                    {c.choice}
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "9px",
                                            color: T.muted,
                                        }}
                                    >
                                        ({c.point} poin)
                                    </span>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {available_questions.map((q, idx) => (
                            <TableRow key={q.id}>
                                <TableCell
                                    style={{
                                        ...tdBase,
                                        textAlign: "center",
                                        color: T.muted,
                                    }}
                                >
                                    {idx + 1}
                                </TableCell>
                                <TableCell
                                    style={{ ...tdBase, textAlign: "left" }}
                                >
                                    {q.question}
                                </TableCell>
                                {available_choices.map((c) => {
                                    const selected = result.answers?.some(
                                        (a) =>
                                            a.question_id === q.id &&
                                            a.choice_id === c.id,
                                    );
                                    return (
                                        <TableCell
                                            key={c.id}
                                            style={{
                                                ...tdBase,
                                                textAlign: "center",
                                            }}
                                        >
                                            {selected ? (
                                                /* solid filled circle — prints well without background */
                                                <span
                                                    style={{
                                                        fontSize: "16px",
                                                        lineHeight: 1,
                                                        color: "#111827",
                                                    }}
                                                >
                                                    ●
                                                </span>
                                            ) : (
                                                ""
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                paddingBottom: "3px",
                marginBottom: "8px",
            }}
        >
            {children}
        </p>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
            <span
                style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    minWidth: "100px",
                }}
            >
                {label}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>{value}</span>
        </div>
    );
}

function ScoreBadge({
    label,
    value,
    color,
    bold,
}: {
    label: string;
    value: number;
    color: string;
    bold?: boolean;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <span style={{ fontSize: "9px", color: "#6b7280" }}>{label}</span>
            <span
                style={{
                    fontSize: "20px",
                    fontWeight: bold ? 800 : 700,
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}

export default AdminResultPrintAnswer;

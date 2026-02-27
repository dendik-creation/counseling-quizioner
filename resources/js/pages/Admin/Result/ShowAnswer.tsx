import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { PageTitleProps } from "@/types/global";
import { Result, ResultWithHumanizeParticipantGroup } from "@/types/result";
import {
    BadgeCheck,
    BadgeInfoIcon,
    BookUser,
    ChartColumnBig,
    ClipboardCheck,
    Eye,
    Table2Icon,
} from "lucide-react";
import { Participant } from "@/types/participant";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ymdToIdDate } from "@/components/helper/helper";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Choice, Question } from "@/types/question";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type PageProps = PageTitleProps & {
    result: Result;
    available_questions: Question[];
    available_choices: Choice[];
};

const AdminParticipantResultShowAnswer = ({
    title,
    description,
    result,
    available_questions,
    available_choices,
}: PageProps) => {
    const resultOption: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                distributed: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: ["Gus", "Ji", "Gang"],
        },
        yaxis: {
            title: {
                text: "Akumulasi Poin",
            },
        },
        fill: {
            opacity: 1,
            colors: ["#10b981", "#3b82f6", "#f59e42"],
        },
        colors: ["#10b981", "#3b82f6", "#f59e42"],
        legend: {
            show: false,
        },
    };
    return (
        <AppLayout>
            <PageTitle title={title} description={description} />
            <div className="flex mb-4 items-center gap-2">
                <BadgeInfoIcon className="text-slate-400" />
                <span className="text-sm">
                    Data ditampilkan ketika {ymdToIdDate(result.completed_at)}
                </span>
            </div>
            <div className="grid gap-6 grid-cols-3">
                {/*Participant Current Info*/}
                <Card className="py-3 col-span-3 lg:col-span-1">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <BookUser className="text-slate-400" />
                            <div className="flex flex-col">
                                <h3 className="font-semibold">
                                    Info Partisipan
                                </h3>
                            </div>
                        </div>
                        <div className="text-sm grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Nama
                                </span>
                                <span>{result.participant.name}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Kuisioner
                                </span>
                                <span>{result.questionnaire.title}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    ID Unik
                                </span>
                                <span>{result.participant_unique_code}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Pengerjaan Ke
                                </span>
                                <span>{result.try_step}</span>
                            </div>
                            {result.participant_class != null && (
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-600">
                                        Kelas
                                    </span>
                                    <span>{result.participant_class}</span>
                                </div>
                            )}
                            {result.participant_work != null && (
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-600">
                                        Pekerjaan
                                    </span>
                                    <span>{result.participant_work}</span>
                                </div>
                            )}
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Asal Institusi
                                </span>
                                <span>{result.origin.name}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/*Result Chart*/}
                <Card className="py-3 col-span-3 lg:col-span-2">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <ChartColumnBig className="text-slate-400" />
                            <div className="flex flex-col">
                                <h3 className="font-semibold">
                                    Poin yang didapatkan
                                </h3>
                            </div>
                        </div>
                        <ReactApexChart
                            options={resultOption}
                            type="bar"
                            series={[
                                {
                                    name: "Poin",
                                    data: [
                                        result.gus_point,
                                        result.ji_point,
                                        result.gang_point,
                                    ],
                                },
                            ]}
                            height={250}
                        />
                    </CardContent>
                </Card>
                {/*Answers Detail*/}
                <Card className="py-3 col-span-3">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <Table2Icon className="text-slate-400" />
                            <div className="flex flex-col">
                                <h3 className="font-semibold">
                                    Detail Jawaban
                                </h3>
                            </div>
                        </div>
                        <div className="relative max-h-[600px] overflow-auto">
                            <Table noWrapper>
                                <TableHeader className="sticky border border-black/70 top-0 z-10 bg-background">
                                    <TableRow>
                                        <TableHead
                                            rowSpan={2}
                                            style={{
                                                textAlign: "center",
                                            }}
                                            className="bg-yellow-200 font-semibold border border-black/70"
                                        >
                                            No
                                        </TableHead>
                                        <TableHead
                                            rowSpan={2}
                                            className="bg-yellow-200 font-semibold border border-black/70"
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            Pernyataan
                                        </TableHead>
                                        <TableHead
                                            className="bg-yellow-200 font-semibold border border-black/70"
                                            colSpan={available_choices.length}
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            Opsi
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        {available_choices.map((item, idx) => (
                                            <TableHead
                                                key={idx}
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                className="bg-stone-100 font-normal border border-black/70"
                                            >
                                                {item.choice} ({item.point})
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {available_questions.map(
                                        (question, idx) => (
                                            <TableRow key={question.id}>
                                                <TableCell className="border border-black/70 text-center">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell className="border border-black/70">
                                                    {question.question}
                                                </TableCell>
                                                {available_choices.map(
                                                    (choice) => {
                                                        const isSelected =
                                                            result.answers.some(
                                                                (answer) =>
                                                                    answer.question_id ===
                                                                        question.id &&
                                                                    answer.choice_id ===
                                                                        choice.id,
                                                            );
                                                        return (
                                                            <TableCell
                                                                key={choice.id}
                                                                className="border border-black/70 text-center"
                                                            >
                                                                <div className="flex items-center justify-center">
                                                                    {isSelected ? (
                                                                        <BadgeCheck />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    },
                                                )}
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};
export default AdminParticipantResultShowAnswer;

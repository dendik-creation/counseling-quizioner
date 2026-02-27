import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { PageTitleProps } from "@/types/global";
import { Result } from "@/types/result";
import { BookUser, ChartColumnBig, ClipboardCheck, Eye } from "lucide-react";
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
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type PageProps = PageTitleProps & {
    results: Result[];
    participant: Participant;
};

const AdminParticipantResultsShow = ({
    title,
    description,
    results,
    participant,
}: PageProps) => {
    const eachResultOption: ApexOptions = {
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

    const resultsOption: ApexOptions = {
        chart: {
            type: "line",
            toolbar: { show: true },
        },
        stroke: {
            curve: "smooth",
            width: 5,
            colors: ["#10b981", "#3b82f6", "#f59e42"],
        },
        yaxis: {
            title: {
                text: "Akumulasi Poin",
            },
        },
        xaxis: {
            categories: results.map((item) => ymdToIdDate(item.completed_at)),
        },
        legend: {
            show: true,
            horizontalAlign: "right",
        },
        markers: {
            size: 5,
            colors: ["#10b981", "#3b82f6", "#f59e42"],
        },
    };

    return (
        <AppLayout>
            <PageTitle title={title} description={description} />
            <div className="grid gap-6 grid-cols-3">
                {/*Participant Current Info*/}
                <Card className="py-3 col-span-3 lg:col-span-1">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <BookUser className="text-slate-400" />
                            <h3 className="font-semibold">
                                Info Partisipan (terbaru)
                            </h3>
                        </div>
                        <div className="text-sm grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Nama
                                </span>
                                <span>{participant.name}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Kuisioner
                                </span>
                                <span>{results[0].questionnaire.title}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    ID Unik
                                </span>
                                <span>{participant.unique_code}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Total pengerjaan
                                </span>
                                <span>{results.length} kali</span>
                            </div>
                            {participant.class != null && (
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-600">
                                        Kelas
                                    </span>
                                    <span>{participant.class}</span>
                                </div>
                            )}
                            {participant.work != null && (
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-600">
                                        Pekerjaan
                                    </span>
                                    <span>{participant.work}</span>
                                </div>
                            )}
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-600">
                                    Asal Institusi
                                </span>
                                <span>{participant.origin.name}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/*Results Trend*/}
                <Card className="py-3 col-span-3 lg:col-span-2">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <ChartColumnBig className="text-slate-400" />
                            <h3 className="font-semibold">
                                Trend Hasil Kuisioner
                            </h3>
                        </div>
                        <ReactApexChart
                            options={resultsOption}
                            type="line"
                            height={350}
                            series={[
                                {
                                    name: "Gus",
                                    data: results.map((item) => item.gus_point),
                                    color: "#10b981",
                                },
                                {
                                    name: "Ji",
                                    data: results.map((item) => item.ji_point),
                                    color: "#3b82f6",
                                },
                                {
                                    name: "Gang",
                                    data: results.map(
                                        (item) => item.gang_point,
                                    ),
                                    color: "#f59e42",
                                },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/*Results History*/}
                <div className="col-span-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 mb-2">
                            <ClipboardCheck className="text-slate-700" />
                            <h3 className="font-semibold">
                                Histori Pengerjaan
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {/*Result content*/}
                            {results.map((item, index) => (
                                <Accordion
                                    type="single"
                                    key={item.id}
                                    collapsible
                                >
                                    <AccordionItem value={`result-${index}`}>
                                        <AccordionTrigger className="font-bold cursor-pointer text-md hover:no-underline bg-gray-100 px-4 rounded-md mb-2 border">
                                            {ymdToIdDate(
                                                item.completed_at,
                                                true,
                                            )}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Card className={`py-3`}>
                                                <CardContent className="px-3">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col mb-3">
                                                            <div className="flex gap-3 items-start">
                                                                <span className="font-semibold text-slate-600">
                                                                    Asal
                                                                    Institusi
                                                                </span>
                                                                <span>
                                                                    {
                                                                        item
                                                                            .origin
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                            {item.origin.type ==
                                                            "SCHOOL" ? (
                                                                <>
                                                                    <div className="flex gap-3 items-start">
                                                                        <span className="font-semibold text-slate-600">
                                                                            ID
                                                                            Unik
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                item.participant_unique_code
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex gap-3 items-start">
                                                                        <span className="font-semibold text-slate-600">
                                                                            Kelas
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                item.participant_class
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex gap-3 items-start">
                                                                    <span className="font-semibold text-slate-600">
                                                                        Pekerjaan
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            item.participant_work
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/admin/results/part-${item.participant_id}/res-${item.id}`}
                                                        >
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
                                                            >
                                                                <Eye />
                                                                <span>
                                                                    Lihat
                                                                    Jawaban
                                                                </span>
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    {/*Chart*/}
                                                    <ReactApexChart
                                                        options={
                                                            eachResultOption
                                                        }
                                                        type="bar"
                                                        series={[
                                                            {
                                                                name: "Poin",
                                                                data: [
                                                                    item.gus_point,
                                                                    item.ji_point,
                                                                    item.gang_point,
                                                                ],
                                                            },
                                                        ]}
                                                        height={250}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
export default AdminParticipantResultsShow;

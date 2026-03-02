import {
    PaginatorBuilder,
    SearchInput,
    SelectSearchInput,
} from "@/components/custom/FormElement";
import { inputDebounce, ymdToIdDate } from "@/components/helper/helper";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { Link, router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import EmptyTable from "@/components/custom/EmptyTable";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PageTitleProps, PaginationData, SelectOption } from "@/types/global";
import { ResultWithHumanizeParticipantGroup } from "@/types/result";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type PageProps = PageTitleProps & {
    results: PaginationData<ResultWithHumanizeParticipantGroup>;
    available_questionnaires: SelectOption[];
    filters: {
        search?: string;
        questionnaire_id?: string;
    };
};

const TeacherResultIndex = ({
    title,
    description,
    results,
    available_questionnaires,
    filters,
}: PageProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: filters.search || "",
        questionnaire_id: filters.questionnaire_id?.toString() || "",
    });

    const handleFilter = (key: keyof typeof filterData, value: string) =>
        setFilterData(key, value);

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/teacher/results",
            { search: data.search, questionnaire_id: data.questionnaire_id },
            { preserveState: true, replace: true, only: ["results"] },
        );
    });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        debounceSearch(filterData);
    }, [filterData]);

    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-3 lg:gap-4">
                    <SearchInput
                        placeholder="Cari info partisipan"
                        className="w-full md:max-w-xs lg:max-w-sm"
                        onChange={(e) => handleFilter("search", e.target.value)}
                        value={filterData.search || ""}
                    />
                    <div className="w-full md:w-auto">
                        <SelectSearchInput
                            className="w-full md:min-w-[180px] lg:min-w-[220px]"
                            placeholder="Filter Kuisioner"
                            value={filterData.questionnaire_id.toString() || ""}
                            options={available_questionnaires}
                            onChange={(value) =>
                                handleFilter(
                                    "questionnaire_id",
                                    value.toString(),
                                )
                            }
                            removeValue={() =>
                                handleFilter("questionnaire_id", "")
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Table — tanpa kolom Institusi (1 sekolah saja) */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-stone-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Partisipan
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Kuisioner
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Terakhir Selesai
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Total Pengerjaan
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.data.map((result, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    {result.participant.name}
                                </TableCell>
                                <TableCell>
                                    {result.questionnaire.title}
                                </TableCell>
                                <TableCell>
                                    {ymdToIdDate(
                                        result.results[0].completed_at,
                                        true,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {result.results.length} kali
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/teacher/results/part-${result.participant.id}/quiz-${result.questionnaire.id}`}
                                    >
                                        <Button variant="outline">
                                            <Eye />
                                            <span>Lihat</span>
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {results.data.length === 0 && (
                            <EmptyTable
                                colSpan={6}
                                message="Belum ada hasil kuisioner"
                            />
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-3">
                <p className="text-sm w-full">Total {results.total} Data</p>
                {results.total > results.per_page && (
                    <PaginatorBuilder
                        prevUrl={results.prev_page_url ?? "#"}
                        nextUrl={results.next_page_url ?? "#"}
                        currentPage={results.current_page}
                        totalPage={results.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default TeacherResultIndex;

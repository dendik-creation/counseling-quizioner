import { PaginatorBuilder, SearchInput } from "@/components/custom/FormElement";
import AppLayout from "@/partials/AppLayout";
import { PageTitle, PageTitleProps } from "@/Partials/PageTitle";
import { Origin } from "@/types/origin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useRef } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { humanizeOriginType, inputDebounce } from "@/components/helper/helper";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import EmptyTable from "@/components/custom/EmptyTable";
import { PaginationData } from "@/types/global";

type PageProps = PageTitleProps & {
    origins: PaginationData<Origin>;
    search: string;
};

const MgbkOriginIndex = ({
    title,
    description,
    origins,
    search,
}: PageProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
    });
    const handleFilter = (key: keyof typeof filterData, value: string) => {
        setFilterData(key, value);
    };

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/mgbk/origins",
            {
                search: data.search,
            },
            {
                preserveState: true,
                replace: true,
                only: ["origins"],
            },
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
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 w-full">
                    <SearchInput
                        placeholder={`Cari berdasarkan nama`}
                        className="lg:max-w-sm w-full"
                        onChange={(e) => handleFilter("search", e.target.value)}
                        value={filterData.search || ""}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-stone-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Tipe
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Kota
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Jumlah Partisipan
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {origins.data.map((origin, index) => (
                            <TableRow key={origin.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{origin.name}</TableCell>
                                <TableCell>
                                    {humanizeOriginType(origin.type)}
                                </TableCell>
                                <TableCell>{origin.city ?? "-"}</TableCell>
                                <TableCell>
                                    <Link
                                        href={`/mgbk/participants?origin=${origin.id}`}
                                    >
                                        <Button variant={"outline"}>
                                            <Eye />
                                            <span>
                                                Lihat (
                                                {origin.participant_count || 0})
                                            </span>
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {origins.data.length == 0 && (
                            <EmptyTable
                                colSpan={5}
                                message="Data asal partisipan tidak ada"
                            />
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center mt-3">
                <p className="text-sm w-full">Total {origins.total} Data</p>
                {origins.total > origins.per_page && (
                    <PaginatorBuilder
                        prevUrl={origins.prev_page_url ?? "#"}
                        nextUrl={origins.next_page_url ?? "#"}
                        currentPage={origins.current_page}
                        totalPage={origins.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default MgbkOriginIndex;

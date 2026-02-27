import { PaginatorBuilder, SearchInput } from "@/components/custom/FormElement";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { AdminOriginIndexProps } from "@/types/origin";
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
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import EmptyTable from "@/components/custom/EmptyTable";
import AdminOriginEdit from "./ModalEdit";
import AdminOriginCreate from "./ModalCreate";

const AdminOriginIndex = ({
    title,
    description,
    origins,
    search,
}: AdminOriginIndexProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
    });
    const handleFilter = (key: keyof typeof filterData, value: string) => {
        setFilterData(key, value);
    };

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/admin/origins",
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

    const handleDelete = (id: number) => {
        router.delete(`/admin/origins/${id}`, {
            preserveScroll: true,
            replace: true,
            only: ["origins"],
        });
    };

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
                <AdminOriginCreate />
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
                                Jumlah Partisipan
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Aksi
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
                                <TableCell>
                                    <Link
                                        href={`/admin/participants?origin=${origin.id}`}
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
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <AdminOriginEdit origin={origin} />
                                        <ConfirmDialog
                                            triggerNode={
                                                <span>
                                                    <Button
                                                        variant={"red"}
                                                        size={"icon"}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </span>
                                            }
                                            title="Hapus asal partisipan"
                                            description="Menghapus asal partisipan menyebabkan hilangnya asal setiap partisipan. Apakah anda yakin ?"
                                            type="danger"
                                            confirmAction={() =>
                                                handleDelete(
                                                    origin.id as number,
                                                )
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {origins.data.length == 0 && (
                            <EmptyTable
                                colSpan={5}
                                message="Asal partisipan tidak ada"
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

export default AdminOriginIndex;

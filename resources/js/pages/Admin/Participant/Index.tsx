import {
    PaginatorBuilder,
    SearchInput,
    SelectSearchInput,
} from "@/components/custom/FormElement";
import { inputDebounce } from "@/components/helper/helper";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { AdminParticipantIndexProps } from "@/types/participant";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import EmptyTable from "@/components/custom/EmptyTable";
import AdminParticipantEdit from "./ModalEdit";

const AdminParticipantIndex = ({
    title,
    description,
    participants,
    origins,
    origin,
    search,
}: AdminParticipantIndexProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
        origin: origin || "",
    });
    const handleFilter = (key: keyof typeof filterData, value: string) => {
        setFilterData(key, value);
    };

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/admin/participants",
            {
                search: data.search,
                origin: data.origin,
            },
            {
                preserveState: true,
                replace: true,
                only: ["participants"],
            },
        );
    });

    const handleDelete = (id: number) => {
        router.delete(`/admin/participants/${id}`, {
            preserveScroll: true,
            replace: true,
            only: ["participants"],
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
                        placeholder={`Cari berdasarkan nama, kelas, pekerjaan`}
                        className="lg:max-w-sm w-full"
                        onChange={(e) => handleFilter("search", e.target.value)}
                        value={filterData.search || ""}
                    />
                    <div className="">
                        <SelectSearchInput
                            placeholder="Pilih Tipe Asal"
                            options={origins}
                            value={filterData.origin || ""}
                            onChange={(value) =>
                                handleFilter("origin", value.toString())
                            }
                            removeValue={() => handleFilter("origin", "")}
                        />
                    </div>
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
                                ID Unik
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Asal Partisipan
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Kelas
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Pekerjaan
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.data.map((participant, index) => (
                            <TableRow key={participant.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{participant.unique_code}</TableCell>
                                <TableCell>{participant.name}</TableCell>
                                <TableCell>{participant.origin.name}</TableCell>
                                <TableCell>
                                    {participant?.class || "-"}
                                </TableCell>
                                <TableCell>
                                    {participant?.work || "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <AdminParticipantEdit
                                            participant={participant}
                                            origins={origins}
                                        />
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
                                            title="Hapus partisipan"
                                            description="Menghapus partisipan menyebabkan hilangnya jejak kuisioner yang telah dikerjalan. Apakah anda yakin ?"
                                            type="danger"
                                            confirmAction={() =>
                                                handleDelete(
                                                    participant.id as number,
                                                )
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {participants.data.length == 0 && (
                            <EmptyTable
                                colSpan={7}
                                message="Partisipan tidak ada"
                            />
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center mt-3">
                <p className="text-sm w-full">
                    Total {participants.total} Data
                </p>
                {participants.total > participants.per_page && (
                    <PaginatorBuilder
                        prevUrl={participants.prev_page_url ?? "#"}
                        nextUrl={participants.next_page_url ?? "#"}
                        currentPage={participants.current_page}
                        totalPage={participants.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default AdminParticipantIndex;

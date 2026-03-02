import {
    PaginatorBuilder,
    SearchInput,
    SelectSearchInput,
} from "@/components/custom/FormElement";
import { inputDebounce } from "@/components/helper/helper";
import AppLayout from "@/partials/AppLayout";
import { PageTitle, PageTitleProps } from "@/Partials/PageTitle";
import { Participant } from "@/types/participant";
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
import TeacherParticipantEdit from "./ModalEdit";
import { PaginationData } from "@/types/global";

type PageProps = PageTitleProps & {
    participants: PaginationData<Participant>;
    search: string;
};

const TeacherParticipantIndex = ({
    title,
    description,
    participants,
    search,
}: PageProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
    });

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/teacher/participants",
            { search: data.search },
            { preserveState: true, replace: true, only: ["participants"] },
        );
    });

    const handleDelete = (id: number) => {
        router.delete(`/teacher/participants/${id}`, {
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
                        placeholder="Cari berdasarkan nama, kelas, pekerjaan"
                        className="lg:max-w-sm w-full"
                        onChange={(e) =>
                            setFilterData("search", e.target.value)
                        }
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
                                ID Unik
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama
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
                                <TableCell>
                                    {participant?.class || "-"}
                                </TableCell>
                                <TableCell>
                                    {participant?.work || "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <TeacherParticipantEdit
                                            participant={participant}
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
                                            description="Menghapus partisipan menyebabkan hilangnya jejak kuisioner yang telah dikerjakan. Apakah anda yakin?"
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
                        {participants.data.length === 0 && (
                            <EmptyTable
                                colSpan={6}
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

export default TeacherParticipantIndex;

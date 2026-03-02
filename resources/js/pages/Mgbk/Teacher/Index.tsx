import { PaginatorBuilder, SearchInput } from "@/components/custom/FormElement";
import {
    humanizeLevelAsRole,
    inputDebounce,
    ymdToIdDate,
} from "@/components/helper/helper";
import AppLayout from "@/partials/AppLayout";
import { PageTitle, PageTitleProps } from "@/Partials/PageTitle";
import { User } from "@/types/user";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import AdminUserEdit from "./ModalEdit";
import EmptyTable from "@/components/custom/EmptyTable";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaginationData } from "@/types/global";

type PageProps = PageTitleProps & {
    users: PaginationData<User>;
    search: string;
};

const MgbkTeacherIndex = ({ title, description, users, search }: PageProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
    });
    const handleFilter = (key: keyof typeof filterData, value: string) => {
        setFilterData(key, value);
    };

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/mgbk/users",
            {
                search: data.search,
            },
            {
                preserveState: true,
                replace: true,
                only: ["users"],
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
                                Username (NIP)
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Institusi
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Bergabung sejak
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Status Aktif
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>
                                    {user.origin?.name ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {ymdToIdDate(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    {user.is_active == null ? (
                                        <Badge variant={"outline"}>
                                            Butuh Persetujuan
                                        </Badge>
                                    ) : user.is_active ? (
                                        <Badge variant={"green"}>Aktif</Badge>
                                    ) : (
                                        <Badge variant={"red"}>
                                            Tidak Aktif
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <AdminUserEdit user={user} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.data.length == 0 && (
                            <EmptyTable colSpan={7} message="Guru tidak ada" />
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center mt-3">
                <p className="text-sm w-full">Total {users.total} Data</p>
                {users.total > users.per_page && (
                    <PaginatorBuilder
                        prevUrl={users.prev_page_url ?? "#"}
                        nextUrl={users.next_page_url ?? "#"}
                        currentPage={users.current_page}
                        totalPage={users.last_page}
                    />
                )}
            </div>
        </AppLayout>
    );
};
export default MgbkTeacherIndex;

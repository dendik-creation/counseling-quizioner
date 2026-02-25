import {
    PaginatorBuilder,
    SearchInput,
    SelectSearchInput,
} from "@/components/custom/FormElement";
import {
    humanizeLevelAsRole,
    inputDebounce,
    ymdToIdDate,
} from "@/components/helper/helper";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { AdminUserIndexProps } from "@/types/user";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import AdminUserCreate from "./ModalCreate";
import AdminUserEdit from "./ModalEdit";
import AdminUserModalResetPassword from "./ModalResetPassword";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import EmptyTable from "@/components/custom/EmptyTable";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const AdminUserIndex = ({
    title,
    description,
    users,
    search,
    level,
}: AdminUserIndexProps) => {
    const firstRender = useRef(true);
    const { data: filterData, setData: setFilterData } = useForm({
        search: search || "",
        level: level || "",
    });
    const handleFilter = (key: keyof typeof filterData, value: string) => {
        setFilterData(key, value);
    };

    const debounceSearch = inputDebounce((data: typeof filterData) => {
        router.get(
            "/admin/users",
            {
                search: data.search,
                level: data.level,
            },
            {
                preserveState: true,
                replace: true,
                only: ["users"],
            },
        );
    });

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
            replace: true,
            only: ["users"],
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
                    <div className="">
                        <SelectSearchInput
                            className="w-full"
                            placeholder="Pilih Role"
                            value={filterData.level.toString() || ""}
                            options={[
                                {
                                    label: "Admin",
                                    value: "1",
                                },
                                {
                                    label: "MGBK",
                                    value: "2",
                                },
                                {
                                    label: "Guru BK",
                                    value: "3",
                                },
                            ]}
                            onChange={(value) =>
                                handleFilter("level", value.toString())
                            }
                            removeValue={() => handleFilter("level", "")}
                        />
                    </div>
                </div>
                <AdminUserCreate />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-stone-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Username
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Role
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
                                    {humanizeLevelAsRole(user.level.toString())}
                                </TableCell>
                                <TableCell>
                                    {ymdToIdDate(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <AdminUserEdit user={user} />
                                        <AdminUserModalResetPassword
                                            id={user.id}
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
                                            title="Hapus User"
                                            description="Menghapus user menyebabkan kehilangan akses terhadap sistem. Apakah anda yakin ?"
                                            type="danger"
                                            confirmAction={() =>
                                                handleDelete(user.id as number)
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.data.length == 0 && (
                            <EmptyTable colSpan={6} message="User tidak ada" />
                        )}
                    </TableBody>
                </Table>
            </div>
            {users.total > users.per_page && (
                <PaginatorBuilder
                    prevUrl={users.prev_page_url ?? "#"}
                    nextUrl={users.next_page_url ?? "#"}
                    currentPage={users.current_page}
                    totalPage={users.last_page}
                />
            )}
        </AppLayout>
    );
};
export default AdminUserIndex;

import { SelectSearchInput } from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { useForm } from "@inertiajs/react";
import { CircleX, Loader, Pencil, Save, Shield } from "lucide-react";
import React from "react";

const AdminTeacherEdit = ({ user }: { user: User }) => {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        clearErrors,
        setError,
        reset,
    } = useForm({
        id: user.id || undefined,
        is_active:
            user.is_active == null ? "" : user.is_active ? "true" : "false",
    });

    const handleChangeInput = (key: keyof typeof data, value: string) => {
        setData(key, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/mgbk/users/${user.id}/active-status`, {
            replace: true,
            preserveState: true,
            only: ["users"],
            onSuccess: () => reset(),
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} variant={"yellow"}>
                    <Shield />
                    <span>Ubah Status</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Keaktifan Guru</DialogTitle>
                    <DialogDescription className="mb-3">
                        Atur aktif tidaknya akun guru terpilih
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1">
                                Status Aktif
                            </label>
                            <div className="">
                                <SelectSearchInput
                                    placeholder="Pilih Keaktifan"
                                    options={[
                                        {
                                            label: "Aktif",
                                            value: "true",
                                        },
                                        {
                                            label: "Nonaktif",
                                            value: "false",
                                        },
                                    ]}
                                    value={data.is_active.toString() || ""}
                                    onChange={(value) =>
                                        handleChangeInput(
                                            "is_active",
                                            value.toString(),
                                        )
                                    }
                                    removeValue={() =>
                                        handleChangeInput("is_active", "")
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-9">
                    <DialogClose asChild disabled={processing}>
                        <Button
                            variant="red"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <CircleX /> Batalkan
                        </Button>
                    </DialogClose>
                    <Button
                        variant="yellow"
                        disabled={processing}
                        onClick={handleSubmit}
                        className="flex items-center gap-2"
                    >
                        {processing ? (
                            <Loader />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save /> Simpan
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminTeacherEdit;

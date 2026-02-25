import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { generateStringRand } from "@/components/helper/helper";
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
import { Input } from "@/components/ui/input";
import { Origin } from "@/types/origin";
import { useForm } from "@inertiajs/react";
import {
    CircleFadingPlus,
    CircleX,
    Dices,
    Loader,
    Pencil,
    Save,
} from "lucide-react";
import React from "react";

const AdminOriginEdit = ({ origin }: { origin: Origin }) => {
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
        name: origin.name || "",
        type: origin.type || "",
    });

    const handleChangeInput = (key: keyof typeof data, value: string) => {
        setData(key, value);
    };

    const validateForm = (): boolean => {
        let isValid = true;
        clearErrors();
        if (!data.name || data.name.trim() === "") {
            setError("name", "Nama Lengkap wajib diisi");
            isValid = false;
        }
        if (!data.type || data.type.trim() === "") {
            setError("type", "Tipe asal wajib dipilih");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        put(`/admin/origins/${origin.id}`, {
            replace: true,
            preserveState: true,
            only: ["origins"],
            onSuccess: () => reset(),
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"icon"} variant={"blue"}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Edit Asal</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silakan perbarui informasi asal partisipan di bawah ini.
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Nama Asal
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan Nama Asal"
                                className="w-full"
                                disabled={processing}
                                value={data.name || ""}
                                onChange={(e) =>
                                    handleChangeInput("name", e.target.value)
                                }
                            />
                            {errors.name && <ErrorInput error={errors.name} />}
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Tipe Asal
                            </label>
                            <div className="">
                                <SelectSearchInput
                                    placeholder="Pilih Tipe Asal"
                                    options={[
                                        {
                                            label: "Sekolah",
                                            value: "SCHOOL",
                                        },
                                        {
                                            label: "Umum",
                                            value: "COMMON",
                                        },
                                    ]}
                                    value={data.type || ""}
                                    onChange={(value) =>
                                        handleChangeInput(
                                            "type",
                                            value.toString(),
                                        )
                                    }
                                    removeValue={() =>
                                        handleChangeInput("type", "")
                                    }
                                />
                            </div>
                            {errors.type && <ErrorInput error={errors.type} />}
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

export default AdminOriginEdit;

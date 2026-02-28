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
import { SelectOption } from "@/types/global";
import { useForm } from "@inertiajs/react";
import { CircleFadingPlus, CircleX, Dices, Loader, Save } from "lucide-react";
import React from "react";

const AdminOriginCreate = ({
    available_mgbk,
}: {
    available_mgbk: SelectOption[];
}) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        setError,
        reset,
    } = useForm({
        name: "",
        type: "",
        city: "",
        mgbk_id: "",
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
        if (data.type === "SCHOOL" && (!data.city || data.city.trim() === "")) {
            setError("city", "Kota wajib diisi");
            isValid = false;
        }
        if (
            data.type === "SCHOOL" &&
            (!data.mgbk_id || data.mgbk_id.toString().trim() === "")
        ) {
            setError("mgbk_id", "MGBK wajib dipilih");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        post("/admin/origins", {
            replace: true,
            preserveState: true,
            only: ["origins"],
            onSuccess: () => reset(),
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"yellow"}>
                    <CircleFadingPlus />
                    <span>Tambah Asal</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Tambah Asal</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silakan isi data asal baru
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
                        {data.type === "SCHOOL" && (
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Kota
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Masukkan Kota"
                                    className="w-full"
                                    disabled={processing}
                                    value={data.city || ""}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "city",
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.city && (
                                    <ErrorInput error={errors.city} />
                                )}
                            </div>
                        )}
                        {data.type === "SCHOOL" && (
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    MGBK
                                </label>
                                <div className="">
                                    <SelectSearchInput
                                        placeholder="Pilih MGBK"
                                        options={available_mgbk}
                                        value={data.mgbk_id.toString() || ""}
                                        onChange={(value) =>
                                            handleChangeInput(
                                                "mgbk_id",
                                                value.toString(),
                                            )
                                        }
                                        removeValue={() =>
                                            handleChangeInput("mgbk_id", "")
                                        }
                                    />
                                </div>
                                {errors.mgbk_id && (
                                    <ErrorInput error={errors.mgbk_id} />
                                )}
                            </div>
                        )}
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

export default AdminOriginCreate;

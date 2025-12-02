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
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/global";
import { ParticipantOrigin } from "@/types/origin";
import { Participant } from "@/types/participant";
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

const AdminParticipantEdit = ({
    participant,
    origins,
}: {
    participant: Participant;
    origins: SelectOption[];
}) => {
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
        unique_code: participant.unique_code || "",
        name: participant.name || "",
        origin_id: participant.origin_id
            ? participant.origin_id.toString()
            : "",
        class: participant.class || "",
        work: participant.work || "",
    });

    const handleChangeInput = (key: keyof typeof data, value: string) => {
        setData(key, value);
    };

    const getOriginTypeById = (id: number) => {
        const origin = origins.find((item) => item.value == id.toString());
        return origin ? origin.additional_info?.type : "";
    };

    const validateForm = (): boolean => {
        let isValid = true;
        clearErrors();
        if (!data.unique_code || data.unique_code.trim() === "") {
            setError("unique_code", "ID partisipan wajib diisi");
            isValid = false;
        }
        if (!data.name || data.name.trim() === "") {
            setError("name", "Nama Lengkap wajib diisi");
            isValid = false;
        }
        if (!data.origin_id || data.origin_id.trim() === "") {
            setError("origin_id", "Asal partisipan wajib dipilih");
            isValid = false;
        }

        // For student
        if (
            data.origin_id &&
            data.origin_id ==
                origins.find((item) => item.label == "SCHOOL")?.value
        ) {
            if (!data.class || data.class.trim() === "") {
                setError(
                    "class",
                    "Kelas wajib diisi untuk partisipan dari sekolah",
                );
                isValid = false;
            }
        }
        // For common
        if (
            data.origin_id &&
            data.origin_id ==
                origins.find((item) => item.label == "COMMON")?.value
        ) {
            if (!data.work || data.work.trim() === "") {
                setError("work", "Pekerjaan wajib diisi untuk partisipan umum");
                isValid = false;
            }
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        put(`/admin/participants/${participant.id}`, {
            replace: true,
            preserveState: true,
            only: ["participants"],
            onSuccess: () => reset(),
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"blue"} size={"icon"}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Edit Partisipan</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silakan perbarui informasi dari partisipan di bawah ini.
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                ID Partisipan
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan ID Partisipan"
                                className="w-full"
                                disabled={processing}
                                value={data.unique_code || ""}
                                onChange={(e) =>
                                    handleChangeInput(
                                        "unique_code",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.unique_code && (
                                <ErrorInput error={errors.unique_code} />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Nama Lengkap
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
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
                                    options={origins}
                                    value={data.origin_id || ""}
                                    onChange={(value) =>
                                        handleChangeInput(
                                            "origin_id",
                                            value.toString(),
                                        )
                                    }
                                    removeValue={() =>
                                        handleChangeInput("origin_id", "")
                                    }
                                />
                            </div>
                            {errors.origin_id && (
                                <ErrorInput error={errors.origin_id} />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <label
                                className={cn(
                                    "text-base mb-1",
                                    getOriginTypeById(Number(data.origin_id)) ==
                                        "SCHOOL" &&
                                        "after:content-['*'] after:text-red-500 after:ml-1",
                                )}
                            >
                                Kelas
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan Kelas"
                                className="w-full"
                                disabled={processing}
                                value={data.class || ""}
                                onChange={(e) =>
                                    handleChangeInput("class", e.target.value)
                                }
                            />
                            {errors.class && (
                                <ErrorInput error={errors.class} />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <label
                                className={cn(
                                    "text-base mb-1",
                                    getOriginTypeById(Number(data.origin_id)) ==
                                        "COMMON" &&
                                        "after:content-['*'] after:text-red-500 after:ml-1",
                                )}
                            >
                                Pekerjaan
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan Pekerjaan"
                                className="w-full"
                                disabled={processing}
                                value={data.work || ""}
                                onChange={(e) =>
                                    handleChangeInput("work", e.target.value)
                                }
                            />
                            {errors.work && <ErrorInput error={errors.work} />}
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

export default AdminParticipantEdit;

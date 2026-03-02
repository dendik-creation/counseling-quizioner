import { ErrorInput } from "@/components/custom/FormElement";
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
import { Participant } from "@/types/participant";
import { useForm } from "@inertiajs/react";
import { CircleX, Loader, Pencil, Save } from "lucide-react";
import React from "react";

const TeacherParticipantEdit = ({
    participant,
}: {
    participant: Participant;
}) => {
    const { data, setData, put, processing, errors, clearErrors, reset } =
        useForm({
            unique_code: participant.unique_code || "",
            name: participant.name || "",
            class: participant.class || "",
            work: participant.work || "",
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        if (!data.unique_code.trim()) return;
        if (!data.name.trim()) return;
        put(`/teacher/participants/${participant.id}`, {
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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Partisipan</DialogTitle>
                    <DialogDescription className="mb-3">
                        Perbarui informasi partisipan di bawah ini.
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                ID Partisipan
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan ID Partisipan"
                                disabled={processing}
                                value={data.unique_code}
                                onChange={(e) =>
                                    setData("unique_code", e.target.value)
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
                                disabled={processing}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && <ErrorInput error={errors.name} />}
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1">Kelas</label>
                            <Input
                                type="text"
                                placeholder="Masukkan Kelas"
                                disabled={processing}
                                value={data.class}
                                onChange={(e) =>
                                    setData("class", e.target.value)
                                }
                            />
                            {errors.class && (
                                <ErrorInput error={errors.class} />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1">Pekerjaan</label>
                            <Input
                                type="text"
                                placeholder="Masukkan Pekerjaan"
                                disabled={processing}
                                value={data.work}
                                onChange={(e) =>
                                    setData("work", e.target.value)
                                }
                            />
                            {errors.work && <ErrorInput error={errors.work} />}
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-6">
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

export default TeacherParticipantEdit;

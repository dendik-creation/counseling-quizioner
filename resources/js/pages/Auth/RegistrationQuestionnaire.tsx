import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import {
    DoorOpen,
    GraduationCap,
    Loader,
    LogIn,
    User,
    BriefcaseBusiness,
    Hash,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function RegistrationQuestionnaire({
    app_name,
    origins,
    participants,
}: {
    app_name: string;
    origins: any[];
    participants: any[];
}) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, setError } = useForm({
        participant_id: "",
        name: "",
        unique_code: "",
        class: "",
        work: "",
        origin_id: "",
        status_regis: "new",
    });

    const [mode, setMode] = useState<"new" | "existing">("new");
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

    const changeMode = (newMode: "new" | "existing") => {
        setMode(newMode);
        setData({
            participant_id: "",
            name: "",
            unique_code: "",
            class: "",
            work: "",
            origin_id: "",
            status_regis: newMode,
        });

        setSelectedParticipant(null);
    };

    useEffect(() => {
        if (flash?.success) {
            BlastToaster("success", flash.success);
        } else if (flash?.error) {
            BlastToaster("error", flash.error);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // removeLocalStorage("current_role");
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "existing") {
            if (!selectedParticipant) {
                BlastToaster("error", "Pilih peserta");
                return;
            }
        }

        if (!data.name) setError("name", "Masukkan nama lengkap");
        if (!data.unique_code) setError("unique_code", "Masukkan kode unik");
        if (!data.origin_id) setError("origin_id", "Pilih asal peserta");
        if (!data.name || !data.unique_code || !data.origin_id) return;
        post("/auth/questionnaire/register", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                return BlastToaster("error", errors.message);
            },
        });
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-7xl shadow-md mx-4 flex flex-col md:flex-row">
                <div className="w-full flex flex-col justify-center p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-center font-bold text-2xl">
                            Registrasi
                        </CardTitle>
                        <CardDescription className="text-center">
                            Masukkan data diri Anda untuk menjawab Kuis
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 mb-4 rounded-md bg-stone-200 border border-stone-300 text-stone-700 text-sm flex gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mt-0.5 text-stone-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            <div>
                                <span className="font-semibold">Catatan: </span>
                                Jika Anda{" "}
                                <span className="font-semibold">pelajar</span>,
                                isi bagian{" "}
                                <span className="font-semibold">Kelas</span>.
                                Jika Anda{" "}
                                <span className="font-semibold">
                                    masyarakat umum
                                </span>
                                , isi bagian{" "}
                                <span className="font-semibold">Pekerjaan</span>
                                . Isi sesuai kategori Anda.
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <Button
                                type="button"
                                variant={mode === "new" ? "brown" : "outline"}
                                onClick={() => changeMode("new")}
                            >
                                Peserta Baru
                            </Button>

                            <Button
                                type="button"
                                variant={
                                    mode === "existing" ? "brown" : "outline"
                                }
                                onClick={() => changeMode("existing")}
                            >
                                Sudah Pernah Isi
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <User />
                                    </span>

                                    {mode === "new" ? (
                                        <Input
                                            type="text"
                                            placeholder="Nama Lengkap"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`pl-10 py-6 ${
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                    ) : (
                                        <SelectSearchInput
                                            placeholder="Pilih Peserta"
                                            options={participants.map((p) => ({
                                                label: p.name,
                                                value: p.id,
                                            }))}
                                            value={selectedParticipant?.id}
                                            onChange={(val) => {
                                                const find = participants.find(
                                                    (p) => p.id == val,
                                                );

                                                setSelectedParticipant(find);

                                                setData(
                                                    "participant_id",
                                                    find.id,
                                                );
                                                setData("name", find.name);
                                                setData(
                                                    "unique_code",
                                                    find.unique_code,
                                                );
                                                setData(
                                                    "origin_id",
                                                    String(find.origin_id),
                                                );
                                                setData(
                                                    "class",
                                                    find.class ?? "",
                                                );
                                                setData(
                                                    "work",
                                                    find.work ?? "",
                                                );
                                            }}
                                            className="pl-10 py-3"
                                        />
                                    )}
                                </div>

                                {errors.name && (
                                    <ErrorInput error={errors.name} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <Hash />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Kode Unik"
                                        readOnly={mode === "existing"}
                                        autoFocus={true}
                                        value={data.unique_code}
                                        onChange={(e) =>
                                            setData(
                                                "unique_code",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.unique_code
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.unique_code && (
                                    <ErrorInput error={errors.unique_code} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <GraduationCap />
                                    </span>
                                    <SelectSearchInput
                                        placeholder="Pilih Asal Peserta"
                                        options={origins}
                                        disabled={mode === "existing"}
                                        value={data.origin_id}
                                        removeValue={() =>
                                            setData("origin_id", "")
                                        }
                                        onChange={(value) =>
                                            setData("origin_id", String(value))
                                        }
                                        className={`pl-10 py-3 ${
                                            errors.origin_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.origin_id && (
                                    <ErrorInput error={errors.origin_id} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <DoorOpen />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Kelas"
                                        readOnly={mode === "existing"}
                                        value={data.class}
                                        onChange={(e) =>
                                            setData("class", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.class ? "border-red-500" : ""
                                        }`}
                                    />
                                </div>
                                {errors.class && (
                                    <ErrorInput error={errors.class} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <BriefcaseBusiness />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Pekerjaan"
                                        value={data.work}
                                        readOnly={mode === "existing"}
                                        onChange={(e) =>
                                            setData("work", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.work ? "border-red-500" : ""
                                        }`}
                                    />
                                </div>
                                {errors.work && (
                                    <ErrorInput error={errors.work} />
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant={"brown"}
                                className="w-full p-6"
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>Register</span>
                                        <LogIn />
                                    </span>
                                )}
                            </Button>{" "}
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}

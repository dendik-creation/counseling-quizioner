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
    KeyRound,
    Hash,
} from "lucide-react";
import { useEffect } from "react";  

export default function Registration({
    app_name,
    participantOrigin,
}: {
    app_name: string;
    participantOrigin: any[];
}) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, setError } = useForm({
        name: "",
        unique_code: "",
        class: "",
        work: "",
        origin_id: "",
        token: "",
    });

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
        if (!data.name) setError("name", "Masukkan nama lengkap");
        if (!data.unique_code) setError("unique_code", "Masukkan kode unik");
        if (!data.origin_id) setError("origin_id", "Pilih asal peserta");
        if (!data.token) setError("token", "Masukkan token");
        if (
            !data.name ||
            !data.unique_code ||
            !data.origin_id ||
            !data.token
        )
            return;

        post("/auth/register", {
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
                            Masukkan data diri Anda untuk mengikuti tes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 mb-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm flex gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mt-0.5 text-yellow-600"
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <User />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        autoFocus={true}
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
                                        autoFocus={true}
                                        value={data.unique_code}
                                        onChange={(e) =>
                                            setData(
                                                "unique_code",
                                                e.target.value
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
                                        options={participantOrigin}
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

                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">
                                    <KeyRound />
                                </span>
                                <Input
                                    type="text"
                                    placeholder="Token Registrasi"
                                    value={data.token}
                                    onChange={(e) =>
                                        setData("token", e.target.value)
                                    }
                                    className={`pl-10 py-6 ${
                                        errors.token ? "border-red-500" : ""
                                    }`}
                                />

                                {errors.token && (
                                    <ErrorInput error={errors.token} />
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant={"yellow"}
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
                            </Button>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}

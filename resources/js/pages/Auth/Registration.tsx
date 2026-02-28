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
    Loader,
    LogIn,
    User,
    KeyRound,
    UserCog,
    ShieldCheck,
    Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function Registration({
    app_name,
    origins,
}: {
    app_name: string;
    origins: any[];
}) {
    const { flash } = usePage().props as any;
    const [isManualOrigin, setIsManualOrigin] = useState(false);
    const { data, setData, post, processing, errors, setError } = useForm({
        name: "",
        username: "",
        password: "",
        confirm_password: "",
        origin_status: false,
        origin_id: "",
        origin_name: "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name) setError("name", "Masukkan nama");
        if (!data.username) setError("username", "Masukkan username");
        if (!data.password) setError("password", "Masukkan password");
        if (data.password.length < 6)
            setError("password", "Password harus lebih dari 6 karakter");
        if (!data.confirm_password)
            setError("confirm_password", "Masukkan confirm password");
        if (data.confirm_password.length < 6)
            setError(
                "confirm_password",
                "Confirm Password harus lebih dari 6 karakter",
            );
        if (data.password !== data.confirm_password)
            setError("confirm_password", "Password tidak sama");
        if (!isManualOrigin && !data.origin_id)
            setError("origin_id", "Pilih instansi");
        if (isManualOrigin && !data.origin_name)
            setError("origin_name", "Isi nama instansi");
        if (
            !data.name ||
            !data.username ||
            !data.password ||
            !data.confirm_password ||
            data.password !== data.confirm_password ||
            (!isManualOrigin && !data.origin_id) ||
            (isManualOrigin && !data.origin_name)
        )
            return;

        post("/auth/register", {
            // data: {
            //     ...data,
            //     confirm_password: undefined,
            //     origin_id: isManualOrigin ? null : data.origin_id,
            // },
            // preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-xl shadow-md mx-4 flex flex-col md:flex-row">
                <div className="w-full flex flex-col justify-center p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-center font-bold text-2xl">
                            Registrasi
                        </CardTitle>
                        <CardDescription className="text-center">
                            Masukkan data diri Anda untuk akses Guru
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 mb-5 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm flex gap-3">
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
                                Jika Instansi tidak ditemukan, anda dapat
                                memasukkan secara manual.
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Nama Lengkap
                                </label>
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
                                            errors.name ? "border-red-500" : ""
                                        }`}
                                    />
                                </div>
                                {errors.name && (
                                    <ErrorInput error={errors.name} />
                                )}
                            </div>
                            <div className="relative">
                                <div className="flex justify-between">
                                    <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                        Instansi
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={isManualOrigin}
                                            onCheckedChange={(value) => {
                                                setIsManualOrigin(value);

                                                setData("origin_status", value);
                                                setData("origin_id", "");
                                                setData("origin_name", "");
                                            }}
                                        />
                                        <label className="text-base">
                                            Instansi tidak terdaftar
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <Building2 />
                                    </span>

                                    {!isManualOrigin && (
                                        <>
                                            <SelectSearchInput
                                                placeholder="Pilih Instansi"
                                                options={origins}
                                                value={data.origin_id}
                                                removeValue={() =>
                                                    setData("origin_id", "")
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        "origin_id",
                                                        String(value),
                                                    )
                                                }
                                                className={`pl-10 py-3 ${
                                                    errors.origin_id
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                            />{" "}
                                        </>
                                    )}

                                    {isManualOrigin && (
                                        <>
                                            <Input
                                                placeholder="Nama Instansi"
                                                className={`pl-10 py-6 ${
                                                    errors.origin_name
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                value={data.origin_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "origin_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                                {!isManualOrigin && (
                                    <>
                                        {errors.origin_id && (
                                            <ErrorInput
                                                error={errors.origin_id}
                                            />
                                        )}
                                    </>
                                )}

                                {isManualOrigin && (
                                    <>
                                        {errors.origin_name && (
                                            <ErrorInput
                                                error={errors.origin_name}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="relative">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Username
                                </label>
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <UserCog />
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        autoFocus={true}
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.username
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.username && (
                                    <ErrorInput error={errors.username} />
                                )}
                            </div>{" "}
                            <div className="relative">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Password
                                </label>
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <KeyRound />
                                    </span>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        autoFocus={true}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.password && (
                                    <ErrorInput error={errors.password} />
                                )}
                            </div>{" "}
                            <div className="relative">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Confirm Password
                                </label>
                                <div className="flex items-center">
                                    <span className="absolute left-3 text-gray-500">
                                        <ShieldCheck />
                                    </span>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        autoFocus={true}
                                        value={data.confirm_password}
                                        onChange={(e) =>
                                            setData(
                                                "confirm_password",
                                                e.target.value,
                                            )
                                        }
                                        className={`pl-10 py-6 ${
                                            errors.confirm_password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {errors.confirm_password && (
                                    <ErrorInput
                                        error={errors.confirm_password}
                                    />
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant={"yellow"}
                                className="w-full p-6 MT-6"
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

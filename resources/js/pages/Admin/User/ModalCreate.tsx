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
import AVAILABLE_CITIES from "@/lib/available_cities";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { CircleFadingPlus, CircleX, Dices, Loader, Save } from "lucide-react";
import React from "react";

const AdminUserCreate = () => {
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
        username: "",
        name: "",
        level: "",
        password: "",
        mgbk_city: "",
    });

    const {
        data: originByCity,
        setData: setOriginByCity,
        setDefaults: setDefaultsOriginByCity,
    } = useForm({
        origins: [] as string[],
    });

    const handleChangeInput = (key: keyof typeof data, value: string) => {
        setData(key, value);

        if (key == "mgbk_city") {
            handleFetchOriginByCity(value);
        }
    };

    const handleFetchOriginByCity = async (city: string) => {
        try {
            setDefaultsOriginByCity();
            const { data } = await axios.get(
                `/admin/users/get-origin-by-city/${city}`,
            );
            setOriginByCity("origins", data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRandomPassword = () => {
        const characters = generateStringRand(8, true, false, true);
        setData("password", characters);
    };

    const validateForm = (): boolean => {
        let isValid = true;
        clearErrors();
        if (!data.username || data.username.trim() === "") {
            setError("username", "Username wajib diisi");
            isValid = false;
        }
        if (!data.name || data.name.trim() === "") {
            setError("name", "Nama Lengkap wajib diisi");
            isValid = false;
        }
        if (!data.level || data.level.trim() === "") {
            setError("level", "Role wajib dipilih");
            isValid = false;
        }
        if (!data.password || data.password.trim() === "") {
            setError("password", "Password wajib diisi");
            isValid = false;
        }
        if (
            data.level === "2" &&
            (!data.mgbk_city || data.mgbk_city.trim() === "")
        ) {
            setError("mgbk_city", "Kota MGBK wajib diisi");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        post("/admin/users", {
            replace: true,
            preserveState: true,
            only: ["users"],
            onSuccess: () => reset(),
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"yellow"}>
                    <CircleFadingPlus />
                    <span>Tambah User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Tambah User</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silakan isi data user baru
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Username
                            </label>
                            <Input
                                type="text"
                                placeholder="Masukkan Username"
                                className="w-full"
                                disabled={processing}
                                value={data.username || ""}
                                onChange={(e) =>
                                    handleChangeInput(
                                        "username",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.username && (
                                <ErrorInput error={errors.username} />
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
                                Role
                            </label>
                            <div className="">
                                <SelectSearchInput
                                    placeholder="Pilih Role"
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
                                    value={data.level || ""}
                                    onChange={(value) =>
                                        handleChangeInput(
                                            "level",
                                            value.toString(),
                                        )
                                    }
                                    removeValue={() =>
                                        handleChangeInput("level", "")
                                    }
                                />
                            </div>
                            {errors.level && (
                                <ErrorInput error={errors.level} />
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Masukkan Password"
                                    className="w-full"
                                    disabled={processing}
                                    value={data.password || ""}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "password",
                                            e.target.value,
                                        )
                                    }
                                />
                                <Button
                                    type="button"
                                    onClick={handleRandomPassword}
                                    className="absolute top-0 right-0"
                                    variant={"yellow"}
                                    size={"icon"}
                                >
                                    <Dices />
                                </Button>
                            </div>
                            {errors.password && (
                                <ErrorInput error={errors.password} />
                            )}
                        </div>
                        {data.level == "2" && (
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                    Pilih Kota Pantauan MGBK
                                </label>
                                <div className="">
                                    <SelectSearchInput
                                        placeholder="Pilih Kota"
                                        options={AVAILABLE_CITIES}
                                        value={data.mgbk_city || ""}
                                        onChange={(value) =>
                                            handleChangeInput(
                                                "mgbk_city",
                                                value.toString(),
                                            )
                                        }
                                        removeValue={() =>
                                            handleChangeInput("mgbk_city", "")
                                        }
                                    />
                                </div>
                                {errors.mgbk_city && (
                                    <ErrorInput error={errors.mgbk_city} />
                                )}
                            </div>
                        )}
                        {data.level == "2" &&
                            originByCity.origins.length > 0 && (
                                <div className="flex flex-col w-full">
                                    <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                        Instansi atau area yang di pantau
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {originByCity.origins.map(
                                            (origin: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
                                                >
                                                    {origin.name}
                                                </div>
                                            ),
                                        )}
                                    </div>
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

export default AdminUserCreate;

import { ErrorInput, SelectSearchInput } from "@/components/custom/FormElement";
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
import { User } from "@/types/user";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { CircleX, Loader, Pencil, Save } from "lucide-react";
import React, { useEffect } from "react";

const AdminUserEdit = ({ user }: { user: User }) => {
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
        username: user.username || "",
        name: user.name || "",
        level: user.level || "",
        is_active:
            user.is_active == null ? "" : user.is_active ? "true" : "false",
        mgbk_city: user?.mgbk_city || "",
    });

    const {
        data: originByCity,
        setData: setOriginByCity,
        setDefaults: setDefaultsOriginByCity,
    } = useForm({
        origins: [] as string[],
    });

    useEffect(() => {
        if (data.mgbk_city) {
            handleFetchOriginByCity(data.mgbk_city);
        }
    }, []);

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
        if (!data.level) {
            setError("level", "Role wajib dipilih");
            isValid = false;
        }
        if (
            data.level.toString() === "2" &&
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
        put(`/admin/users/${user.id}`, {
            replace: true,
            preserveState: true,
            only: ["users"],
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
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silakan perbarui data user pada form di bawah ini.
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
                                    value={data.level.toString() || ""}
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
                        {data.level.toString() == "2" && (
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
                        {data.level.toString() == "2" &&
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

export default AdminUserEdit;

import { useEffect, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlastToaster from "@/components/custom/BlastToaster";
import { KeyRound } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function CheckToken({ app_name }: { app_name: string }) {
    const { flash } = usePage().props as any;
    const [loading, setLoading] = useState(false);

    const { data, setData, post, errors, setError } = useForm({
        token: new URLSearchParams(window.location.search).get("q") || "",
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
        if (!data.token.trim()) {
            // setError("name", "Masukkan nama lengkap");
            BlastToaster("error", "Token wajib diisi");
            return;
        }

        setLoading(true);

        post("/auth/questionnaire/check-token", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                setLoading(false);
                return BlastToaster("error", errors.message);
            },
        });
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-background p-4">
            <Toaster position={"bottom-right"} reverseOrder={false} />
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="flex flex-col items-center gap-2">
                    <KeyRound className="w-10 h-10 text-yellow-500" />
                    <h1 className="text-xl font-semibold">Akses Kuesioner</h1>
                    <p className="text-sm text-muted-foreground text-center">
                        Masukkan token untuk mengerjakan kuis
                    </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder="Masukkan Token"
                            value={data.token}
                            onChange={(e) =>
                                setData("token", e.target.value.toUpperCase())
                            }
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-5"
                            variant={"brown"}
                        >
                            {loading ? "Memeriksa..." : "Lanjutkan"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

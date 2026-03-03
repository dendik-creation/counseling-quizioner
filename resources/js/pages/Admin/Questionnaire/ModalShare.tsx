import BlastToaster from "@/components/custom/BlastToaster";
import { SelectSearchInput } from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Questionnaire } from "@/types/questionnaire";
import { useForm } from "@inertiajs/react";
import { ExternalLink, CircleCheck, Download, Copy } from "lucide-react";
import { useEffect } from "react";
import QRCode from "react-qr-code";

type ShareModalProps = {
    questionnaire: Questionnaire;
};

const QuestionnaireModalShare = ({ questionnaire }: ShareModalProps) => {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            method: "WITH_QR" as "WITH_QR" | "URL_ONLY",
            url_value: "",
        });

    const handleChangeMethod = (value: string) => {
        setData("method", value as "WITH_QR" | "URL_ONLY");
    };

    const buildUrlValue = () => {
        const url = `${window.location.origin}/start-quiz?q=${questionnaire.access_token}`;
        setData("url_value", url);
    };

    const handleDownloadQRCode = () => {
        const svg = document.getElementById("questionnaire-qr-code");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = 256;
                canvas.height = 256;
                ctx?.drawImage(img, 0, 0);
                const url = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.download = `qrcode-${questionnaire.title}.png`;
                link.href = url;
                link.click();
            };
            img.src = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(data.url_value);
        BlastToaster("success", "Link berhasil disalin");
    };

    useEffect(() => {
        buildUrlValue();
    }, [data.method]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"icon"} variant={"yellow"}>
                    <ExternalLink />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Bagikan Kuisioner</DialogTitle>
                    <DialogDescription className="mb-3">
                        Silahkan pilih metode pembagian kuisioner
                    </DialogDescription>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex flex-col w-full">
                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                Metode Pembagian
                            </label>
                            <div className="">
                                <SelectSearchInput
                                    placeholder="Pilih Metode"
                                    options={[
                                        {
                                            label: "QR Code",
                                            value: "WITH_QR",
                                        },
                                        {
                                            label: "Link Saja",
                                            value: "URL_ONLY",
                                        },
                                    ]}
                                    value={data.method || ""}
                                    onChange={(value) =>
                                        handleChangeMethod(value.toString())
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {data.method == "WITH_QR" && (
                        <div className="flex flex-col items-center lg:items-start w-full mt-2">
                            <label className="text-base mb-1">Preview</label>
                            <div className="">
                                <QRCode
                                    id="questionnaire-qr-code"
                                    value={data.url_value}
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>
                <DialogFooter className="mt-9">
                    <DialogClose>
                        {data.method == "WITH_QR" ? (
                            <Button
                                variant="yellow"
                                onClick={handleDownloadQRCode}
                                className="flex items-center gap-2"
                            >
                                <span className="flex items-center gap-2">
                                    <Download /> Download QR Code
                                </span>
                            </Button>
                        ) : (
                            <Button
                                variant="yellow"
                                onClick={handleCopyLink}
                                className="flex items-center gap-2"
                            >
                                <span className="flex items-center gap-2">
                                    <Copy /> Salin Link
                                </span>
                            </Button>
                        )}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuestionnaireModalShare;

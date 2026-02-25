import BlastToaster from "@/components/custom/BlastToaster";
import { DatePickerInput, ErrorInput } from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/partials/PageTitle";
import { PageTitleProps } from "@/types/global";
import { QuestionnaireEditProps } from "@/types/questionnaire";
import { useForm } from "@inertiajs/react";
import {
    ClipboardList,
    ListTodo,
    MinusCircle,
    PlusCircle,
    Save,
    RefreshCcw,
} from "lucide-react";
import React from "react";

const QuestionnaireEdit = ({
    title,
    description,
    questionnaire,
}: QuestionnaireEditProps) => {
    const { data, setData, put, processing, errors, setError, clearErrors } =
        useForm({
            title: questionnaire.title,
            description: questionnaire.description,
            access_token: questionnaire.access_token,
            expires_at: questionnaire.expires_at,
            choices: questionnaire.choices,
            questions: questionnaire.questions,
        });

    const newChoices = () => {
        setData("choices", [
            ...data.choices,
            {
                choice: "",
                point: 0,
            },
        ]);
    };

    const newQuestion = () => {
        setData("questions", [
            ...data.questions,
            {
                question: "",
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        setData(
            "questions",
            data.questions.filter((_, i) => i !== index),
        );
    };

    const removeChoice = (index: number) => {
        setData(
            "choices",
            data.choices.filter((_, i) => i !== index),
        );
    };

    const handleChangeQuestionnaire = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        setData(e.target.name as "title" | "description", e.target.value);
    };

    const handleChangeQuestion = (questionIdx: number, value: string) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].question = value;
        setData("questions", newQuestions);
    };

    const handleChangeChoice = (
        key: "choice" | "point",
        index: number,
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        const updatedChoices = data.choices.map((choice, i) => {
            if (i !== index) return choice;
            return {
                ...choice,
                [key]:
                    key === "point" ? Number(e.target.value) : e.target.value,
            };
        });
        setData("choices", updatedChoices);
    };

    const validateForm = (): boolean => {
        let valid = true;
        let hasToasterShown = false;
        clearErrors();

        if (!data.title.trim()) {
            setError("title", "Nama kuisioner wajib diisi");
            valid = false;
        }

        if (!data.description.trim()) {
            setError("description", "Deskripsi kuisioner wajib diisi");
            valid = false;
        }

        data.questions.forEach((q, idx) => {
            if (!q.question.trim()) {
                valid = false;
                setError(`questions.${idx}`, "Pertanyaan wajib diisi");
            }
        });

        if (hasToasterShown || !valid) {
            BlastToaster("error", "Lengkapi form terlebih dahulu");
        }

        return valid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        put("/admin/questionnaire/" + questionnaire.id, {
            preserveState: true,
            replace: true,
        });
    };

    const generateStringRand = (length: number): string => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    return (
        <AppLayout>
            <PageTitle title={title} description={description} />

            <form onSubmit={handleSubmit} className="relative">
                <Card className="py-3 mb-14">
                    <CardContent className="px-3">
                        <div className="flex items-center gap-3 mb-2">
                            <ClipboardList className="text-slate-400" />
                            <h3 className="font-semibold">
                                Informasi Kuisioner
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col w-full gap-3">
                                <div className="flex flex-col w-full">
                                    <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                        Nama
                                    </label>
                                    <Input
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder="Masukkan nama"
                                        value={data.title ?? ""}
                                        onChange={handleChangeQuestionnaire}
                                        className={cn(
                                            errors.title && "border-red-500",
                                        )}
                                    />
                                    {errors.title && (
                                        <ErrorInput error={errors.title} />
                                    )}
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                        Deskripsi
                                    </label>
                                    <Textarea
                                        name="description"
                                        id="description"
                                        placeholder="Masukkan deskripsi"
                                        value={data.description ?? ""}
                                        onChange={handleChangeQuestionnaire}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <ErrorInput
                                            error={errors.description}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-3 w-full">
                                <label className="text-base mb-4 after:content-['*'] after:text-red-500 after:ml-1">
                                    Generate Token
                                    <span className="text-sm">
                                        {" "}
                                        (Token digunakan untuk mengakses
                                        kuisioner)
                                    </span>
                                </label>

                                <div className="flex flex-col mb-2 lg:flex-row gap-5">
                                    <Button
                                        variant="green"
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                            const token = generateStringRand(6);
                                            setData("access_token", token);
                                        }}
                                    >
                                        Buat Token
                                    </Button>
                                    <div>
                                        <span className="font-mono text-normal text-lg">
                                            {data.access_token ||
                                                "Token belum dibuat"}
                                        </span>
                                        {errors.access_token && (
                                            <ErrorInput
                                                error={errors.access_token}
                                            />
                                        )}
                                    </div>
                                </div>
                                <DatePickerInput
                                    mode="single"
                                    placeholder="Expired"
                                    value={data.expires_at}
                                    withTime={true}
                                    onChange={(date: string | undefined) =>
                                        setData("expires_at", date ?? "")
                                    }
                                    className={cn(
                                        errors.expires_at && "border-red-500",
                                    )}
                                />
                                {errors.expires_at && (
                                    <ErrorInput error={errors.expires_at} />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CHOICES */}
                <div className="flex mb-3 items-center justify-end w-full">
                    <div className="sticky z-10 bg-white py-2">
                        <Button
                            variant={"yellow"}
                            className="flex items-center gap-2"
                            onClick={newChoices}
                            type="button"
                        >
                            <PlusCircle />
                            <span>Tambah Pilihan</span>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {data.choices.map((choice, idx) => (
                        <Card className="py-3" key={idx}>
                            <CardContent className="px-3">
                                <div className="flex justify-between items-center gap-3 mb-2">
                                    <div className="flex items-center gap-3">
                                        <ListTodo className="text-slate-400" />
                                        <h3 className="font-semibold">
                                            Pilihan {idx + 1}
                                        </h3>
                                    </div>
                                    {idx > 0 && (
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            variant={"red"}
                                            onClick={() => removeChoice(idx)}
                                            className="flex items-center gap-2"
                                        >
                                            <MinusCircle />
                                            <span>Hapus</span>
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                            Pilihan
                                        </label>
                                        <Textarea
                                            name={`choice-${idx}`}
                                            placeholder="Masukkan pilihan"
                                            rows={3}
                                            value={choice.choice}
                                            onChange={(e) =>
                                                handleChangeChoice(
                                                    "choice",
                                                    idx,
                                                    e,
                                                )
                                            }
                                            className={cn(
                                                errors[
                                                    `choices.${idx}.choice`
                                                ] && "border-red-500",
                                            )}
                                        />
                                        {errors[`choices.${idx}.choice`] && (
                                            <ErrorInput
                                                error={
                                                    errors[
                                                        `choices.${idx}.choice`
                                                    ]
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                            Poin
                                        </label>
                                        <Input
                                            type="number"
                                            name={`point-${idx}`}
                                            placeholder="Masukkan poin"
                                            value={choice.point}
                                            onChange={(e) =>
                                                handleChangeChoice(
                                                    "point",
                                                    idx,
                                                    e,
                                                )
                                            }
                                            className={cn(
                                                errors[
                                                    `choices.${idx}.point`
                                                ] && "border-red-500",
                                            )}
                                        />
                                        {errors[`choices.${idx}.point`] && (
                                            <ErrorInput
                                                error={
                                                    errors[
                                                        `choices.${idx}.point`
                                                    ]
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* QUESTIONS */}
                <div className="flex mb-3 items-center justify-end w-full">
                    <div className="sticky z-10 bg-white py-2">
                        <Button
                            variant={"yellow"}
                            className="flex items-center gap-2"
                            onClick={newQuestion}
                            type="button"
                        >
                            <PlusCircle />
                            <span>Tambah Pertanyaan</span>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {data.questions.map((question, questionIdx) => (
                        <Card className="py-3" key={questionIdx}>
                            <CardContent className="px-3">
                                <div className="flex justify-between items-center gap-3 mb-2">
                                    <div className="flex items-center gap-3">
                                        <ListTodo className="text-slate-400" />
                                        <h3 className="font-semibold">
                                            Pertanyaan {questionIdx + 1}
                                        </h3>
                                    </div>
                                    {questionIdx > 0 && (
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            variant={"red"}
                                            onClick={() =>
                                                removeQuestion(questionIdx)
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <MinusCircle />
                                            <span>Hapus</span>
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col w-full">
                                            <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                                Pertanyaan
                                            </label>
                                            <Textarea
                                                value={question.question}
                                                onChange={(e) =>
                                                    handleChangeQuestion(
                                                        questionIdx,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan pertanyaan"
                                                className={cn(
                                                    "border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
                                                )}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button
                    type="submit"
                    variant={"blue"}
                    disabled={processing}
                    className="flex w-full items-center gap-2"
                >
                    <Save />
                    <span>Perbarui</span>
                </Button>
            </form>
        </AppLayout>
    );
};

export default QuestionnaireEdit;

import BlastToaster from "@/components/custom/BlastToaster";
import {
    ErrorInput,
    RichTextEditorInput,
} from "@/components/custom/FormElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { PageTitleProps } from "@/types/global";
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

const QuestionnaireCreate = ({ title, description }: PageTitleProps) => {
    const choiceLetters = ["A", "B", "C", "D"];
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            title: "",
            description: "",
            access_token: "",
            expires_at: "",
            questions: [
                {
                    question: "",
                    choices: choiceLetters.map(() => ({
                        choice: "",
                        point: 0,
                    })),
                },
            ],
        });

    const newQuestion = () => {
        setData("questions", [
            ...data.questions,
            {
                question: "",
                choices: choiceLetters.map((letter) => ({
                    choice: "",
                    point: 0,
                })),
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        setData(
            "questions",
            data.questions.filter((_, i) => i !== index)
        );
    };

    const handleChangeQuestionnaire = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setData(e.target.name as "title" | "description", e.target.value);
    };

    const handleChangeQuestion = (questionIdx: number, value: string) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].question = value;
        setData("questions", newQuestions);
    };

    const handleChangeChoice = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].choices[choiceIdx][
            e.target.name as "choice"
        ] = e.target.value;
        setData("questions", newQuestions);
    };

    const handleChangeChoicePoint = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIdx].choices[choiceIdx][e.target.name as "point"] =
            Number(e.target.value);
        setData("questions", newQuestions);
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

        data.questions.forEach((q) => {
            const cleanQuestion = q.question
                .replace(/<[^>]+>/g, "")
                .replace(/&nbsp;/g, "")
                .trim();
            if (!cleanQuestion) {
                valid = false;
                hasToasterShown = true;
            }
            q.choices.forEach((c) => {
                if (!c.choice || !c.choice.trim()) {
                    valid = false;
                    hasToasterShown = true;
                }
            });
        });

        if (hasToasterShown || !valid) {
            BlastToaster("error", "Lengkapi form terlebih dahulu");
        }

        return valid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        post("/admin/questionnaire", {
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
                                            errors.title && "border-red-500"
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
                                    <textarea
                                        name="description"
                                        id="description"
                                        placeholder="Masukkan deskripsi"
                                        value={data.description ?? ""}
                                        onChange={handleChangeQuestionnaire}
                                        className={cn(
                                            "border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
                                            errors.description &&
                                                "border-red-500"
                                        )}
                                        rows={2}
                                    />
                                    {errors.description && (
                                        <ErrorInput
                                            error={errors.description}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-base mb-4 after:content-['*'] after:text-red-500 after:ml-1">
                                    Generate Token
                                    <span className="text-sm">
                                        {" "}
                                        (Token tidak bisa digunakan setelah
                                        tanggal expired)
                                    </span>
                                </label>

                                <div className="flex flex-col justify-center items-start gap-3">
                                    <Button
                                        variant={"green"}
                                        type="button"
                                        size={"default"}
                                        onClick={() => {
                                            const token = generateStringRand(6);
                                            setData("access_token", token);
                                        }}
                                    >
                                        <RefreshCcw />
                                    </Button>

                                    <div className="w-full mb-4">
                                        <h1
                                            className="text-4xl text-center font-bold"
                                            id="access_token"
                                        >
                                            {data.access_token ||
                                                "Token Belum Dibuat"}
                                        </h1>
                                        {errors.access_token && (
                                            <ErrorInput
                                                error={errors.access_token}
                                            />
                                        )}
                                    </div>

                                    <Input
                                        type="datetime-local"
                                        name="expires_at"
                                        id="expires_at"
                                        placeholder="Masukan tanggal expired"
                                        value={data.expires_at ?? ""}
                                        onChange={handleChangeQuestionnaire}
                                        className={cn(
                                            errors.expires_at &&
                                                "border-red-500"
                                        )}
                                    />
                                    {errors.expires_at && (
                                        <ErrorInput error={errors.expires_at} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                {data.questions.map((question, questionIdx) => (
                    <Card className="py-3 mb-4" key={questionIdx}>
                        <CardContent className="px-3">
                            <div className="flex justify-between items-center gap-3 mb-2">
                                <div className="flex items-center gap-3">
                                    <ListTodo className="text-slate-400" />
                                    <h3 className="font-semibold">
                                        Pertanyaan & Pilihan Jawab -{" "}
                                        {questionIdx + 1}
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
                                        <RichTextEditorInput
                                            height={300}
                                            content={question.question}
                                            onChange={(val: string) =>
                                                handleChangeQuestion(
                                                    questionIdx,
                                                    val
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className="text-base mb-1 after:content-['*'] after:text-red-500 after:ml-1">
                                            Pilihan Jawaban
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {question.choices.map(
                                                (choice, choiceIdx) => (
                                                    <div
                                                        key={choiceIdx}
                                                        className="flex items-center gap-2 relative"
                                                    >
                                                        <div className="absolute rounded-l-md bg-amber-200 h-full flex items-center justify-center w-8">
                                                            <span className="font-semibold">
                                                                {String.fromCharCode(
                                                                    65 +
                                                                        choiceIdx
                                                                )}
                                                            </span>
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            className="flex-9 ps-10"
                                                            name="choice"
                                                            value={
                                                                choice.choice
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeChoice(
                                                                    questionIdx,
                                                                    choiceIdx,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        <Input
                                                            type="number"
                                                            className="flex-1 ps-5"
                                                            name="point"
                                                            value={choice.point}
                                                            onChange={(e) =>
                                                                handleChangeChoicePoint(
                                                                    questionIdx,
                                                                    choiceIdx,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Button
                    type="submit"
                    variant={"blue"}
                    className="flex w-full items-center gap-2"
                >
                    <Save />
                    <span>Simpan</span>
                </Button>
            </form>
        </AppLayout>
    );
};

export default QuestionnaireCreate;

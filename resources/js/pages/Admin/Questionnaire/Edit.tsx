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

const choiceLetters = ["A", "B", "C", "D"];

type Choice = {
    id?: number | null;
    choice: string;
    point: number;
};

type Question = {
    id?: number | null;
    question: string;
    choices: Choice[];
};

interface FormData {
    title: string;
    description: string;
    expires_at: string;
    access_token: string;
    saved_questions: Question[];
    new_questions: Omit<Question, "id">[];
    deleted_questions: number[];
}

const QuestionnaireEdit = ({
    title,
    description,
    questionnaire,
}: QuestionnaireEditProps) => {
    const { data, setData, put, processing, errors, setError, clearErrors } =
        useForm<FormData>({
            title: questionnaire.title ?? "",
            description: questionnaire.description ?? "",
            access_token: questionnaire.access_token ?? "",
            expires_at: questionnaire.expires_at ?? "",
            saved_questions:
                questionnaire?.questions?.map((q) => ({
                    id: typeof q.id === "number" ? q.id : null,
                    question: q.question ?? "",
                    choices:
                        q.choices?.map((c) => ({
                            id: typeof c.id === "number" ? c.id : null,
                            choice: c.choice ?? "",
                            point: c.point ?? 1,
                        })) ?? [],
                })) ?? [],
            new_questions: [],
            deleted_questions: [],
        });

    const allQuestions: Question[] = [
        ...(data.saved_questions ?? []),
        ...(data.new_questions ?? []),
    ];

    const addNewQuestion = () => {
        setData("new_questions", [
            ...data.new_questions,
            {
                question: "",
                choices: choiceLetters.map(() => ({
                    choice: "",
                    point: 1,
                })),
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        const savedCount = data.saved_questions.length;
        if (index < savedCount) {
            const removed = data.saved_questions[index];
            if (removed.id) {
                setData("deleted_questions", [
                    ...data.deleted_questions,
                    removed.id,
                ]);
            }
            setData(
                "saved_questions",
                data.saved_questions.filter((_, i) => i !== index)
            );
        } else {
            const newIdx = index - savedCount;
            setData(
                "new_questions",
                data.new_questions.filter((_, i) => i !== newIdx)
            );
        }
    };

    const handleChangeQuestion = (questionIdx: number, value: string) => {
        const savedCount = data.saved_questions.length;
        if (questionIdx < savedCount) {
            const newSaved = [...data.saved_questions];
            newSaved[questionIdx].question = value;
            setData("saved_questions", newSaved);
        } else {
            const newIdx = questionIdx - savedCount;
            const newNew = [...data.new_questions];
            newNew[newIdx].question = value;
            setData("new_questions", newNew);
        }
    };

    const handleChangeChoice = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const savedCount = data.saved_questions.length;
        if (questionIdx < savedCount) {
            const newSaved = [...data.saved_questions];
            newSaved[questionIdx].choices[choiceIdx][
                e.target.name as "choice"
            ] = e.target.value;
            setData("saved_questions", newSaved);
        } else {
            const newIdx = questionIdx - savedCount;
            const newNew = [...data.new_questions];
            newNew[newIdx].choices[choiceIdx][e.target.name as "choice"] =
                e.target.value;
            setData("new_questions", newNew);
        }
    };

    const handleChangeQuestionnaire = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setData(e.target.name as "title" | "description", e.target.value);
    };

    const handleChangeChoicePoint = (
        questionIdx: number,
        choiceIdx: number,
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const newQuestions = [...data.saved_questions];
        newQuestions[questionIdx].choices[choiceIdx][e.target.name as "point"] =
            Number(e.target.value);
        setData("saved_questions", newQuestions);
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

        allQuestions.forEach((q) => {
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="flex flex-col w-full gap-3">
                                <div className="flex flex-col">
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
                                <div className="flex flex-col">
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
                                            {data.access_token || "Token Belum Dibuat"}
                                        </h1>
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
                            onClick={addNewQuestion}
                            type="button"
                        >
                            <PlusCircle />
                            <span>Tambah Pertanyaan</span>
                        </Button>
                    </div>
                </div>
                {allQuestions.map((question, questionIdx) => (
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
                                {allQuestions.length > 1 && (
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
                                            onChange={(val) =>
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
                    disabled={processing}
                >
                    <Save />
                    <span>Simpan</span>
                </Button>
            </form>
        </AppLayout>
    );
};

export default QuestionnaireEdit;

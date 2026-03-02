import { Key, useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Toaster } from "react-hot-toast";
import BlastToaster from "@/components/custom/BlastToaster";
import { ListTodo, Timer, ClipboardList } from "lucide-react";
import { ChoiceItem } from "@/components/ui/choice-item";
import { NumberGrid } from "@/components/ui/number-grid";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import type { Questionnaire } from "@/types/questionnaire";

interface ChoiceAnswer {
    index: number;
    questionId: number;
    choices: number | null;
}

export default function AnswerIndex({
    app_name,
    questionnaire,
}: {
    app_name: string;
    questionnaire: Questionnaire;
}) {
    const { flash } = usePage().props as any;
    const [submitted, setSubmitted] = useState(false);
    const [choiceAnswers, setChoiceAnswers] = useState<ChoiceAnswer[]>(() => {
        const saved = localStorage.getItem("choiceAnswers");

        if (saved && saved !== "[]") {
            return JSON.parse(saved);
        }

        return questionnaire.questions.map((q, index) => ({
            index,
            questionId: q.id,
            choices: null,
        }));
    });

    const [currentQuestion, setCurrentQuestion] = useState(() => {
        const saved = localStorage.getItem("currentQuestion");
        return saved ? Number(saved) : 0;
    });

    useEffect(() => {
        if (submitted) return;
        localStorage.setItem("currentQuestion", String(currentQuestion));
        localStorage.setItem("choiceAnswers", JSON.stringify(choiceAnswers));
    }, [currentQuestion, choiceAnswers, submitted]);

    useEffect(() => {
        if (flash?.success) BlastToaster("success", flash.success);
        else if (flash?.error) BlastToaster("error", flash.error);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (typeof window !== "undefined")
            localStorage.removeItem("current_role");
    }, []);

    const activeQuestion = questionnaire.questions[currentQuestion];

    const toggleSelectChoice = (index: number, choiceId: number) => {
        setChoiceAnswers((prev) =>
            prev.map((ans) =>
                ans.index === index ? { ...ans, choices: choiceId } : ans,
            ),
        );
    };

    const answeredQuestions: number[] = questionnaire.questions
        .map((q, index) => {
            const choiceAns = choiceAnswers[index];

            if (choiceAns.choices != null) {
                return index + 1;
            } else {
                return null;
            }
        })
        .filter(Boolean) as number[];

    const goNext = () => {
        if (currentQuestion < questionnaire.questions.length - 1)
            setCurrentQuestion(currentQuestion + 1);
    };

    const goBack = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const validateAnswer = (payload: any): boolean => {
        const choices = JSON.parse(payload.choices);
        const incomplete = choices.some((c: any) => !c.choices);
        if (incomplete) {
            BlastToaster("error", "Lengkapi semua jawaban terlebih dahulu");
            return false;
        }
        return true;
    };

    const handleAnswer = () => {
        const payload = {
            questionnaire_id: questionnaire.id,
            choices: JSON.stringify(
                choiceAnswers.map(({ questionId, choices }) => ({
                    questionId,
                    choices,
                })),
            ),
        };

        if (!validateAnswer(payload)) return;

        router.post(`/questionnaire/in-progress`, payload, {
            preserveScroll: true,
            onError: (errors) => {
                return BlastToaster("error", errors.message);
            },
            onSuccess: () => {
                setSubmitted(true);
                localStorage.clear();
                setCurrentQuestion(0);

                setTimeout(() => {
                    router.post(
                        "/auth/questionnaire/unregister",
                        {},
                        {
                            preserveScroll: true,
                            onError: (errors) => {
                                BlastToaster("error", errors.message);
                            },
                            onSuccess: () => {
                                BlastToaster("success", "Berhasil keluar");
                            },
                        },
                    );
                }, 1000);
            },
        });
    };

    return (
        <div className="grid grid-cols-12 h-dvh bg-gray-50 dark:bg-background p-4 gap-4 overflow-hidden">
            <Toaster position={"bottom-right"} reverseOrder={false} />

            <Card className="col-span-12 md:col-span-2 shadow-md flex flex-col h-full min-h-0">
                <CardContent className="flex-1 min-h-0 overflow-y-auto">
                    <div className="flex flex-nowrap gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="w-4 h-4 rounded-md bg-emerald-400 border border-emerald-500"></span>
                            <span>Terjawab</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="w-4 h-4 rounded-md bg-blue-400 border border-blue-500"></span>
                            <span>Aktif</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="w-4 h-4 rounded-md bg-gray-200 border border-gray-300"></span>
                            <span>Belum</span>
                        </div>
                    </div>

                    <h2 className="text-sm font-semibold mb-2 shrink-0">
                        Nomor Soal
                    </h2>

                    <div className="overflow-x-auto">
                        <NumberGrid
                            total={questionnaire.questions.length}
                            selected={currentQuestion + 1}
                            onSelect={(num) => setCurrentQuestion(num - 1)}
                            answered={answeredQuestions}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-12 md:col-span-10 shadow-md flex flex-col overflow-y-auto h-full">
                <CardHeader>
                    <div className="bg-stone-200 border border-stone-300 rounded-md p-3 mb-3 flex items-start gap-3">
                        <ClipboardList className="text-stone-800 w-7 h-7 shrink-0" />
                        <div className="flex flex-col">
                            <h3 className="text-stone-800 font-semibold text-lg">
                                {questionnaire.title || "Judul Tes"}
                            </h3>
                            <p className="text-sm text-stone-800">
                                {questionnaire.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ListTodo className="text-stone-700 w-6 h-6 shrink-0" />
                        <div className="flex items-start gap-2 flex-1">
                            <span className="font-semibold text-lg">
                                {currentQuestion + 1}.
                            </span>
                            <div className="text-lg">
                                {activeQuestion.question}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-col w-full mb-5">
                        <label className="text-base mb-1">Jawaban</label>
                        <div className="flex flex-col gap-2">
                            {questionnaire.choices.map(
                                (choice: any, index: number) => {
                                    const selectedChoice = choiceAnswers.find(
                                        (a) =>
                                            a.questionId === activeQuestion.id,
                                    )?.choices;

                                    const selected =
                                        selectedChoice === choice.id;
                                    return (
                                        <ChoiceItem
                                            key={choice.id}
                                            index={index}
                                            text={choice.choice}
                                            selected={selected ?? false}
                                            onSelect={() =>
                                                toggleSelectChoice(
                                                    currentQuestion,
                                                    choice.id,
                                                )
                                            }
                                        />
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-5">
                        <Button
                            variant={"brown"}
                            className={`flex items-center gap-2 ${
                                currentQuestion == 0 ? "invisible" : ""
                            }`}
                            type="button"
                            onClick={goBack}
                        >
                            Back
                        </Button>

                        {currentQuestion ===
                        questionnaire.questions.length - 1 ? (
                            <ConfirmDialog
                                title="Submit Kuis"
                                description="Yakin akan melakukan submit ?"
                                triggerNode={
                                    <Button
                                        variant="green"
                                        className="flex items-center gap-2"
                                        type="button"
                                    >
                                        Submit
                                    </Button>
                                }
                                confirmAction={handleAnswer}
                                type="success"
                            />
                        ) : (
                            <Button
                                variant="blue"
                                className="flex items-center gap-2"
                                type="button"
                                onClick={goNext}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

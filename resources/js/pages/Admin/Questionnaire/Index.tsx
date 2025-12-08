import AppLayout from "@/partials/AppLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { QuestionnaireIndexProps } from "@/types/questionnaire";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { CircleCheck, CircleX, Pencil, Plus, Trash2 } from "lucide-react";
import EmptyTable from "@/components/custom/EmptyTable";

const QuestionnaireIndex = ({
    title,
    description,
    questionnaires,
}: QuestionnaireIndexProps) => {
    const handleDeleteQuestionnaire = (id: number) => {
        router.delete(`/admin/questionnaire/${id}`);
    };
    return (
        <AppLayout>
            <div className="flex justify-between items-center">
                <PageTitle title={title} description={description} />
                <Link href={"/admin/questionnaire/create"}>
                    <Button
                        variant={"yellow"}
                        className="flex items-center gap-2"
                    >
                        <Plus />
                        <span>Tambah Kuesioner</span>
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-stone-200 font-semibold">
                                #
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Nama Kuesioner
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Deskripsi Singkat
                            </TableHead>
                            <TableHead className="bg-stone-200 font-semibold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questionnaires.length ? (
                            questionnaires.map(
                                (questionnaire: any, idx: number) => (
                                    <TableRow key={questionnaire.id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {questionnaire.title}
                                        </TableCell>
                                        <TableCell>
                                            {questionnaire.description.length >
                                            50
                                                ? questionnaire.description.slice(
                                                      0,
                                                      50
                                                  ) + "..."
                                                : questionnaire.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/questionnaire/${questionnaire.id}/edit`}
                                                >
                                                    <Button
                                                        variant={"blue"}
                                                        size={"icon"}
                                                        type="button"
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                </Link>
                                                <ConfirmDialog
                                                    title="Hapus Kuesioner"
                                                    description={`Apakah Anda yakin ingin menghapus kuesioner ${questionnaire.name}?`}
                                                    triggerNode={
                                                        <span>
                                                            <Button
                                                                type="button"
                                                                variant={"red"}
                                                                size={"icon"}
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </span>
                                                    }
                                                    type="danger"
                                                    confirmAction={() =>
                                                        handleDeleteQuestionnaire(
                                                            questionnaire.id as number
                                                        )
                                                    }
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        ) : (
                            <EmptyTable
                                colSpan={5}
                                message="Asal partisipan tidak ada"
                            />
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default QuestionnaireIndex;

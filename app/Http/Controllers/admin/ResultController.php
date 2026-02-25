<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query("search"); // free search -> participant name, origin name, questionnaire name
        $origin = $request->query("origin"); // origin filter
        $questionnaire_id = $request->query("questionnaire_id"); // questionnaire filter
        $query = Answer::query()
            ->with(["participant", "questionnaire", "question", "choice"])
            ->select([
                "answers.participant_id",
                "answers.questionnaire_id",
                DB::raw("DATE(answers.created_at) as answer_date"),
                DB::raw("COUNT(answers.id) as answer_count"),
            ]);

        $query
            ->when($search || $origin, function ($q) {
                $q->join(
                    "participants",
                    "answers.participant_id",
                    "=",
                    "participants.id",
                );
            })
            ->when($search, function ($q) {
                $q->join(
                    "questionnaires",
                    "answers.questionnaire_id",
                    "=",
                    "questionnaires.id",
                );
            });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where("participants.name", "like", "%{$search}%")
                    ->orWhere("participants.origin", "like", "%{$search}%")
                    ->orWhere("questionnaires.name", "like", "%{$search}%");
            });
        }

        if ($origin) {
            $query->where("participants.origin", $origin);
        }

        if ($questionnaire_id) {
            $query->where("answers.questionnaire_id", $questionnaire_id);
        }

        $query->groupBy(
            "answers.participant_id",
            "answers.questionnaire_id",
            DB::raw("DATE(answers.created_at)"),
        );

        $answers = $query->paginate(config("custom.default.pagination"));
        return Inertia::render("Admin/Result/Index", [
            "title" => "Hasil Kuisioner",
            "description" =>
                "Daftar kuisioner yang telah dikerjakan oleh partisipan",
            "answers" => $answers,
            "filters" => [
                "search" => $search,
                "origin" => $origin,
                "questionnaire_id" => $questionnaire_id,
            ],
        ]);
    }
}

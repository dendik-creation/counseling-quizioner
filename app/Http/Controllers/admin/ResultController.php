<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Choice;
use App\Models\Question;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query("search");
        $origin = $request->query("origin");
        $questionnaire_id = $request->query("questionnaire_id");
        $available_origins = DB::table("origins")
            ->get()
            ->map(function ($origin) {
                return [
                    "value" => $origin->id,
                    "label" => $origin->name,
                ];
            });
        $available_questionnaires = DB::table("questionnaires")
            ->get()
            ->map(function ($questionnaire) {
                return [
                    "value" => $questionnaire->id,
                    "label" => $questionnaire->title,
                ];
            });
        // Ambil semua result sesuai filter, lalu group by participant_id dan questionnaire_id
        $resultsQuery = Result::with("participant", "origin", "questionnaire")
            ->when($search, function ($query, $search) {
                $query->whereHas("participant", function ($query) use (
                    $search,
                ) {
                    $query->where(function ($q) use ($search) {
                        $q->where("name", "like", "%{$search}%")
                            ->orWhere(
                                "participant_class",
                                "like",
                                "%{$search}%",
                            )
                            ->orWhere(
                                "participant_work",
                                "like",
                                "%{$search}%",
                            );
                    });
                });
            })
            ->when($origin, function ($query, $origin) {
                $query->where("origin_id", $origin);
            })
            ->when($questionnaire_id, function ($query, $questionnaire_id) {
                $query->where("questionnaire_id", $questionnaire_id);
            });

        // Ambil semua result, lalu group by participant_id dan questionnaire_id
        $resultsCollection = $resultsQuery->get();

        // Group by participant_id dan questionnaire_id
        $grouped = $resultsCollection->groupBy(function ($item) {
            return $item->participant_id . "-" . $item->questionnaire_id;
        });

        // Pagination manual berdasarkan group participant_id dan questionnaire_id
        $perPage = config("custom.default.pagination_less");
        $currentPage = request()->get("page", 1);
        $groupedItems = $grouped
            ->map(function ($results, $key) {
                // Ambil participant dan questionnaire dari result pertama
                $firstResult = $results->first();
                return [
                    "participant_id" => $firstResult->participant_id,
                    "questionnaire_id" => $firstResult->questionnaire_id,
                    "participant" => $firstResult->participant,
                    "questionnaire" => $firstResult->questionnaire,
                    "results" => $results->values(),
                ];
            })
            ->values();

        $total = $groupedItems->count();
        $pagedItems = $groupedItems
            ->slice(($currentPage - 1) * $perPage, $perPage)
            ->values();

        $results = new \Illuminate\Pagination\LengthAwarePaginator(
            $pagedItems,
            $total,
            $perPage,
            $currentPage,
            [
                "path" => request()->url(),
                "query" => request()->query(),
            ],
        );

        return Inertia::render("Admin/Result/Index", [
            "title" => "Hasil Kuisioner",
            "description" =>
                "Daftar kuisioner yang telah dikerjakan oleh partisipan",
            "results" => $results,
            "available_origins" => $available_origins,
            "available_questionnaires" => $available_questionnaires,
            "filters" => [
                "search" => $search,
                "origin" => $origin,
                "questionnaire_id" => $questionnaire_id,
            ],
        ]);
    }

    public function showParticipantResults($participant_id, $questionnaire_id)
    {
        $results = Result::with("participant", "origin", "questionnaire")
            ->where("participant_id", $participant_id)
            ->where("questionnaire_id", $questionnaire_id)
            ->latest()
            ->get();
        if ($results->count() == 0) {
            return redirect()
                ->route("admin.results.index")
                ->with("error", "Hasil kuisioner tidak ditemukan");
        }
        return Inertia::render("Admin/Result/Show", [
            "title" => "Hasil Kuisioner Partisipan",
            "description" =>
                "Histori kuisioner yang telah dikerjakan oleh partisipan",
            "results" => $results,
            "participant" => $results->first()->participant->load("origin"),
        ]);
    }

    public function showParticipantResultDetail($participant_id, $result_id)
    {
        $result = Result::where("id", $result_id)
            ->where("participant_id", $participant_id)
            ->with([
                "participant:id,name",
                "origin:id,name",
                "questionnaire:id,title",
                "answers",
            ])
            ->first();
        $available_questions = Question::where(
            "questionnaire_id",
            $result->questionnaire_id,
        )->get();
        $available_choices = Choice::where(
            "questionnaire_id",
            $result->questionnaire_id,
        )->get();
        if (!$result) {
            return redirect()
                ->route("admin.results.show.participant")
                ->with("error", "Jawaban kuisioner tidak ditemukan");
        }
        // try step result
        $result["try_step"] = Result::where("participant_id", $participant_id)
            ->where("questionnaire_id", $result->questionnaire_id)
            ->where("completed_at", "<=", $result->completed_at)
            ->count();
        return Inertia::render("Admin/Result/ShowAnswer", [
            "title" => "Hasil Jawaban Kuisioner",
            "description" =>
                "Detail jawaban kuisioner yang telah dikerjakan oleh partisipan",
            "result" => $result,
            "available_questions" => $available_questions,
            "available_choices" => $available_choices,
        ]);
    }
}

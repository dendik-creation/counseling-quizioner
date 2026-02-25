<?php

namespace App\Http\Controllers\admin;

use App\Models\Choice;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class QuestionnaireController extends Controller
{
    public function index()
    {
        $questionnaires = Questionnaire::paginate(
            config("custom.default.pagination"),
        );
        return Inertia::render("Admin/Questionnaire/Index", [
            "title" => "Daftar Kuisioner",
            "description" => "Halaman untuk melihat daftar kuisioner",
            "questionnaires" => $questionnaires,
        ]);
    }
    public function create()
    {
        return Inertia::render("Admin/Questionnaire/Create", [
            "title" => "Buat Kuesioner",
            "description" => "Halaman untuk membuat kuesioner baru",
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => ["required", "string", "max:255"],
            "description" => ["nullable", "string"],
            "access_token" => ["required", "string", "min:6", "max:6"],
            "expires_at" => [
                "required",
                "date",
                "after_or_equal:" . now()->format("Y-m-d"),
            ],
            "choices" => ["required", "array", "min:1"],
            "choices.*.choice" => ["required", "string"],
            "choices.*.point" => ["required", "integer"],
            "questions" => ["required", "array", "min:1"],
            "questions.*.question" => ["required", "string"],
        ]);

        $questionnaire = Questionnaire::create([
            "title" => $validated["title"],
            "description" => $validated["description"] ?? "",
            "access_token" => $validated["access_token"] ?? "",
            "expires_at" => $validated["expires_at"] ?? "",
        ]);

        if (
            $validated["questions"] === null ||
            count($validated["questions"]) === 0
        ) {
            Session::flash(
                "error",
                "Kuesioner harus memiliki setidaknya satu pertanyaan",
            );
            return back();
        }

        foreach ($validated["choices"] as $choice) {
            Choice::create([
                "choice" => $choice["choice"],
                "point" => $choice["point"],
                "questionnaire_id" => $questionnaire->id,
            ]);
        }

        foreach ($validated["questions"] as $questionData) {
            $questionnaire->questions()->create([
                "question" => $questionData["question"],
                "questionnaire_id" => $questionnaire->id,
            ]);
        }
        Session::flash("success", "Kuesioner berhasil dibuat");
        return Inertia::location("/admin/questionnaire");
    }

    public function edit($id)
    {
        $questionnaire = Questionnaire::with(
            "questions",
            "choices",
        )->findOrFail($id);
        return Inertia::render("Admin/Questionnaire/Edit", [
            "title" => "Edit Kuesioner",
            "description" => "Halaman untuk mengedit kuesioner",
            "questionnaire" => $questionnaire,
        ]);
    }

    public function update($id, Request $request)
    {
        $validated = $request->validate([
            "title" => ["required", "string", "max:255"],
            "description" => ["nullable", "string"],
            "access_token" => ["required", "string", "min:6", "max:6"],
            "expires_at" => [
                "required",
                "date",
                "after_or_equal:" . now()->format("Y-m-d"),
            ],
            "choices" => ["required", "array", "min:1"],
            "choices.*.choice" => ["required", "string"],
            "choices.*.point" => ["required", "integer"],
            "questions" => ["required", "array", "min:1"],
            "questions.*.id" => ["sometimes", "integer", "exists:questions,id"],
            "questions.*.question" => ["required", "string"],
        ]);

        $questionnaire = Questionnaire::findOrFail($id);
        $questionnaire->update([
            "title" => $validated["title"],
            "description" => $validated["description"] ?? "",
            "access_token" => $validated["access_token"] ?? "",
            "expires_at" => $validated["expires_at"] ?? "",
        ]);

        // Update choices: delete old, insert new
        $questionnaire->choices()->delete();
        foreach ($validated["choices"] as $choice) {
            Choice::create([
                "choice" => $choice["choice"],
                "point" => $choice["point"],
                "questionnaire_id" => $questionnaire->id,
            ]);
        }

        // Update questions: delete old, insert new
        $questionnaire->questions()->delete();
        foreach ($validated["questions"] as $questionData) {
            $questionnaire->questions()->create([
                "question" => $questionData["question"],
                "questionnaire_id" => $questionnaire->id,
            ]);
        }

        Session::flash("success", "Kuesioner berhasil diperbarui");
        return Inertia::location("/admin/questionnaire");
    }

    public function destroy($id)
    {
        $questionnaire = Questionnaire::findOrFail($id);
        $questionnaire->choices()->each(function ($choice) {
            $choice->delete();
        });
        $questionnaire->questions()->each(function ($question) {
            $question->delete();
        });
        $questionnaire->delete();

        Session::flash("success", "Kuesioner berhasil dihapus");
        return Inertia::location("/admin/questionnaire");
    }
}

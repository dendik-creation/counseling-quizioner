<?php

namespace App\Http\Controllers\Answer;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Questionnaire;
use App\Models\Answer;
use App\Models\Choice;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class QuestionnairesController extends Controller
{
    public function guide()
    {
        return Inertia::render('Questionnaires/Guide', [
            'app_name' => 'Guide',
        ]);
    }

    public function answerIndex()
    {
        if (!session('answers')) {
            session(['answers' => true]);
        }

        $questionnaire = Questionnaire::with('questions.choices')->where('access_token', session('token'))->orWhere('id', session('questionnaires_id'))->first();

        if (!session()->has("question_order_{$questionnaire->id}")) {
            $order = $questionnaire->questions->pluck('id')->toArray();
            shuffle($order);
            session(["question_order_{$questionnaire->id}" => $order]);
        }

        $order = session("question_order_{$questionnaire->id}");
        $questions = $questionnaire->questions
            ->sortBy(function ($q) use ($order) {
                return array_search($q->id, $order);
            })
            ->values();
        $questionnaire->setRelation('questions', $questions);

        return Inertia::render('Questionnaires/AnswerIndex', [
            'app_name' => 'Questionnaire',
            'questionnaire' => $questionnaire,
        ]);
    }

    public function answerStore(Request $request)
    {
        $request->validate([
            'questionnaire_id' => 'required|integer',
            'choices' => 'required|string',
        ]);

        $choices = json_decode($request->choices, true);

        try {
            foreach ($choices as $choice) {
                $questionId = $choice['questionId'];
                foreach ($choice['choices'] as $choiceId) {
                    $point = Choice::where('id', $choiceId)->value('point');

                    Answer::create([
                        'questionnaire_id' => $request->questionnaire_id,
                        'participant_id' => session('participant_id'),
                        'question_id' => $questionId,
                        'choice_id' => $choiceId,
                        'point' => $point,
                    ]);
                }
            }

            return Session::flash('success', 'Kuesioner berhasil disimpan');
        } catch (\Exception $e) {
            return Session::flash('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}

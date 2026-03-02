<?php

namespace App\Http\Controllers\Answer;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Questionnaire;
use App\Models\Answer;
use App\Models\Choice;
use App\Models\Participant;
use App\Models\Result;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

class AnswerController extends Controller
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

        $questionnaire = Questionnaire::with('choices:id,questionnaire_id,choice,point')->where('access_token', session('token'))->orWhere('id', session('questionnaires_id'))->first();

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
            'questionnaire' => $questionnaire
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

            $participantId = session('participant_id');

            if (!$participantId) {
                return Session::flash('error', 'Session peserta tidak ditemukan');
            }

            $participant = Participant::findOrFail($participantId);

            $gusPoint = 0;
            $jiPoint = 0;
            $gangPoint = 0;

            $result = Result::create([
                'participant_id' => $participant->id,
                'questionnaire_id' => $request->questionnaire_id,
                'origin_id' => $participant->origin_id,
                'participant_unique_code' => $participant->unique_code,
                'participant_work' => $participant->work,
                'participant_class' => $participant->class,
            ]);

            foreach ($choices as $index => $choice) {

                $questionId = $choice['questionId'];
                $choiceId   = $choice['choices'];

                Answer::create([
                    'result_id' => $result->id,
                    'question_id' => $questionId,
                    'choice_id' => $choiceId,
                ]);

                $point = Choice::where('id', $choiceId)
                    ->value('point') ?? 0;

                $number = $index + 1;

                if ($number <= 33) {
                    $gusPoint += $point;
                } elseif ($number <= 66) {
                    $jiPoint += $point;
                } else {
                    $gangPoint += $point;
                }
            }

            $result->update([
                'gus_point' => $gusPoint,
                'ji_point' => $jiPoint,
                'gang_point' => $gangPoint,
            ]);

            return Session::flash('success', 'Kuesioner berhasil disimpan');
        } catch (\Exception $e) {

            return Session::flash(
                'error',
                'Terjadi kesalahan: ' . $e->getMessage()
            );
        }
    }
}

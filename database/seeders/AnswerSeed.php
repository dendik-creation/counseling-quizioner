<?php

namespace Database\Seeders;

use App\Models\Choice;
use App\Models\Participant;
use App\Models\Question;
use App\Models\Result;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnswerSeed extends Seeder
{
    /**
     * Run the database seeds.
     */

    private function calculatePoint($target, $choices, $answers)
    {
        switch ($target) {
            case "gus":
                return collect($answers)
                    ->slice(0, 32)
                    ->sum(function ($answer) use ($choices) {
                        $choice = $choices
                            ->where("id", $answer["choice_id"])
                            ->first();
                        return $choice ? $choice->point : 0;
                    });
            case "ji":
                return collect($answers)
                    ->slice(33, 65)
                    ->sum(function ($answer) use ($choices) {
                        $choice = $choices
                            ->where("id", $answer["choice_id"])
                            ->first();
                        return $choice ? $choice->point : 0;
                    });
            case "gang":
                return collect($answers)
                    ->slice(66, 98)
                    ->sum(function ($answer) use ($choices) {
                        $choice = $choices
                            ->where("id", $answer["choice_id"])
                            ->first();
                        return $choice ? $choice->point : 0;
                    });
        }
    }
    public function run(): void
    {
        $questionnaire_id = 1;
        $questions = Question::where(
            "questionnaire_id",
            $questionnaire_id,
        )->get();
        $choices = Choice::where("questionnaire_id", $questionnaire_id)->get();
        $answers = [];

        foreach ($questions as $question) {
            $answers[] = [
                "question_id" => $question->id,
                "choice_id" => $choices->random()->id,
                "created_at" => now()->subYears(2),
                "updated_at" => now()->subYears(2),
            ];
        }

        // Participant
        $participant = Participant::where("unique_code", "0001")->first();
        // inserts result
        $result = Result::create([
            "participant_id" => $participant->id,
            "questionnaire_id" => $questionnaire_id,
            "origin_id" => $participant->origin_id,
            "participant_unique_code" => $participant->unique_code,
            "participant_work" => $participant->work,
            "participant_class" => $participant->class,
            "gus_point" => $this->calculatePoint("gus", $choices, $answers),
            "ji_point" => $this->calculatePoint("ji", $choices, $answers),
            "gang_point" => $this->calculatePoint("gang", $choices, $answers),
            "completed_at" => now()->subYears(2),
        ]);

        // insert answers with result_id
        foreach ($answers as &$answer) {
            $answer["result_id"] = $result->id;
        }
        DB::table("answers")->insert($answers);

        // shuffle answers
        foreach ($answers as &$answer) {
            $answer["choice_id"] = $choices->random()->id;
        }

        // New record for result
        $new_result = Result::create([
            "participant_id" => $participant->id,
            "questionnaire_id" => $questionnaire_id,
            "origin_id" => $participant->origin_id,
            "participant_unique_code" => $participant->unique_code,
            "participant_work" => $participant->work,
            "participant_class" => "8",
            "gus_point" => $this->calculatePoint("gus", $choices, $answers),
            "ji_point" => $this->calculatePoint("ji", $choices, $answers),
            "gang_point" => $this->calculatePoint("gang", $choices, $answers),
            "completed_at" => now()->subYears(1),
        ]);

        // insert answers with result_id
        foreach ($answers as &$answer) {
            $answer["result_id"] = $new_result->id;
            $answer["created_at"] = now()->subYears(1);
            $answer["updated_at"] = now()->subYears(1);
        }
        DB::table("answers")->insert($answers);

        // shuffle answers
        foreach ($answers as &$answer) {
            $answer["choice_id"] = $choices->random()->id;
        }

        // New record for result
        $new_result = Result::create([
            "participant_id" => $participant->id,
            "questionnaire_id" => $questionnaire_id,
            "origin_id" => $participant->origin_id,
            "participant_unique_code" => $participant->unique_code,
            "participant_work" => $participant->work,
            "participant_class" => "8",
            "gus_point" => $this->calculatePoint("gus", $choices, $answers),
            "ji_point" => $this->calculatePoint("ji", $choices, $answers),
            "gang_point" => $this->calculatePoint("gang", $choices, $answers),
            "completed_at" => now(),
        ]);

        // insert answers with result_id
        foreach ($answers as &$answer) {
            $answer["result_id"] = $new_result->id;
            $answer["created_at"] = now();
            $answer["updated_at"] = now();
        }
        DB::table("answers")->insert($answers);
    }
}

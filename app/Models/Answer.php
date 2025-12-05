<?php

namespace App\Models;

use App\Models\Choice;
use App\Models\Question;
use App\Models\Participant;
use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function participant()
    {
        return $this->belongsTo(Participant::class, 'participant_id');
    }

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, 'questionnaire_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'questions_id');
    }

    public function choice()
    {
        return $this->belongsTo(Choice::class, 'choice_id');
    }

}

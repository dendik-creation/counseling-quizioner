<?php

namespace App\Models;
use App\Models\Questionnaire;
use App\Models\Choice;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $guarded = ['id'];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, "questionnaire_id");
    }

    public function choices()
    {
        return $this->hasMany(Choice::class, "question_id");
    }
}

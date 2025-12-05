<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Answer;

class Questionnaire extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function questions()
    {
        return $this->hasMany(Question::class, 'questionnaire_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'questionnaire_id');
    }
}

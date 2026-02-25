<?php

namespace App\Models;
use App\Models\Questionnaire;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $guarded = ["id"];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, "questionnaire_id");
    }
}

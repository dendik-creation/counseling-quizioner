<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $guarded = ["id"];
    protected $casts = [
        "completed_at" => "datetime",
        "participant_id" => "integer",
        "origin_id" => "integer",
        "questionnaire_id" => "integer",
        "gus_point" => "integer",
        "ji_point" => "integer",
        "gang_point" => "integer",
    ];

    public function origin()
    {
        return $this->belongsTo(Origin::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class);
    }
}

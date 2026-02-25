<?php

namespace App\Models;

use App\Models\Questionnaire;
use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    protected $guarded = ["id"];
    protected $hidden = ["created_at", "updated_at"];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class, "questionnaire_id");
    }
}

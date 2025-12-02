<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $guarded = ["id"];

    public function origin()
    {
        return $this->belongsTo(ParticipantOrigin::class, "origin_id");
    }
}

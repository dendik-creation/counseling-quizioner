<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantOrigin extends Model
{
    protected $guarded = ["id"];

    public function participants()
    {
        return $this->hasMany(Participant::class, "origin_id");
    }
}

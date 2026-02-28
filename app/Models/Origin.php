<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Origin extends Model
{
    protected $guarded = ["id"];
    protected $casts = [
        "mgbk_id" => "integer",
    ];

    public function mgbk()
    {
        return $this->belongsTo(User::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class, "origin_id");
    }
}

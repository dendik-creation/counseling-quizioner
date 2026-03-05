<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Origin extends Model
{
    protected $guarded = ["id"];
    protected $casts = [
        "mgbk_id" => "integer",
        "city" => "string",
    ];

    public function mgbk()
    {
        return $this->belongsTo(User::class);
    }

    public function counseling_teacher()
    {
        return $this->hasOne(User::class, 'origin_id');
    }

    public function participants()
    {
        return $this->hasMany(Participant::class, "origin_id");
    }
}

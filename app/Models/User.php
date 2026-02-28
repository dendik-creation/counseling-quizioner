<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $guarded = ["id"];
    protected $hidden = ["password"];
    protected $casts = [
        "origin_id" => "integer",
        "mgbk_id" => "integer",
    ];
    protected function casts(): array
    {
        return [
            "password" => "hashed",
        ];
    }
    // Role Levels
    const ROLE_ADMIN = 1;
    const ROLE_MGBK = 2;
    const ROLE_COUNSELING_TEACHER = 3;
}

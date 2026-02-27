<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "username" => "admin",
            "name" => "Abulabu",
            "level" => 1,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);

        User::create([
            "username" => "akmal",
            "name" => "Akmal Kudus",
            "level" => 2,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);

        User::create([
            "username" => "guruku",
            "name" => "Guruku",
            "level" => 3,
            "origin_id" => 1,
            "mgbk_id" => 2,
            "is_active" => null,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);
    }
}

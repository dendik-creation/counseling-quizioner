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
            "username" => "mgbk_kudus",
            "name" => "MGBK Kudus",
            "level" => 2,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);

        User::create([
            "username" => "mgbk_pati",
            "name" => "MGBK Pati",
            "level" => 2,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Participant;
use App\Models\Origin;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ParticipantSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Origin
        Origin::create([
            "name" => "SMK 1 Kudus",
            "city" => "KUDUS",
            "type" => "SCHOOL",
            "mgbk_id" => 2
        ]);
        Origin::create([
            "name" => "SMK 2 Pati",
            "city" => "PATI",
            "type" => "SCHOOL",
            "mgbk_id" => 3
        ]);
        Origin::create([
            "name" => "Masyarakat Umum",
            "type" => "COMMON",
        ]);

        // Teacher
        User::create([
            "username" => "iqbal",
            "name" => "Iqbal Samsul",
            "level" => 3,
            "origin_id" => 1,
            "mgbk_id" => 2,
            "is_active" => null,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);
        User::create([
            "username" => "akbar",
            "name" => "Akbar Simatupang",
            "level" => 3,
            "origin_id" => 2,
            "mgbk_id" => 3,
            "is_active" => null,
            "password" => Hash::make(config("custom.default.user_password")),
        ]);

        // Participant
        Participant::create([
            "unique_code" => "0001",
            "name" => "Akbar",
            "origin_id" => 1,
            "class" => "10",
        ]);
        Participant::create([
            "unique_code" => "0002",
            "name" => "Bima",
            "origin_id" => 2,
            "class" => "10",
        ]);
        Participant::create([
            "unique_code" => "3319223489234",
            "name" => "Agung",
            "origin_id" => 3,
            "work" => "Mekanik",
        ]);
    }
}

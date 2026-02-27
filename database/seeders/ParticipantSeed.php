<?php

namespace Database\Seeders;

use App\Models\Participant;
use App\Models\Origin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParticipantSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Origin
        Origin::create([
            "name" => "SMP 1 Kudus",
            "type" => "SCHOOL",
        ]);
        Origin::create([
            "name" => "SMK 2 Kudus",
            "type" => "SCHOOL",
        ]);
        Origin::create([
            "name" => "Masyarakat Umum",
            "type" => "COMMON",
        ]);

        // Participant
        Participant::create([
            "unique_code" => "0001",
            "name" => "Akbar",
            "origin_id" => 1,
            "class" => "7",
        ]);
        Participant::create([
            "unique_code" => "0002",
            "name" => "Bima",
            "origin_id" => 2,
            "class" => "12",
        ]);
        Participant::create([
            "unique_code" => "0003",
            "name" => "Agung",
            "origin_id" => 3,
            "work" => "Mekanik",
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Participant;
use App\Models\ParticipantOrigin;
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
        ParticipantOrigin::create([
            "name" => "Sekolah 1",
            "type" => "SCHOOL",
        ]);
        ParticipantOrigin::create([
            "name" => "Sekolah 2",
            "type" => "SCHOOL",
        ]);
        ParticipantOrigin::create([
            "name" => "Masyarakat Umum",
            "type" => "COMMON",
        ]);

        // Participant
        Participant::create([
            "unique_code" => "0001",
            "name" => "Partisipan Satu",
            "origin_id" => 1,
            "class" => "12",
        ]);
        Participant::create([
            "unique_code" => "0002",
            "name" => "Partisipan Dua",
            "origin_id" => 2,
            "class" => "10",
        ]);
        Participant::create([
            "unique_code" => "0003",
            "name" => "Partisipan Tiga",
            "origin_id" => 3,
            "work" => "Pedagang",
        ]);
    }
}

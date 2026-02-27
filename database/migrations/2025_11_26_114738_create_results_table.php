<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("results", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("participant_id");
            $table->unsignedBigInteger("questionnaire_id");
            // snapshot from participant
            $table->unsignedBigInteger("origin_id");
            $table->string("participant_unique_code");
            $table->string("participant_work")->nullable();
            $table->string("participant_class")->nullable();
            $table->integer("gus_point")->default(0);
            $table->integer("ji_point")->default(0);
            $table->integer("gang_point")->default(0);
            $table->dateTime("completed_at")->default(now());

            // Relations
            $table
                ->foreign("origin_id")
                ->references("id")
                ->on("origins")
                ->cascadeOnDelete();
            $table
                ->foreign("participant_id")
                ->references("id")
                ->on("participants")
                ->onDelete("cascade");
            $table
                ->foreign("questionnaire_id")
                ->references("id")
                ->on("questionnaires")
                ->onDelete("cascade");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("results");
    }
};

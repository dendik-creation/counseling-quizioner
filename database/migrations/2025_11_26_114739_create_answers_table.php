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
        Schema::create("answers", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("participant_id");
            $table->unsignedBigInteger("questionnaire_id");
            $table->unsignedBigInteger("question_id");
            $table->unsignedBigInteger("choice_id");
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
            $table
                ->foreign("question_id")
                ->references("id")
                ->on("questions")
                ->onDelete("cascade");
            $table
                ->foreign("choice_id")
                ->references("id")
                ->on("choices")
                ->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("answers");
    }
};

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
        Schema::create("participants", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("origin_id");
            $table->string("unique_value");
            $table->string("name");
            $table->string("class")->nullable(); // For students
            $table->string("position")->nullable(); // For Common
            $table->timestamps();
            $table
                ->foreign("origin_id")
                ->references("id")
                ->on("participant_origins")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("participants");
    }
};

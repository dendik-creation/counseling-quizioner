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
        // Currently active data (not snapshot)
        Schema::create("participants", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("origin_id")->nullable();
            $table->string("unique_code"); // nis/nisn for students, id number for common
            $table->string("name");
            $table->string("work")->nullable();
            $table->string("class")->nullable();
            $table->timestamps();
            $table
                ->foreign("origin_id")
                ->references("id")
                ->on("origins")
                ->nullOnDelete();
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

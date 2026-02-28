<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger("origin_id")->nullable();
            $table->unsignedBigInteger("mgbk_id")->nullable();
            $table
                ->foreign("origin_id")
                ->references("id")
                ->on("origins")
                ->nullOnDelete();
            $table
                ->foreign("mgbk_id")
                ->references("id")
                ->on("users")
                ->nullOnDelete();
        });

        Schema::table('origins', function (Blueprint $table) {
            $table->unsignedBigInteger("mgbk_id")->nullable();
            $table->foreign("mgbk_id")
                ->references("id")
                ->on("users")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['origin_id']);
            $table->dropForeign(['mgbk_id']);
            $table->dropColumn(['origin_id', 'mgbk_id']);
        });

        Schema::table('origins', function (Blueprint $table) {
            $table->dropForeign(['mgbk_id']);
            $table->dropColumn(['mgbk_id']);
        });
    }
};

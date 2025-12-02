<?php

use Illuminate\Support\Facades\Route;
// Global Controllers
use App\Http\Controllers\global\DashboardController;
use App\Http\Controllers\global\AuthController;
// Admin Controllers
use App\Http\Controllers\admin\UserController as AdminUserController;
use App\Http\Controllers\admin\OriginController as AdminOriginController;
use App\Http\Controllers\admin\ParticipantController as AdminParticipantController;

Route::get("/", [AuthController::class, "signedInStatus"])->name("login");
Route::prefix("auth")->group(function () {
    Route::get("/signin", [AuthController::class, "signInView"])
        ->name("auth.signin.index")
        ->middleware("guest");

    Route::post("/signin", [AuthController::class, "signIn"])
        ->middleware("guest")
        ->name("auth.signin.store");
});
Route::post("/auth/signout", [AuthController::class, "signOut"])
    ->middleware("auth")
    ->name("auth.signout.store");

// Admin Routes
Route::prefix("admin")
    ->middleware("auth")
    ->group(function () {
        Route::get("/dashboard", [
            DashboardController::class,
            "adminIndex",
        ])->name("admin.dashboard.index");

        // Master users
        Route::resource("users", AdminUserController::class);
        // Master participant origin
        Route::resource("origins", AdminOriginController::class);
        // Master participant
        Route::resource("participants", AdminParticipantController::class);
    });

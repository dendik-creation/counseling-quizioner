<?php

use Illuminate\Support\Facades\Route;
// Global Controllers
use App\Http\Controllers\global\AuthController;
use App\Http\Controllers\Answer\QuestionnairesController;
// Admin Controllers
use App\Http\Controllers\global\DashboardController;
use App\Http\Controllers\admin\ParticipantController;
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

    //Register
    Route::get("/register", [AuthController::class, "registerView"])
        ->name("auth.register.index")
        ->middleware("guest");
    Route::post("/register", [AuthController::class, "registerStore"])
        ->name("auth.register.store")
        ->middleware("guest");
    Route::post("/unregister", [AuthController::class, "unregisterStore"])
        ->name("auth.unregister.store")
        ->middleware("guest");
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
        Route::prefix("users")
            ->name("admin.users.")
            ->group(function () {
                Route::get("/", [AdminUserController::class, "index"])->name(
                    "index",
                );
                Route::post("/", [AdminUserController::class, "store"])->name(
                    "store",
                );
                Route::put("/{id}", [
                    AdminUserController::class,
                    "update",
                ])->name("update");
                Route::put("/{id}/reset-password", [
                    AdminUserController::class,
                    "resetPassword",
                ])->name("admin.users.reset-password");
                Route::delete("/{id}", [
                    AdminUserController::class,
                    "destroy",
                ])->name("destroy");
            });
        // Master participant origin
        Route::prefix("origins")
            ->name("admin.origins.")
            ->group(function () {
                Route::get("/", [AdminOriginController::class, "index"])->name(
                    "index",
                );
                Route::post("/", [AdminOriginController::class, "store"])->name(
                    "store",
                );
                Route::put("/{id}", [
                    AdminOriginController::class,
                    "update",
                ])->name("update");
                Route::delete("/{id}", [
                    AdminOriginController::class,
                    "destroy",
                ])->name("destroy");
            });
        // Master participant
        Route::prefix("participants")
            ->name("admin.participants.")
            ->group(function () {
                Route::get("/", [
                    AdminParticipantController::class,
                    "index",
                ])->name("index");
                Route::post("/", [
                    AdminParticipantController::class,
                    "store",
                ])->name("store");
                Route::put("/{id}", [
                    AdminParticipantController::class,
                    "update",
                ])->name("update");
                Route::delete("/{id}", [
                    AdminParticipantController::class,
                    "destroy",
                ])->name("destroy");
            });
    });

// Kuisonair Routes
Route::middleware(['participant', 'answering'])->group(function () {
    Route::get('/guide', [QuestionnairesController::class, 'guide'])->name('guide');

    Route::middleware(['answering'])->group(function () {
        Route::get('/questionnaire/in-progress', [QuestionnairesController::class, 'answerIndex']);
        Route::post('/questionnaire/in-progress', [QuestionnairesController::class, 'answerStore']);
    });
});

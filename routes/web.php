<?php

use Illuminate\Support\Facades\Route;
// Global Controllers
use App\Http\Controllers\Global\AuthController;
use App\Http\Controllers\Global\ProfileController;
//Anwers Controllers
use App\Http\Controllers\Answer\AnswerController as AnswerController;
// Admin Controllers
use App\Http\Controllers\Global\DashboardController;
use App\Http\Controllers\admin\QuestionnaireController as AdminQuestionnaireController;
use App\Http\Controllers\admin\UserController as AdminUserController;
use App\Http\Controllers\admin\OriginController as AdminOriginController;
use App\Http\Controllers\admin\ParticipantController as AdminParticipantController;
use App\Http\Controllers\admin\ResultController as AdminResultController;
use App\Http\Controllers\admin\ReportController as AdminReportController;
// MGBK Controllers
use App\Http\Controllers\mgbk\UserController as MgbkUserController;
use App\Http\Controllers\mgbk\OriginController as MgbkOriginController;
use App\Http\Controllers\mgbk\ParticipantController as MgbkParticipantController;
use App\Http\Controllers\mgbk\ResultController as MgbkResultController;
use App\Http\Controllers\mgbk\ReportController as MgbkReportController;
// Teacher Controllers
use App\Http\Controllers\teacher\ParticipantController as TeacherParticipantController;
use App\Http\Controllers\teacher\ResultController as TeacherResultController;
use App\Http\Controllers\teacher\ReportController as TeacherReportController;

Route::get('/', [AuthController::class, 'signedInStatus'])->name('login');
Route::prefix('auth')->group(function () {
    Route::get('/signin', [AuthController::class, 'signInView'])
        ->name('auth.signin.index')
        ->middleware('guest');

    Route::post('/signin', [AuthController::class, 'signIn'])
        ->middleware('guest')
        ->name('auth.signin.store');

    //Register
    Route::get('/register', [AuthController::class, 'registerView'])
        ->name('auth.register.index')
        ->middleware('guest');
    Route::post('/register', [AuthController::class, 'registerStore'])
        ->name('auth.register.store')
        ->middleware('guest');
    Route::post('/unregister', [AuthController::class, 'unregisterStore'])
        ->name('auth.unregister.store')
        ->middleware('guest');
});

Route::post('/auth/signout', [AuthController::class, 'signOut'])
    ->middleware('auth')
    ->name('auth.signout.store');

// Admin Routes
Route::prefix('admin')
    ->middleware('auth')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'adminIndex'])->name('admin.dashboard.index');

        // Master users
        Route::prefix('users')
            ->name('admin.users.')
            ->group(function () {
                Route::get('/', [AdminUserController::class, 'index'])->name('index');
                Route::post('/', [AdminUserController::class, 'store'])->name('store');
                Route::put('/{id}', [AdminUserController::class, 'update'])->name('update');
                Route::put('/{id}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.users.reset-password');
                Route::delete('/{id}', [AdminUserController::class, 'destroy'])->name('destroy');
            });
        // Master participant origin
        Route::prefix('origins')
            ->name('admin.origins.')
            ->group(function () {
                Route::get('/', [AdminOriginController::class, 'index'])->name('index');
                Route::post('/', [AdminOriginController::class, 'store'])->name('store');
                Route::put('/{id}', [AdminOriginController::class, 'update'])->name('update');
                Route::delete('/{id}', [AdminOriginController::class, 'destroy'])->name('destroy');
            });
        // Master participant
        Route::prefix('participants')
            ->name('admin.participants.')
            ->group(function () {
                Route::get('/', [AdminParticipantController::class, 'index'])->name('index');
                Route::put('/{id}', [AdminParticipantController::class, 'update'])->name('update');
                Route::delete('/{id}', [AdminParticipantController::class, 'destroy'])->name('destroy');
            });
        // Master questionnaires
        Route::prefix('questionnaire')
            ->name('admin.questionnaire.')
            ->group(function () {
                Route::get('/', [AdminQuestionnaireController::class, 'index'])->name('index');
                Route::get('/create', [AdminQuestionnaireController::class, 'create'])->name('create');
                Route::post('/', [AdminQuestionnaireController::class, 'store'])->name('store');
                Route::get('/{id}/edit', [AdminQuestionnaireController::class, 'edit'])->name('edit');
                Route::put('/{id}', [AdminQuestionnaireController::class, 'update'])->name('update');
                Route::delete('/{id}', [AdminQuestionnaireController::class, 'destroy'])->name('destroy');
            });

        // Results Routes
        Route::prefix('results')
            ->name('admin.results.')
            ->group(function () {
                Route::get('/', [AdminResultController::class, 'index'])->name('index');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}', [AdminResultController::class, 'showParticipantResults'])->name('show.participant');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}/print', [AdminResultController::class, 'printParticipantResults'])->name('print.participant');
                Route::get('/part-{participant_id}/res-{result_id}', [AdminResultController::class, 'showParticipantResultDetail'])->name('show.participant');
                Route::get('/part-{participant_id}/res-{result_id}/print', [AdminResultController::class, 'printParticipantResultDetail'])->name('print.participant');
            });

        // Report Routes
        Route::prefix('reports')
            ->name('admin.reports.')
            ->group(function () {
                Route::get('/', [AdminReportController::class, 'index'])->name('index');
                Route::get('/print', [AdminReportController::class, 'printPDF'])->name('print');
            });
    });

// MGBK Routes
Route::prefix('mgbk')
    ->middleware('auth')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'mgbkIndex'])->name('mgbk.dashboard.index');

        // User Routes
        Route::prefix('users')
            ->name('mgbk.users.')
            ->group(function () {
                Route::get('/', [MgbkUserController::class, 'index'])->name('index');
                Route::put('/{id}/active-status', [MgbkUserController::class, 'activeStatusTeacher'])->name('active-status');
            });

        // Origin Routes
        Route::prefix('origins')
            ->name('mgbk.origins.')
            ->group(function () {
                Route::get('/', [MgbkOriginController::class, 'index'])->name('index');
            });

        // Participant Routes
        Route::prefix('participants')
            ->name('mgbk.participants.')
            ->group(function () {
                Route::get('/', [MgbkParticipantController::class, 'index'])->name('index');
                Route::put('/{id}', [MgbkParticipantController::class, 'update'])->name('update');
                Route::delete('/{id}', [MgbkParticipantController::class, 'destroy'])->name('destroy');
            });

        // Results Routes
        Route::prefix('results')
            ->name('mgbk.results.')
            ->group(function () {
                Route::get('/', [MgbkResultController::class, 'index'])->name('index');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}', [MgbkResultController::class, 'showParticipantResults'])->name('show.participant');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}/print', [MgbkResultController::class, 'printParticipantResults'])->name('print.participant');
                Route::get('/part-{participant_id}/res-{result_id}', [MgbkResultController::class, 'showParticipantResultDetail'])->name('show.result');
                Route::get('/part-{participant_id}/res-{result_id}/print', [MgbkResultController::class, 'printParticipantResultDetail'])->name('print.result');
            });

        // Report Routes
        Route::prefix('reports')
            ->name('mgbk.reports.')
            ->group(function () {
                Route::get('/', [MgbkReportController::class, 'index'])->name('index');
                Route::get('/print', [MgbkReportController::class, 'printPDF'])->name('print');
            });
    });

// Teacher Routes
Route::prefix('teacher')
    ->middleware('auth')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'teacherIndex'])->name('teacher.dashboard.index');
        // Participant Routes
        Route::prefix('participants')
            ->name('teacher.participants.')
            ->group(function () {
                Route::get('/', [TeacherParticipantController::class, 'index'])->name('index');
                Route::put('/{id}', [TeacherParticipantController::class, 'update'])->name('update');
                Route::delete('/{id}', [TeacherParticipantController::class, 'destroy'])->name('destroy');
            });
        // Results Routes
        Route::prefix('results')
            ->name('teacher.results.')
            ->group(function () {
                Route::get('/', [TeacherResultController::class, 'index'])->name('index');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}', [TeacherResultController::class, 'showParticipantResults'])->name('show.participant');
                Route::get('/part-{participant_id}/quiz-{questionnaire_id}/print', [TeacherResultController::class, 'printParticipantResults'])->name('print.participant');
                Route::get('/part-{participant_id}/res-{result_id}', [TeacherResultController::class, 'showParticipantResultDetail'])->name('show.result');
                Route::get('/part-{participant_id}/res-{result_id}/print', [TeacherResultController::class, 'printParticipantResultDetail'])->name('print.result');
            });

        // Report Routes
        Route::prefix('reports')
            ->name('teacher.reports.')
            ->group(function () {
                Route::get('/', [TeacherReportController::class, 'index'])->name('index');
                Route::get('/print', [TeacherReportController::class, 'printPDF'])->name('print');
            });
    });

// Kuisonair Routes
Route::middleware(['participant', 'answering'])->group(function () {
    Route::get('/guide', [AnswerController::class, 'guide'])->name('guide');

    Route::middleware(['answering'])->group(function () {
        Route::get('/questionnaire/in-progress', [AnswerController::class, 'answerIndex']);
        Route::post('/questionnaire/in-progress', [AnswerController::class, 'answerStore']);
    });
});

// Global Routes
Route::middleware('auth')->group(function () {
    Route::put('/profile/update', [ProfileController::class, 'profileUpdate'])->name('profile.update');

    // Change Password
    Route::post('/profile/check-password', [ProfileController::class, 'checkPassword'])->name('profile.check-password');
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword'])->name('profile.change-password');
});

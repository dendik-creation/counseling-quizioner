<?php

namespace App\Http\Controllers\global;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use App\Models\Origin;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
class AuthController extends Controller
{
    private function redirectDashboardByLevel($level)
    {
        return match ($level) {
            User::ROLE_ADMIN => "/admin/dashboard",
            User::ROLE_MGBK => "/mgbk/dashboard",
            User::ROLE_COUNSELING_TEACHER => "/counseling/dashboard",
            default => "/dashboard",
        };
    }
    public function signedInStatus(Request $request)
    {
        $auth = Auth::user();
        if (!$auth) {
            return Inertia::location("/auth/signin");
        }
        Session::flash("success", "Login berhasil");
        $redirect_url = $this->redirectDashboardByLevel($auth->level);
        return Inertia::location($redirect_url);
    }
    public function signInView()
    {
        return Inertia::render("Auth/SignIn", [
            "app_name" => config("app.name"),
        ]);
    }
    public function signIn(Request $request)
    {
        $credentials = $request->validate([
            "username" => "required",
            "password" => "required",
        ]);

        $user = User::where("username", $credentials["username"])->first();
        if (!$user || !Hash::check($credentials["password"], $user->password)) {
            return back()->withErrors([
                "message" => "Username atau password salah",
            ]);
        }

        if (Auth::attempt($credentials)) {
            return Inertia::location("/");
        }

        return back()->withErrors([
            "message" => "Authentication failed",
        ]);
    }
    public function signOut($password_changed = false)
    {
        Auth::logout();
        if ($password_changed) {
            Session::flash(
                "success",
                "Password berhasil diubah. Silakan login kembali.",
            );
        } else {
            Session::flash("success", "Logout berhasil");
        }
        return Inertia::location("/auth/signin");
    }
    public function registerView()
    {
        if (session('participant_id')) {
            return redirect()->route('guide');
        }

        $origins = Origin::all();
        $origins = $origins->map(function ($origin) {
            return [
                'value' => $origin->id,
                'label' => $origin->name
            ];
        });
        return Inertia::render("Auth/Registration", ["app_name" => 'Register', 'origins' => $origins]);
    }

    public function registerStore(Request $request)
    {
        $data = $request->validate([
            "name" => "required",
            "unique_code" => "required",
            "origin_id" => "required|exists:origins,id",
            "token" => "required",
        ]);

        $questionnaires = Questionnaire::where("access_token", $request->token)->where("expires_at", ">=", now())->first();
        if (!$questionnaires) {
            return back()->withErrors([
                "message" => "Token tidak ditemukan / expired",
            ]);
        }

        $participant = Participant::create($data);
        session(['token' => $request->token, 'participant_id' => $participant->id, 'questionnaires_id' => $questionnaires->id]);

        Session::flash('success', 'Registrasi berhasil');
        return Inertia::location('/guide');
    }

    public function unregisterStore()
    {
        session()->forget(['answers', 'participant_id']);
        return Inertia::location('/');
    }
}

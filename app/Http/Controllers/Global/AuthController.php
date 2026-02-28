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

        if ($user->is_active === 0) {
            return back()->withErrors([
                "message" =>
                "Akun Anda dinonaktifkan. Hubungi MGBK atau Admin terkait",
            ]);
        }

        if (is_null($user->is_active)) {
            return back()->withErrors([
                "message" =>
                "Akun ada perlu diverifikasi oleh MGBK atau Admin. Tunggu beberapa waktu",
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
        if (session("participant_id")) {
            return redirect()->route("guide");
        }

        $origins = Origin::where('type', 'SCHOOL')->get();
        $origins = $origins->map(function ($origin) {
            return [
                "value" => $origin->id,
                "label" => $origin->name,
            ];
        });
        return Inertia::render("Auth/Registration", [
            "app_name" => "Register",
            "origins" => $origins,
        ]);
    }

    public function registerStore(Request $request)
    {
        $data = $request->validate([
            "name" => "required",
            "username" => "required",
            "password" => "required",
            "confirm_password" => "required",
            "origin_status" => "required",
        ]);

        if (!$request->origin_status) {
            $request->validate([
                "origin_id" => "required|exists:origins,id",
            ]);

            $origin_id = $request->origin_id;
        } else {
            $request->validate([
                "origin_name" => "required",
            ]);

            $origin = Origin::create(['name' => $request->origin_name, 'type' => 'SCHOOL']);
            $origin_id = $origin->id;
        }

        $user = User::where('username', $request->username)->first();
        if ($user) {
            Session::flash("error", "Username sudah terdaftar");
            return back()->withErrors([
                "message" =>
                "Username sudah terdaftar",
            ]);
        }

        User::create(['name' => $request->name, 'username' => $request->username, 'password' => Hash::make($request->password), 'level' => 3, 'origin_id' => $origin_id, 'is_active' => null]);

        Session::flash("success", "Registrasi berhasil");
        return Inertia::location("/");
    }

    public function unregisterStore()
    {
        session()->forget(["answers", "participant_id"]);
        return Inertia::location("/");
    }
}

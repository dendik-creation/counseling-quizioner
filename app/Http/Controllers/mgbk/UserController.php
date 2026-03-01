<?php

namespace App\Http\Controllers\mgbk;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class UserController extends Controller
{
     public function index(Request $request)
    {
        $search = $request->query("search");
        $users = User::when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%" . $search . "%")->orWhere(
                    "username",
                    "like",
                    "%" . $search . "%",
                );
            });
        })
            ->where("level", User::ROLE_COUNSELING_TEACHER)
            ->whereNot("id", Auth::user()->id)
            ->orderBy("name", "asc")
            ->paginate(config("custom.default.pagination"));
        return Inertia::render("Mgbk/Teacher/Index", [
            "title" => "Data Guru",
            "description" =>
                "Kelola data guru yang dapat mengakses dashboard sistem",
            "users" => $users,
            "search" => $search,
        ]);
    }

    public function activeStatusTeacher($user_id, Request $request){
        $validated = $request->validate([
            "is_active" => "required|string|in:true,false",
        ]);
        $validated["is_active"] = ($validated["is_active"] == null
                ? null
                : $validated["is_active"] == "true")
            ? true
            : false;
        $user = User::findOrFail($user_id);
        $user->update($validated);
        Session::flash("success", "Keaktifan guru berhasil diperbarui");
        return Inertia::location(route("mgbk.users.index"));
    }
}

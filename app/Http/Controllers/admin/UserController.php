<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query("search");
        $level = $request->query("level");
        $users = User::when($search, function ($query, $search) {
            return $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%" . $search . "%")->orWhere(
                    "username",
                    "like",
                    "%" . $search . "%",
                );
            });
        })
            ->when($level, function ($query, $level) {
                return $query->where("level", $level);
            })
            ->orderBy("name", "asc")
            ->paginate(config("custom.default.pagination"));
        return Inertia::render("Admin/User/Index", [
            "title" => "Data User",
            "description" =>
                "Kelola data user yang dapat mengakses dashboard sistem",
            "users" => $users,
            "search" => $search,
            "level" => $level,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|max:255",
            "username" => "required|max:255|unique:users,username",
            "password" => "required",
            "level" => "required",
        ]);

        $validated["password"] = Hash::make($validated["password"]);
        User::create($validated);
        Session::flash("success", "User berhasil ditambahkan.");
        return Inertia::location(route("admin.users.index"));
    }

    public function update(Request $request, $id) {}

    public function destroy($id) {}
}

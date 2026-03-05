<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Origin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class OriginController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query("search");
        $available_mgbk = User::where("level", User::ROLE_MGBK)->get()->map(function ($item) {
            return [
                "value" => $item->id,
                "label" => $item->name,
            ];
        });
        $origins = Origin::with("mgbk")->withCount([
            "participants as participant_count",
        ])
        ->when($search, function ($query) use ($search) {
            $query->where("name", "like", "%" . $search . "%");
        })
        ->paginate(config("custom.default.pagination"));
        return Inertia::render("Admin/Origin/Index", [
            "title" => "Data Asal",
            "description" =>
                "Kelola informasi asal ketika mengikuti kuisioner",
            "origins" => $origins,
            "search" => $search,
            "available_mgbk" => $available_mgbk,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|max:255",
            "type" => "required|max:255",
            "mgbk_id" => "nullable",
            "city" => "required",
        ]);

        Origin::create($validated);
        Session::flash("success", "Data asal berhasil ditambahkan.");
        return Inertia::location(route("admin.origins.index"));
    }

    public function update(Request $request, $id)
    {
        $origin = Origin::findOrFail($id);
        if (!$origin) {
            Session::flash("error", "Data asal tidak ditemukan");
            return Inertia::location(route("admin.origins.index"));
        }

        $validated = $request->validate([
            "name" => "required|max:255",
            "type" => "required|max:255",
            "mgbk_id" => "nullable",
            "city" => "required",
        ]);

        $origin->update($validated);
        Session::flash("success", "Data asal berhasil diperbarui.");
        return Inertia::location(route("admin.origins.index"));
    }

    public function destroy($id)
    {
        $origin = Origin::findOrFail($id);
        if (!$origin) {
            Session::flash("error", "Data asal tidak ditemukan");
            return Inertia::location(route("admin.origins.index"));
        }

        $origin->delete();
        Session::flash("success", "Data asal berhasil dihapus.");
        return Inertia::location(route("admin.origins.index"));
    }
}

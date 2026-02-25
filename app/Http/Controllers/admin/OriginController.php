<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Origin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class OriginController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query("search");
        $origins = Origin::withCount([
            "participants as participant_count",
        ])->paginate(config("custom.default.pagination"));
        return Inertia::render("Admin/Origin/Index", [
            "title" => "Data Asal Partisipan",
            "description" =>
                "Kelola informasi asal partisipan ketika mengikuti kuisioner",
            "origins" => $origins,
            "search" => $search,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|max:255",
            "type" => "required|max:255",
        ]);

        Origin::create($validated);
        Session::flash("success", "Asal partisipan berhasil ditambahkan.");
        return Inertia::location(route("admin.origins.index"));
    }

    public function update(Request $request, $id)
    {
        $origin = Origin::findOrFail($id);
        if (!$origin) {
            Session::flash("error", "Asal partisipan tidak ditemukan");
            return Inertia::location(route("admin.origins.index"));
        }

        $validated = $request->validate([
            "name" => "required|max:255",
            "type" => "required|max:255",
        ]);

        $origin->update($validated);
        Session::flash("success", "Asal partisipan berhasil diperbarui.");
        return Inertia::location(route("admin.origins.index"));
    }

    public function destroy($id)
    {
        $origin = Origin::findOrFail($id);
        if (!$origin) {
            Session::flash("error", "Asal partisipan tidak ditemukan");
            return Inertia::location(route("admin.origins.index"));
        }

        $origin->delete();
        Session::flash("success", "Asal partisipan berhasil dihapus.");
        return Inertia::location(route("admin.origins.index"));
    }
}

<?php

namespace App\Http\Controllers\mgbk;

use App\Http\Controllers\Controller;
use App\Models\Origin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OriginController extends Controller
{
        public function index(Request $request)
    {
        $search = $request->query("search");
        $user = Auth::user();
        $origins = Origin::withCount([
            "participants as participant_count",
        ])
        ->when($search, function ($query) use ($search) {
            $query->where("name", "like", "%" . $search . "%");
        })
        ->where("mgbk_id", $user->id)
        ->paginate(config("custom.default.pagination"));
        return Inertia::render("Mgbk/Origin/Index", [
            "title" => "Data Asal Partisipan",
            "description" =>
                "Kelola informasi asal partisipan (institusi) dibawah naungan Anda",
            "origins" => $origins,
            "search" => $search,
        ]);
    }
}

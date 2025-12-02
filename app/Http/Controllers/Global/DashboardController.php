<?php

namespace App\Http\Controllers\global;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function adminIndex()
    {
        return Inertia::render("Admin/Dashboard", [
            "title" => "Dashboard",
            "description" =>
                "Informasi singkat dan ringkas mengenai konseling yang dilakukan",
        ]);
    }
}

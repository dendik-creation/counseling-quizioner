<?php

namespace App\Http\Controllers\mgbk;

use App\Http\Controllers\Controller;
use App\Models\Origin;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    private function myUserId()
    {
        return Auth::user()->id;
    }

    public function index(Request $request)
    {
        $by_search = $request->query('search');
        $by_origin = $request->query('origin');

        $origins = Origin::where('mgbk_id', $this->myUserId())->get()->map(function ($origin) {
            return [
                'label' => $origin->name,
                'value' => $origin->id,
                'additional_info' => [
                    'type' => $origin->type,
                ],
            ];
        });
        $participants = Participant::with('origin')
            ->whereHas('origin', function ($query) {
                $query->where('mgbk_id', $this->myUserId());
            })
            ->when($by_search, function ($query, $by_search) {
                $query
                    ->where('name', 'like', '%' . $by_search . '%')
                    ->orWhere('unique_code', 'like', '%' . $by_search . '%')
                    ->orWhere('class', 'like', '%' . $by_search . '%')
                    ->orWhere('work', 'like', '%' . $by_search . '%');
            })
            ->when($by_origin, function ($query, $by_origin) {
                $query->where('origin_id', $by_origin);
            })
            ->paginate(config('custom.default.pagination'));
        return Inertia::render('Mgbk/Participant/Index', [
            'title' => 'Data Partisipan',
            'description' => 'Kelola data partisipan yang mengikuti kuisioner',
            'participants' => $participants,
            'origins' => $origins,
            'search' => $by_search,
            'origin' => $by_origin,
        ]);
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::findOrFail($id);
        if (!$participant) {
            Session::flash('error', 'Partisipan tidak ditemukan');
            return Inertia::location(route('mgbk.participants.index'));
        }

        $validated = $request->validate([
            'origin_id' => 'nullable|exists:participant_origins,id',
            'unique_code' => 'required|max:255',
            'name' => 'required|max:255',
            'class' => 'nullable|max:255',
            'work' => 'nullable|max:255',
        ]);

        $participant->update($validated);
        Session::flash('success', 'Partisipan berhasil diperbarui.');
        return Inertia::location(route('mgbk.participants.index'));
    }

    public function destroy($id)
    {
        $participant = Participant::findOrFail($id);
        if (!$participant) {
            Session::flash('error', 'Partisipan tidak ditemukan');
            return Inertia::location(route('mgbk.participants.index'));
        }

        $participant->delete();
        Session::flash('success', 'Partisipan berhasil dihapus.');
        return Inertia::location(route('mgbk.participants.index'));
    }
}

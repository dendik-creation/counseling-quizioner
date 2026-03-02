<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    /** Helper – origin_id milik guru yang sedang login */
    private function myOriginId(): int
    {
        return (int) Auth::user()->origin_id;
    }

    public function index(Request $request)
    {
        $by_search = $request->query('search');
        $originId  = $this->myOriginId();

        $participants = Participant::with('origin')
            ->where('origin_id', $originId)          // ← hanya sekolah guru ini
            ->when($by_search, function ($query, $by_search) {
                $query
                    ->where('name',        'like', '%' . $by_search . '%')
                    ->orWhere('unique_code','like', '%' . $by_search . '%')
                    ->orWhere('class',     'like', '%' . $by_search . '%')
                    ->orWhere('work',      'like', '%' . $by_search . '%');
            })
            ->paginate(config('custom.default.pagination'));

        return Inertia::render('Teacher/Participant/Index', [
            'title'        => 'Data Partisipan',
            'description'  => 'Kelola data partisipan di sekolah Anda',
            'participants' => $participants,
            'search'       => $by_search,
        ]);
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::where('id', $id)
            ->where('origin_id', $this->myOriginId())
            ->firstOrFail();

        $validated = $request->validate([
            'unique_code' => 'required|max:255',
            'name'        => 'required|max:255',
            'class'       => 'nullable|max:255',
            'work'        => 'nullable|max:255',
        ]);

        $participant->update($validated);
        Session::flash('success', 'Partisipan berhasil diperbarui.');
        return Inertia::location(route('teacher.participants.index'));
    }

    public function destroy($id)
    {
        $participant = Participant::where('id', $id)
            ->where('origin_id', $this->myOriginId())
            ->firstOrFail();

        $participant->delete();
        Session::flash('success', 'Partisipan berhasil dihapus.');
        return Inertia::location(route('teacher.participants.index'));
    }
}

<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Models\Choice;
use App\Models\Question;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultController extends Controller
{
    /** Helper – origin_id tunggal milik guru yang sedang login */
    private function myOriginId(): int
    {
        return (int) Auth::user()->origin_id;
    }

    public function index(Request $request)
    {
        $search           = $request->query('search');
        $questionnaire_id = $request->query('questionnaire_id');
        $originId         = $this->myOriginId();

        $available_questionnaires = DB::table('questionnaires')
            ->get()
            ->map(fn($q) => ['value' => $q->id, 'label' => $q->title]);

        $resultsQuery = Result::with('participant', 'origin', 'questionnaire')
            ->where('origin_id', $originId)            // ← scope 1 origin
            ->when($search, function ($query, $search) {
                $query->whereHas('participant', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('participant_class', 'like', "%{$search}%")
                      ->orWhere('participant_work',  'like', "%{$search}%");
                });
            })
            ->when($questionnaire_id, fn($q, $v) => $q->where('questionnaire_id', $v));

        $resultsCollection = $resultsQuery->get();

        $grouped = $resultsCollection->groupBy(
            fn($item) => $item->participant_id . '-' . $item->questionnaire_id
        );

        $perPage     = config('custom.default.pagination_less');
        $currentPage = request()->get('page', 1);

        $groupedItems = $grouped->map(function ($results) {
            $first = $results->first();
            return [
                'participant_id'   => $first->participant_id,
                'questionnaire_id' => $first->questionnaire_id,
                'participant'      => $first->participant,
                'questionnaire'    => $first->questionnaire,
                'results'          => $results->values(),
            ];
        })->values();

        $total      = $groupedItems->count();
        $pagedItems = $groupedItems->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $results = new \Illuminate\Pagination\LengthAwarePaginator(
            $pagedItems, $total, $perPage, $currentPage,
            ['path' => request()->url(), 'query' => request()->query()],
        );

        return Inertia::render('Teacher/Result/Index', [
            'title'                    => 'Hasil Kuisioner',
            'description'              => 'Daftar kuisioner yang telah dikerjakan oleh siswa Anda',
            'results'                  => $results,
            'available_questionnaires' => $available_questionnaires,
            'filters'                  => [
                'search'           => $search,
                'questionnaire_id' => $questionnaire_id,
            ],
        ]);
    }

    public function showParticipantResults($participant_id, $questionnaire_id)
    {
        $originId = $this->myOriginId();

        $results = Result::with('participant', 'origin', 'questionnaire')
            ->where('participant_id', $participant_id)
            ->where('questionnaire_id', $questionnaire_id)
            ->where('origin_id', $originId)            // ← scope 1 origin
            ->latest()
            ->get();

        if ($results->count() == 0) {
            return redirect()->route('teacher.results.index')
                ->with('error', 'Hasil kuisioner tidak ditemukan.');
        }

        return Inertia::render('Teacher/Result/Show', [
            'title'       => 'Hasil Kuisioner Siswa',
            'description' => 'Histori kuisioner yang telah dikerjakan oleh siswa',
            'results'     => $results,
            'participant' => $results->first()->participant->load('origin'),
        ]);
    }

    public function showParticipantResultDetail($participant_id, $result_id)
    {
        $originId = $this->myOriginId();

        $result = Result::where('id', $result_id)
            ->where('participant_id', $participant_id)
            ->where('origin_id', $originId)            // ← scope 1 origin
            ->with(['participant:id,name', 'origin:id,name,type', 'questionnaire:id,title', 'answers'])
            ->first();

        if (!$result) {
            return redirect()->route('teacher.results.index')
                ->with('error', 'Jawaban kuisioner tidak ditemukan.');
        }

        $result['try_step'] = Result::where('participant_id', $participant_id)
            ->where('questionnaire_id', $result->questionnaire_id)
            ->where('completed_at', '<=', $result->completed_at)
            ->count();

        $available_questions = Question::where('questionnaire_id', $result->questionnaire_id)->get();
        $available_choices   = Choice::where('questionnaire_id',  $result->questionnaire_id)->get();

        return Inertia::render('Teacher/Result/ShowAnswer', [
            'title'               => 'Hasil Jawaban Kuisioner',
            'description'         => 'Detail jawaban kuisioner yang telah dikerjakan oleh siswa',
            'result'              => $result,
            'available_questions' => $available_questions,
            'available_choices'   => $available_choices,
        ]);
    }

    public function printParticipantResults(Request $request, $participant_id, $questionnaire_id)
    {
        $originId = $this->myOriginId();

        $results = Result::with('participant', 'origin', 'questionnaire')
            ->where('participant_id', $participant_id)
            ->where('questionnaire_id', $questionnaire_id)
            ->where('origin_id', $originId)
            ->latest()
            ->get();

        if ($results->count() == 0) {
            return redirect()->route('teacher.results.index')
                ->with('error', 'Hasil kuisioner tidak ditemukan.');
        }

        return Inertia::render('Teacher/Result/PrintShow', [
            'title'       => 'Cetak Histori Kuisioner',
            'description' => 'Histori pengerjaan kuisioner siswa',
            'results'     => $results,
            'participant' => $results->first()->participant->load('origin'),
        ]);
    }

    public function printParticipantResultDetail(Request $request, $participant_id, $result_id)
    {
        $originId = $this->myOriginId();

        $result = Result::where('id', $result_id)
            ->where('participant_id', $participant_id)
            ->where('origin_id', $originId)
            ->with(['participant:id,name', 'origin:id,name,type', 'questionnaire:id,title', 'answers'])
            ->first();

        if (!$result) {
            return redirect()->route('teacher.results.index')
                ->with('error', 'Jawaban kuisioner tidak ditemukan.');
        }

        $result['try_step'] = Result::where('participant_id', $participant_id)
            ->where('questionnaire_id', $result->questionnaire_id)
            ->where('completed_at', '<=', $result->completed_at)
            ->count();

        $available_questions = Question::where('questionnaire_id', $result->questionnaire_id)->get();
        $available_choices   = Choice::where('questionnaire_id',  $result->questionnaire_id)->get();

        return Inertia::render('Teacher/Result/PrintAnswer', [
            'title'               => 'Cetak Jawaban Kuisioner',
            'description'         => 'Detail jawaban kuisioner siswa',
            'result'              => $result,
            'available_questions' => $available_questions,
            'available_choices'   => $available_choices,
        ]);
    }
}

<?php

namespace App\Http\Controllers\mgbk;

use App\Http\Controllers\Controller;
use App\Models\Choice;
use App\Models\Origin;
use App\Models\Question;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResultController extends Controller
{
    /** Helper – origin IDs milik MGBK yang sedang login */
    private function myOriginIds(): array
    {
        return Origin::where('mgbk_id', Auth::id())->pluck('id')->toArray();
    }

    public function index(Request $request)
    {
        $search           = $request->query('search');
        $origin           = $request->query('origin');
        $questionnaire_id = $request->query('questionnaire_id');
        $myOriginIds      = $this->myOriginIds();

        /* Filter origin hanya yang milik MGBK ini */
        $available_origins = Origin::where('mgbk_id', Auth::id())
            ->get()
            ->map(fn($o) => ['value' => $o->id, 'label' => $o->name]);

        $available_questionnaires = DB::table('questionnaires')
            ->get()
            ->map(fn($q) => ['value' => $q->id, 'label' => $q->title]);

        $resultsQuery = Result::with('participant', 'origin', 'questionnaire')
            ->whereIn('origin_id', $myOriginIds)          // ← scope MGBK
            ->when($search, function ($query, $search) {
                $query->whereHas('participant', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('participant_class', 'like', "%{$search}%")
                      ->orWhere('participant_work',  'like', "%{$search}%");
                });
            })
            ->when($origin, fn($q, $v) => $q->where('origin_id', $v))
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

        return Inertia::render('Mgbk/Result/Index', [
            'title'                   => 'Hasil Kuisioner',
            'description'             => 'Daftar kuisioner yang telah dikerjakan oleh partisipan Anda',
            'results'                 => $results,
            'available_origins'       => $available_origins,
            'available_questionnaires'=> $available_questionnaires,
            'filters'                 => [
                'search'           => $search,
                'origin'           => $origin,
                'questionnaire_id' => $questionnaire_id,
            ],
        ]);
    }

    public function showParticipantResults($participant_id, $questionnaire_id)
    {
        $myOriginIds = $this->myOriginIds();

        $results = Result::with('participant', 'origin', 'questionnaire')
            ->where('participant_id', $participant_id)
            ->where('questionnaire_id', $questionnaire_id)
            ->whereIn('origin_id', $myOriginIds)          // ← scope MGBK
            ->latest()
            ->get();

        if ($results->count() == 0) {
            return redirect()->route('mgbk.results.index')
                ->with('error', 'Hasil kuisioner tidak ditemukan.');
        }

        return Inertia::render('Mgbk/Result/Show', [
            'title'       => 'Hasil Kuisioner Partisipan',
            'description' => 'Histori kuisioner yang telah dikerjakan oleh partisipan',
            'results'     => $results,
            'participant' => $results->first()->participant->load('origin'),
        ]);
    }

    public function showParticipantResultDetail($participant_id, $result_id)
    {
        $myOriginIds = $this->myOriginIds();

        $result = Result::where('id', $result_id)
            ->where('participant_id', $participant_id)
            ->whereIn('origin_id', $myOriginIds)          // ← scope MGBK
            ->with(['participant:id,name', 'origin:id,name', 'questionnaire:id,title', 'answers'])
            ->first();

        if (!$result) {
            return redirect()->route('mgbk.results.index')
                ->with('error', 'Jawaban kuisioner tidak ditemukan.');
        }

        $result['try_step'] = Result::where('participant_id', $participant_id)
            ->where('questionnaire_id', $result->questionnaire_id)
            ->where('completed_at', '<=', $result->completed_at)
            ->count();

        $available_questions = Question::where('questionnaire_id', $result->questionnaire_id)->get();
        $available_choices   = Choice::where('questionnaire_id', $result->questionnaire_id)->get();

        return Inertia::render('Mgbk/Result/ShowAnswer', [
            'title'               => 'Hasil Jawaban Kuisioner',
            'description'         => 'Detail jawaban kuisioner yang telah dikerjakan oleh partisipan',
            'result'              => $result,
            'available_questions' => $available_questions,
            'available_choices'   => $available_choices,
        ]);
    }

    public function printParticipantResults(Request $request, $participant_id, $questionnaire_id)
    {
        $myOriginIds = $this->myOriginIds();

        $results = Result::with('participant', 'origin', 'questionnaire')
            ->where('participant_id', $participant_id)
            ->where('questionnaire_id', $questionnaire_id)
            ->whereIn('origin_id', $myOriginIds)
            ->latest()
            ->get();

        if ($results->count() == 0) {
            return redirect()->route('mgbk.results.index')
                ->with('error', 'Hasil kuisioner tidak ditemukan.');
        }

        return Inertia::render('Mgbk/Result/PrintShow', [
            'title'       => 'Cetak Histori Kuisioner',
            'description' => 'Histori pengerjaan kuisioner partisipan',
            'results'     => $results,
            'participant' => $results->first()->participant->load('origin'),
        ]);
    }

    public function printParticipantResultDetail(Request $request, $participant_id, $result_id)
    {
        $myOriginIds = $this->myOriginIds();

        $result = Result::where('id', $result_id)
            ->where('participant_id', $participant_id)
            ->whereIn('origin_id', $myOriginIds)
            ->with(['participant:id,name', 'origin:id,name,type', 'questionnaire:id,title', 'answers'])
            ->first();

        if (!$result) {
            return redirect()->route('mgbk.results.index')
                ->with('error', 'Jawaban kuisioner tidak ditemukan.');
        }

        $result['try_step'] = Result::where('participant_id', $participant_id)
            ->where('questionnaire_id', $result->questionnaire_id)
            ->where('completed_at', '<=', $result->completed_at)
            ->count();

        $available_questions = Question::where('questionnaire_id', $result->questionnaire_id)->get();
        $available_choices   = Choice::where('questionnaire_id', $result->questionnaire_id)->get();

        return Inertia::render('Mgbk/Result/PrintAnswer', [
            'title'               => 'Cetak Jawaban Kuisioner',
            'description'         => 'Detail jawaban kuisioner partisipan',
            'result'              => $result,
            'available_questions' => $available_questions,
            'available_choices'   => $available_choices,
        ]);
    }
}

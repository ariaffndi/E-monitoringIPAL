<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OperationalReport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Unit;
use App\Models\WaterParameter;
use App\Models\UnitTest;
use App\Models\WaterTest;


class OperationalReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }

        $query = OperationalReport::with([
            'user',
            'unitTests',
            'waterTests.waterParameter'
        ]);

        // ================= SEARCH =================
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('note', 'like', '%' . $request->search . '%')
                ->orWhereHas('user', function ($q2) use ($request) {
                    $q2->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        // ================= PAGINATION =================
        $reports = $query->latest()->paginate(15)->withQueryString();

        // ================= CALCULATION =================
        $reports->getCollection()->transform(function ($report) {

            $map = [
                'sangat kurang' => 1,
                'kurang' => 2,
                'cukup' => 3,
                'baik' => 4,
                'sangat baik' => 5,
            ];

            // UNIT
            $unitScores = $report->unitTests->map(function ($u) use ($map) {
                return $map[strtolower($u->condition)] ?? 0;
            });

            $report->unit_avg = $unitScores->avg();

            // WATER
            $inletScores = [];
            $outletScores = [];

            foreach ($report->waterTests as $w) {
                $min = $w->waterParameter->min_value;
                $max = $w->waterParameter->max_value;
                $val = $w->value;

                $score = ($val >= $min && $val <= $max) ? 5 : 2;

                if ($w->location === 'inlet') {
                    $inletScores[] = $score;
                } else {
                    $outletScores[] = $score;
                }
            }

            $report->inlet_avg = collect($inletScores)->avg();
            $report->outlet_avg = collect($outletScores)->avg();

            return $report;
        });

        return Inertia::render('admin/operational-reports/Index', [
            'reports' => $reports,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (Auth::user()->role !== 'operator') {
            abort(403);
        }

        return Inertia::render('operator/operational-reports/Create', [
            'units' => Unit::select('id', 'name')->get(),
            'parameters' => WaterParameter::select('id', 'name', 'unit', 'type')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'operator') {
            abort(403);
        }

        $request->validate([
            'unit_tests' => 'required|array',
            'water_tests.inlet' => 'required|array',
            'water_tests.outlet' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            $report = OperationalReport::create([
                'user_id' => Auth::id(),
                'note' => $request->note,
                'date' => now(),
            ]);

            // ================= UNIT TEST =================
            foreach ($request->unit_tests as $index => $unit) {
                $image = null;

                if ($request->hasFile("unit_tests.$index.test_image")) {
                    $image = $request->file("unit_tests.$index.test_image")
                        ->store('unit-tests', 'public');
                }

                UnitTest::create([
                    'operational_report_id' => $report->id,
                    'unit_id' => $unit['unit_id'],
                    'condition' => $unit['condition'],
                    'test_image' => $image,
                ]);
            }

            // ================= WATER TEST =================
            foreach (['inlet', 'outlet'] as $location) {
                foreach ($request->water_tests[$location] as $index => $water) {

                    $image = null;

                    if ($request->hasFile("water_tests.$location.$index.test_image")) {
                        $image = $request->file("water_tests.$location.$index.test_image")
                            ->store('water-tests', 'public');
                    }

                    WaterTest::create([
                        'operational_report_id' => $report->id,
                        'water_parameter_id' => $water['water_parameter_id'],
                        'location' => $location,
                        'value' => $water['value'],
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Laporan Operasional Berhasil Ditambahkan!');

        } catch (\Exception $e) {
            DB::rollBack();

            dd($e->getMessage());
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }

        $report = OperationalReport::with([
            'user',
            'unitTests.unit',
            'waterTests.waterParameter'
        ])->findOrFail($id);

        return Inertia::render('admin/operational-reports/Show', [
            'report' => $report
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function history()
    {
        if (Auth::user()->role !== 'operator') {
            abort(403);
        }

        $reports = OperationalReport::withCount(['unitTests', 'waterTests'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

        return Inertia::render('operator/operational-reports/History', [
            'reports' => $reports
        ]);
    }

    public function historyShow($id)
    {
        if (Auth::user()->role !== 'operator') {
            abort(403);
        }

        $report = OperationalReport::with([
            'unitTests.unit',
            'waterTests.waterParameter'
        ])
        ->where('user_id', Auth::id())
        ->findOrFail($id);

        return Inertia::render('operator/operational-reports/HistoryShow', [
            'report' => $report
        ]);
    }
}

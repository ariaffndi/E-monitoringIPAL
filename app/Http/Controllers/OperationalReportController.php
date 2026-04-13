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
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
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
                        'test_image' => $image,
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
        $report = OperationalReport::with([
            'unitTests.unit',
            'waterTests.waterParameter'
        ])
        ->where('user_id', Auth::id())
        ->findOrFail($id);

        

        return Inertia::render('operator/operational-reports/Show', [
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
        $reports = OperationalReport::withCount(['unitTests', 'waterTests'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('operator/operational-reports/History', [
            'reports' => $reports
        ]);
    }
}

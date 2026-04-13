<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WaterTest;

class WaterTestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'operational_report_id' => 'required|exists:operational_reports,id',
            'water_parameter_id' => 'required|exists:water_parameters,id',
            'location' => 'required|in:inlet,outlet',
            'value' => 'required|numeric',
            'test_image' => 'nullable|image',
        ]);

        $imagePath = null;

        if ($request->hasFile('test_image')) {
            $imagePath = $request->file('test_image')->store('water-tests', 'public');
        }

        WaterTest::create([
            'operational_report_id' => $request->operational_report_id,
            'water_parameter_id' => $request->water_parameter_id,
            'location' => $request->location,
            'value' => $request->value,
            'test_image' => $imagePath,
        ]);

        return back()->with('success', 'Water test saved');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
}

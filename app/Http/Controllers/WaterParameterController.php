<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WaterParameter;
use Inertia\Inertia;

class WaterParameterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projectId = session('selected_project_id');

        $query = WaterParameter::where(
            'project_id',
            $projectId
        );

        if ($request->filled('search')) {

            $query->where(function ($q) use ($request) {

                $q->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        return Inertia::render(
            'admin/water-parameters/Index',
            [
                'waterparameters' => $query
                    ->latest()
                    ->get()
            ]
        );
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:255',
            'min_value' => 'required|numeric',
            'max_value' => 'required|numeric',
            'type' => 'required|string|max:255',
        ]);

        WaterParameter::create([
            'project_id' => session('selected_project_id'),
            'name' => $validated['name'],
            'unit' => $validated['unit'],
            'min_value' => $validated['min_value'],
            'max_value' => $validated['max_value'],
            'type' => $validated['type'],
        ]);

        return redirect()
            ->back()
            ->with(
                'success',
                'Parameter berhasil ditambahkan'
            );
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
        $selectedProjectId = session('selected_project_id');

        $waterParameter = WaterParameter::query()
            ->where('project_id', $selectedProjectId)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required', 'string', 'max:255',
            'unit' => 'required', 'string', 'max:255',
            'min_value' => 'required', 'numeric',
            'max_value' => 'required', 'numeric',
            'type' => 'required', 'string', 'max:255',
        ]);

        $waterParameter->update($validated);

        return back()->with(
            'success',
            'Parameter berhasil diupdate'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $waterParameter = WaterParameter::where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        $waterParameter->delete();

        return back()->with(
            'success',
            'Parameter berhasil dihapus'
        );
    }
}
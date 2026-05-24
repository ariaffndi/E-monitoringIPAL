<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Project::query();

        if ($request->search) {

            $query->where(function ($q) use ($request) {

                $q->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhere(
                    'location',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhere(
                    'type',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        return Inertia::render(
            'admin/projects/Index',
            [
                'projects' => $query
                    ->latest()
                    ->get(),

                'filters' => $request->only('search'),
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
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'capacity' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                ->store('projects', 'public');
        }

        Project::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'image' => $imagePath,
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project berhasil dibuat');
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
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'capacity' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $project->image;
        if ($request->hasFile('image')) {
            // hapus lama
            if ($project->image) {
                Storage::disk('public')
                    ->delete($project->image);
            }
            $imagePath = $request->file('image')
                ->store('projects', 'public');
        }

        $project->update([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'image' => $imagePath,
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->image) {
            Storage::disk('public')
                ->delete($project->image);
        }
        $project->delete();

        return back()->with(
            'success',
            'Project berhasil dihapus'
        );
    }


    public function select(Project $project)
    {
        session([
            'selected_project_id' => $project->id
        ]);

        return redirect('/dashboard');
    }

    public function leave()
    {
        session()->forget('selected_project_id');

        return redirect('/projects');
    }
}

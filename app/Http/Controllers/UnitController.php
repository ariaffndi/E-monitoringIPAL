<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projectId = session('selected_project_id');

        $query = Unit::where(
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

        return Inertia::render('admin/units/Index', [
            'units' => $query->latest()->get()
        ]);
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
            'specification' => 'required|string|max:255',
            'dimension' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:8192',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {

            $imagePath = $this->uploadImage(
                $request->file('image'),
                'units'
            );
        }

        Unit::create([
            'project_id' => session('selected_project_id'),
            'name' => $validated['name'],
            'specification' => $validated['specification'],
            'dimension' => $validated['dimension'],
            'description' => $validated['description'],
            'image' => $imagePath,
        ]);

        return redirect()
            ->back()
            ->with(
                'success',
                'Unit berhasil ditambahkan'
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
        $unit = Unit::where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specification' => 'required|string|max:255',
            'dimension' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8192',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'specification' => $validated['specification'],
            'dimension' => $validated['dimension'],
            'description' => $validated['description'],
        ];

        // ================= IMAGE =================
        if ($request->hasFile('image')) {

            // hapus gambar lama
            if (
                $unit->image &&
                Storage::disk('public')->exists($unit->image)
            ) {
                Storage::disk('public')->delete($unit->image);
            }

            $imagePath = $this->uploadImage(
                $request->file('image'),
                'units'
            );

            $updateData['image'] = $imagePath;
        }

        $unit->update($updateData);

        return back()->with(
            'success',
            'Unit berhasil diupdate'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $unit = Unit::where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        if ($unit->image) {

            Storage::disk('public')
                ->delete($unit->image);
        }

        $unit->delete();

        return back()->with(
            'success',
            'Unit berhasil dihapus'
        );
    }

    private function uploadImage($file, string $folder): string
    {
        $manager = new ImageManager(
            new Driver()
        );

        $filename = Str::uuid() . '.webp';

        $image = $manager->decode($file);

        $image->scaleDown(width: 1200);

        Storage::disk('public')->put(
            "{$folder}/{$filename}",
            (string) $image->encodeUsingFileExtension(
                'webp',
                quality: 50
            )
        );

        return "{$folder}/{$filename}";
    }
}
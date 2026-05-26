<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $projectId = session('selected_project_id');

        $query = User::query()
            ->where('role', '!=', 'admin')
            ->where('project_id', $projectId);

        if ($request->filled('search')) {

            $query->where(function ($q) use ($request) {

                $q->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhere(
                    'email',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        return Inertia::render('admin/users/Index', [
            'users' => $query
                ->select(
                    'id',
                    'name',
                    'email',
                    'role',
                    'image',
                    'project_id'
                )
                ->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,operator',
            'password' => 'required|min:6',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                ->store('users', 'public');
        }

        User::create([
            'project_id' => session('selected_project_id'),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'image' => $imagePath,
        ]);

        return redirect()
            ->back()
            ->with(
                'success',
                'User berhasil ditambahkan'
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
        $user = User::where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,operator',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        // ================= IMAGE =================
        if ($request->hasFile('image')) {

            // hapus foto lama
            if ($user->image && Storage::disk('public')->exists($user->image)) {

                Storage::disk('public')->delete($user->image);
            }

            $updateData['image'] = $request
                ->file('image')
                ->store('users', 'public');
        }

        $user->update($updateData);

        return back()->with(
            'success',
            'User berhasil diupdate'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        $user->delete();

        return back()->with(
            'success',
            'User berhasil dihapus'
        );
    }
}
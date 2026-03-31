<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Auth::check()
        ? redirect('/dashboard')
        : redirect('/login');
});

Route::get('/dashboard', function () {
    if (Auth::user()->role === 'admin') {
        return redirect('/admin');
    }
    return redirect('/operator');
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return inertia('admin/Dashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth', 'role:operator'])->group(function () {
    Route::get('/operator', function () {
        return inertia('operator/Dashboard');
    })->name('operator.dashboard');
});

require __DIR__.'/settings.php';

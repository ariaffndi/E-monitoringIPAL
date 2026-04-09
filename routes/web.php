<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\WaterParameterController;

//Route Guest
Route::get('/', function () {
    return Auth::check()
        ? redirect('/dashboard')
        : redirect('/login');
});

//Route Dashboard based on role
Route::get('/dashboard', function () {
    if (Auth::user()->role === 'admin') {
        return redirect('/admin');
    }
    return redirect('/operator');
})->middleware(['auth'])->name('dashboard');

//Route Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return inertia('admin/Dashboard');
    })->name('admin.dashboard');

    Route::resource('users', UserController::class);
    Route::resource('units', UnitController::class);
    Route::resource('water-parameters', WaterParameterController::class);
});

//Route Operator
Route::middleware(['auth', 'role:operator'])->group(function () {
    Route::get('/operator', function () {
        return inertia('operator/Dashboard');
    })->name('operator.dashboard');
});

require __DIR__.'/settings.php';

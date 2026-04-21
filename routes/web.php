<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\WaterParameterController;
use App\Http\Controllers\OperationalReportController;
use App\Http\Controllers\UnitTestController;
use App\Http\Controllers\WaterTestController;
use App\Http\Controllers\DashboardController;

//Route Guest
Route::get('/', function () {
    return Auth::check()
        ? redirect('/dashboard')
        : redirect('/login');
});

//Route Dashboard based on role
// Dashboard (single entry)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

//Route Admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('units', UnitController::class);
    Route::resource('water-parameters', WaterParameterController::class);
});


//Route Operator
Route::middleware(['auth', 'role:operator'])->group(function () {
    Route::resource('unit-tests', UnitTestController::class);
    Route::resource('water-tests', WaterTestController::class);
});

//Route Operational Report (Gabungan)
Route::middleware(['auth'])->group(function () {
    Route::get('/operational-reports/history', [OperationalReportController::class, 'history']);
    Route::get('/operational-reports/history/{id}', [OperationalReportController::class, 'historyShow']);
    
    Route::resource('operational-reports', OperationalReportController::class)
        ->only(['index', 'show', 'create', 'store']);
});


require __DIR__.'/settings.php';

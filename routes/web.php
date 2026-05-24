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
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    if (!Auth::check()) {
        return redirect('/login');
    }

    return Auth::user()->role === 'admin'
        ? redirect('/projects')
        : redirect('/dashboard');
});

/*
|--------------------------------------------------------------------------
| REDIRECT AFTER LOGIN
|--------------------------------------------------------------------------
*/

Route::get('/redirect-after-login', function () {

    // ADMIN
    if (Auth::user()->role === 'admin') {

        return redirect('/projects');
    }

    // OPERATOR
    session([
        'selected_project_id' =>
            Auth::user()->project_id
    ]);

    return redirect('/dashboard');

})->middleware('auth');

/*
|--------------------------------------------------------------------------
| PROJECTS (ADMIN ONLY)
|--------------------------------------------------------------------------
| Tidak perlu project.selected
*/

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('projects', ProjectController::class);
    
    Route::post(
        '/projects/{project}/select',
        [ProjectController::class, 'select']
    )->name('projects.select');

    Route::post(
        '/projects/leave',
        [ProjectController::class, 'leave']
    )->name('projects.leave');
});

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    )
    ->middleware('project.selected')
    ->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| OPERATIONAL REPORTS
|--------------------------------------------------------------------------
*/

/* RECAP (ADMIN) */

Route::middleware([
    'auth',
    'role:admin',
    'project.selected'
])->group(function () {

    Route::get(
        '/operational-reports/recap',
        [OperationalReportController::class, 'recap']
    )->name('operational-reports.recap');

    Route::get(
        '/operational-reports/recap/print',
        [OperationalReportController::class, 'printRecap']
    )->name('operational-reports.recap.print');
});

/* OPERATOR & RESOURCE */

Route::middleware([
    'auth',
    'project.selected'
])->group(function () {

    // HISTORY
    Route::get(
        '/operational-reports/history',
        [OperationalReportController::class, 'history']
    );

    Route::get(
        '/operational-reports/history/{id}',
        [OperationalReportController::class, 'historyShow']
    );

    // RESOURCE
    Route::resource(
        'operational-reports',
        OperationalReportController::class
    )->only([
        'index',
        'show',
        'create',
        'store'
    ]);
});

/*
|--------------------------------------------------------------------------
| PRINT & DETAIL (ADMIN)
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'role:admin',
    'project.selected'
])->group(function () {

    Route::get(
        '/operational-reports/{report}/print',
        [OperationalReportController::class, 'print']
    )->name('operational-reports.print');

    Route::get(
        '/operational-reports/{id}',
        [OperationalReportController::class, 'show']
    )->name('operational-reports.show');
});

/*
|--------------------------------------------------------------------------
| OPERATOR ONLY
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'role:operator'
])->group(function () {
    Route::resource('unit-tests', UnitTestController::class);
    Route::resource('water-tests', WaterTestController::class);
});

/*
|--------------------------------------------------------------------------
| ADMIN FEATURES
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'role:admin',
    'project.selected'
])->group(function () {

    Route::resource('users', UserController::class);
    Route::resource('units', UnitController::class);
    Route::resource(
        'water-parameters',
        WaterParameterController::class
    );
});

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';
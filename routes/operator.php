<?php
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:operator'])->group(function () {
    Route::get('/operator', function () {
        return inertia('Operator/Dashboard');
    });
});
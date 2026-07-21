<?php

use App\Http\Controllers\Nasabah\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:nasabah'])
    ->prefix('nasabah')
    ->name('nasabah.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

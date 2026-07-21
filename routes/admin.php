<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NasabahController;
use App\Http\Controllers\Admin\RewardController;
use App\Http\Controllers\Admin\SampahCategoryController;
use App\Http\Controllers\Admin\SampahController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\TukarPoinController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Inventory
        Route::resource('sampah-categories', SampahCategoryController::class)->only(['store', 'update', 'destroy']);
        Route::resource('sampah', SampahController::class)->except(['create', 'edit', 'show']);
        Route::resource('rewards', RewardController::class)->except(['create', 'edit', 'show']);

        // Citizens
        Route::get('nasabah', [NasabahController::class, 'index'])->name('nasabah.index');
        Route::post('nasabah/{user}/reset-password', [NasabahController::class, 'resetPassword'])->name('nasabah.reset-password');

        // Deposits & Approvals
        Route::resource('transactions', TransactionController::class)->only(['index', 'store']);
        Route::get('redemptions', [TukarPoinController::class, 'index'])->name('redemptions.index');
        Route::patch('redemptions/{tukarPoin}/status', [TukarPoinController::class, 'updateStatus'])->name('redemptions.update-status');
    });

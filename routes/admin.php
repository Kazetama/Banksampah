<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Deposits & Export
        Route::get('transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
        Route::resource('transactions', TransactionController::class)->only(['index', 'store']);
    });

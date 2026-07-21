<?php

use App\Http\Controllers\Nasabah\DashboardController;
use App\Http\Controllers\Nasabah\KatalogSampahController;
use App\Http\Controllers\Nasabah\RewardController;
use App\Http\Controllers\Nasabah\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:nasabah'])
    ->prefix('nasabah')
    ->name('nasabah.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Katalog sampah
        Route::get('katalog-sampah', [KatalogSampahController::class, 'index'])->name('katalog-sampah.index');

        // Reward & klaim poin
        Route::get('rewards', [RewardController::class, 'index'])->name('rewards.index');
        Route::post('rewards/claim', [RewardController::class, 'store'])->name('rewards.claim');

        // Riwayat setoran
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    });

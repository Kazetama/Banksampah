<?php

use App\Http\Controllers\SuperAdmin\AuditLogController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:super_admin'])
    ->prefix('super-admin')
    ->name('super_admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit_logs.index');
    });

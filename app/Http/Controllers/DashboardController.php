<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Redirect the user to their role-specific dashboard.
     */
    public function index(): RedirectResponse
    {
        $role = Auth::user()?->role;

        return match ($role) {
            'super_admin' => redirect()->route('super_admin.dashboard'),
            'admin' => redirect()->route('admin.dashboard'),
            default => redirect()->route('nasabah.dashboard'),
        };
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class NasabahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::where('role', 'nasabah')->with('points');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $nasabahs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/nasabah/index', [
            'nasabahs' => $nasabahs,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Reset the citizen's password.
     */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'nasabah') {
            return redirect()->route('admin.nasabah.index')
                ->with('error', 'Unauthorized action.');
        }

        $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        AuditLogger::log('reset_nasabah_password', "Admin reset password for Nasabah user: {$user->name}");

        return redirect()->route('admin.nasabah.index')
            ->with('success', "Password for {$user->name} reset successfully.");
    }
}

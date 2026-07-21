<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreUserRequest;
use App\Http\Requests\SuperAdmin\UpdateUserRequest;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        // Paginate users and preserve query string parameters
        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('super_admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        // If user is a nasabah, create their points account
        if ($user->role === 'nasabah') {
            $user->points()->create([
                'total_points' => 0,
            ]);
        }

        AuditLogger::log('create_user', "Super Admin created a user account: {$user->name} ({$user->role})");

        return redirect()->route('super_admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        AuditLogger::log('update_user', "Super Admin updated user account: {$user->name} ({$user->role})");

        return redirect()->route('super_admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === Auth::id()) {
            return redirect()->route('super_admin.users.index')
                ->with('error', 'You cannot delete yourself.');
        }

        $name = $user->name;
        $role = $user->role;

        $user->delete();

        AuditLogger::log('delete_user', "Super Admin deleted user account: {$name} ({$role})");

        return redirect()->route('super_admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}

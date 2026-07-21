<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRewardRequest;
use App\Models\Reward;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Reward::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%");
        }

        $rewards = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/rewards/index', [
            'rewards' => $rewards,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRewardRequest $request): RedirectResponse
    {
        $reward = Reward::create($request->validated());

        AuditLogger::log('create_reward', "Admin created reward: {$reward->name}");

        return redirect()->route('admin.rewards.index')
            ->with('success', 'Reward created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRewardRequest $request, Reward $reward): RedirectResponse
    {
        $reward->update($request->validated());

        AuditLogger::log('update_reward', "Admin updated reward: {$reward->name}");

        return redirect()->route('admin.rewards.index')
            ->with('success', 'Reward updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reward $reward): RedirectResponse
    {
        $name = $reward->name;

        if ($reward->tukarPoins()->exists()) {
            return redirect()->route('admin.rewards.index')
                ->with('error', 'Cannot delete reward with active redemption history.');
        }

        $reward->delete();

        AuditLogger::log('delete_reward', "Admin deleted reward: {$name}");

        return redirect()->route('admin.rewards.index')
            ->with('success', 'Reward deleted successfully.');
    }
}

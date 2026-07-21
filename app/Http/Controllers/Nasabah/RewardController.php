<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Models\Point;
use App\Models\Reward;
use App\Models\TukarPoin;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    /**
     * Display available rewards.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load('points');

        $rewards = Reward::where('stock', '>', 0)->orderBy('name')->get();
        $totalPoints = $user->points?->total_points ?? 0;

        return Inertia::render('nasabah/rewards', [
            'rewards' => $rewards,
            'totalPoints' => $totalPoints,
        ]);
    }

    /**
     * Claim a reward using points.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'reward_id' => ['required', 'integer', 'exists:rewards,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        $reward = Reward::find($request->integer('reward_id'));
        if (! $reward instanceof Reward) {
            return redirect()->route('nasabah.rewards.index')
                ->with('error', 'Hadiah tidak ditemukan.');
        }

        $quantity = $request->integer('quantity');
        $totalCost = $reward->price * $quantity;

        // Check stock
        if ($reward->stock < $quantity) {
            return redirect()->route('nasabah.rewards.index')
                ->with('error', 'Stok hadiah tidak mencukupi.');
        }

        // Check points balance
        $pointModel = Point::firstOrCreate(
            ['user_id' => $user->id],
            ['total_points' => 0]
        );

        if ($pointModel->total_points < $totalCost) {
            return redirect()->route('nasabah.rewards.index')
                ->with('error', 'Saldo poin Anda tidak mencukupi untuk klaim hadiah ini.');
        }

        // Deduct points
        $pointModel->decrement('total_points', $totalCost);

        // Create redemption request
        TukarPoin::create([
            'user_id' => $user->id,
            'admin_id' => null,
            'reward_id' => $reward->id,
            'quantity' => $quantity,
            'total_price' => $totalCost,
            'status' => 'pending',
        ]);

        return redirect()->route('nasabah.rewards.index')
            ->with('success', "Berhasil mengajukan klaim {$quantity}x {$reward->name}. Menunggu persetujuan petugas.");
    }
}

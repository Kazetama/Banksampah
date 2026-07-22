<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the nasabah dashboard.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $totalIncome = Transaction::where('user_id', $user->id)->sum('total_income');
        $totalWeight = (float) Transaction::where('user_id', $user->id)->sum('total_weight');

        $recentTransactions = Transaction::with(['sampah.category', 'admin'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('nasabah/dashboard', [
            'stats' => [
                'total_income' => (int) $totalIncome,
                'total_weight' => round($totalWeight, 1),
            ],
            'recent_transactions' => $recentTransactions,
        ]);
    }
}

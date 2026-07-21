<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use App\Models\Transaction;
use App\Models\TukarPoin;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $today = Carbon::today();

        // Stats Cards Calculations
        $transactionsTodayCount = Transaction::whereDate('created_at', $today)->count();
        $weightToday = (float) Transaction::whereDate('created_at', $today)->sum('total_weight');
        $pendingRedemptions = TukarPoin::where('status', 'pending')->count();
        $totalNasabah = User::where('role', 'nasabah')->count();
        $lowStockRewards = Reward::where('stock', '<=', 5)->count();

        // Recent Transactions (latest 5)
        $recentTransactions = Transaction::with(['user', 'sampah'])
            ->latest()
            ->take(5)
            ->get();

        // Low Stock Rewards list
        $lowStockItems = Reward::where('stock', '<=', 5)
            ->orderBy('stock', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'transactions_today' => $transactionsTodayCount,
                'weight_today' => round($weightToday, 1),
                'pending_redemptions' => $pendingRedemptions,
                'total_nasabah' => $totalNasabah,
                'low_stock_rewards' => $lowStockRewards,
            ],
            'recent_transactions' => $recentTransactions,
            'low_stock_items' => $lowStockItems,
        ]);
    }
}

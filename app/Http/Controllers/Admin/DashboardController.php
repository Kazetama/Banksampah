<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
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
        $adminId = auth()->id();

        // Stats Cards Calculations scoped to current admin
        $transactionsTodayCount = Transaction::where('admin_id', $adminId)->whereDate('created_at', $today)->count();
        $weightToday = (float) Transaction::where('admin_id', $adminId)->whereDate('created_at', $today)->sum('total_weight');
        $incomeToday = (int) Transaction::where('admin_id', $adminId)->whereDate('created_at', $today)->sum('total_income');

        $totalWeightAll = (float) Transaction::where('admin_id', $adminId)->sum('total_weight');
        $totalIncomeAll = (int) Transaction::where('admin_id', $adminId)->sum('total_income');
        $totalNasabah = User::where('role', 'nasabah')->count();

        // Recent Transactions (latest 5) recorded by this admin
        $recentTransactions = Transaction::with(['user', 'sampah'])
            ->where('admin_id', $adminId)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'transactions_today' => $transactionsTodayCount,
                'weight_today' => round($weightToday, 1),
                'income_today' => $incomeToday,
                'total_weight_all' => round($totalWeightAll, 1),
                'total_income_all' => $totalIncomeAll,
                'total_nasabah' => $totalNasabah,
            ],
            'recent_transactions' => $recentTransactions,
        ]);
    }
}

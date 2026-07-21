<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TukarPoin;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the super admin dashboard.
     */
    public function index(): Response
    {
        $startDate = Carbon::now()->subMonths(5)->startOfMonth();

        // Fetch transactions and users for the last 6 months for trend calculations
        $transactions = Transaction::with('sampah.category')
            ->where('created_at', '>=', $startDate)
            ->get();

        $users = User::where('role', 'nasabah')
            ->where('created_at', '>=', $startDate)
            ->get();

        // 1. Stat Cards Calculations
        $totalNasabah = User::where('role', 'nasabah')->count();
        $totalWeight = Transaction::sum('total_weight');
        $totalCashOut = Transaction::sum('total_income');
        $totalPointsClaimed = TukarPoin::where('status', 'done')->sum('total_price');

        // Pre-fill months
        $monthlyWeightFormatted = [];
        $monthlyCashFormatted = [];
        $monthlyUsersFormatted = [];

        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[] = Carbon::now()->subMonths($i);
        }

        // Count users registered before the starting analysis date
        $cumulativeUsers = User::where('role', 'nasabah')
            ->where('created_at', '<', $startDate)
            ->count();

        foreach ($months as $month) {
            $monthStr = $month->format('Y-m');
            $monthName = $month->format('M');

            // Filter transactions and new users for this specific month in memory (DB agnostic)
            $monthTransactions = $transactions->filter(fn ($tx) => $tx->created_at->format('Y-m') === $monthStr);
            $monthUsers = $users->filter(fn ($u) => $u->created_at->format('Y-m') === $monthStr);

            $monthlyWeightFormatted[] = [
                'name' => $monthName,
                'weight' => round($monthTransactions->sum('total_weight'), 1),
            ];

            $monthlyCashFormatted[] = [
                'name' => $monthName,
                'amount' => (int) $monthTransactions->sum('total_income'),
            ];

            $cumulativeUsers += $monthUsers->count();
            $monthlyUsersFormatted[] = [
                'name' => $monthName,
                'users' => $cumulativeUsers,
            ];
        }

        // Category distribution (across all transactions)
        $allTransactions = Transaction::with('sampah.category')->get();
        $categoryData = [];
        $groupedByCategory = $allTransactions->groupBy(fn (\App\Models\Transaction $tx): string => $tx->sampah->category->name ?? 'Lainnya');

        foreach ($groupedByCategory as $catName => $txs) {
            $categoryData[] = [
                'name' => $catName,
                'value' => round((float) $txs->sum('total_weight'), 1),
            ];
        }

        return Inertia::render('super_admin/dashboard', [
            'stats' => [
                'total_nasabah' => $totalNasabah,
                'total_weight' => round((float) $totalWeight, 1),
                'total_cash_out' => $totalCashOut,
                'total_points_claimed' => $totalPointsClaimed,
            ],
            'charts' => [
                'weight_trend' => $monthlyWeightFormatted,
                'cashflow' => $monthlyCashFormatted,
                'user_growth' => $monthlyUsersFormatted,
                'category_distribution' => $categoryData,
            ],
        ]);
    }
}

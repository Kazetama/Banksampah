<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransactionRequest;
use App\Models\Point;
use App\Models\Sampah;
use App\Models\Transaction;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $nasabahs = User::where('role', 'nasabah')->get();
        $sampahItems = Sampah::with('category')->get();

        $query = Transaction::with(['user', 'admin', 'sampah.category']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'nasabahs' => $nasabahs,
            'sampahItems' => $sampahItems,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $sampah = Sampah::find($validated['sampah_id']);
        if (! $sampah instanceof Sampah) {
            return redirect()->route('admin.transactions.index')
                ->with('error', 'Waste item not found.');
        }

        $weight = (float) $validated['total_weight'];
        $income = (int) ($weight * $sampah->price_per_kg);

        // 1 point for every 1000 Rp in transaction income
        $points = (int) ($income / 1000);

        $transaction = Transaction::create([
            'user_id' => $validated['user_id'],
            'admin_id' => auth()->id(),
            'sampah_id' => $validated['sampah_id'],
            'total_weight' => $weight,
            'total_income' => $income,
            'point_received' => $points,
        ]);

        $pointModel = Point::firstOrCreate(
            ['user_id' => $validated['user_id']],
            ['total_points' => 0]
        );
        $pointModel->increment('total_points', $points);

        $nasabah = User::find($validated['user_id']);
        if (! $nasabah instanceof User) {
            return redirect()->route('admin.transactions.index')
                ->with('error', 'Citizen not found.');
        }

        AuditLogger::log('create_transaction', "Admin recorded waste deposit transaction for Nasabah: {$nasabah->name} ({$weight} kg of {$sampah->name}, +{$points} points)");

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Deposit transaction recorded successfully. Points updated!');
    }
}

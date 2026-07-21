<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display the citizen's own transaction history.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $query = Transaction::with(['sampah.category', 'admin'])
            ->where('user_id', $user->id);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('sampah', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('nasabah/transactions', [
            'transactions' => $transactions,
            'filters' => $request->only(['search']),
        ]);
    }
}

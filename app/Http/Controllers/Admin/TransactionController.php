<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransactionRequest;
use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Models\Transaction;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource with rekap stats.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = auth()->user();
        $nasabahs = User::where('role', 'nasabah')->get();
        $sampahItems = Sampah::with('category')->get();

        $query = Transaction::with(['user', 'admin', 'sampah.category']);
        $rekapQuery = Transaction::query();

        // Admin RT only sees their own recorded transactions, Super Admin sees all transactions
        if ($user->role !== 'super_admin') {
            $query->where('admin_id', $user->id);
            $rekapQuery->where('admin_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Calculate Rekap Stats
        $rekap = [
            'total_transactions' => $rekapQuery->count(),
            'total_weight' => round((float) $rekapQuery->sum('total_weight'), 1),
            'total_income' => (int) $rekapQuery->sum('total_income'),
        ];

        $transactions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'nasabahs' => $nasabahs,
            'sampahItems' => $sampahItems,
            'rekap' => $rekap,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage with custom pricing per collector.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $userId = $validated['user_id'];
        $nasabah = User::find($userId);

        if (! $nasabah instanceof User) {
            return redirect()->route('admin.transactions.index')
                ->with('error', 'Nasabah tidak ditemukan.');
        }

        $namesList = [];
        if ($request->filled('sampah_names') && is_array($request->input('sampah_names'))) {
            foreach ($request->input('sampah_names') as $n) {
                $trimmed = trim($n);
                if ($trimmed !== '') {
                    $namesList[] = $trimmed;
                }
            }
        }

        if (empty($namesList) && ! empty($validated['sampah_name'])) {
            $namesList[] = trim($validated['sampah_name']);
        }

        if (empty($namesList)) {
            return redirect()->back()->withErrors([
                'sampah_names' => 'Minimal 1 kolom Jenis Sampah harus diisi.',
            ]);
        }

        $sampahNameString = implode(', ', $namesList);
        $weight = (float) $validated['total_weight'];
        $pricePerKg = (float) $validated['custom_price_per_kg'];
        $income = (int) round($weight * $pricePerKg);

        $category = SampahCategory::first() ?? SampahCategory::create(['name' => 'Umum']);

        $sampah = Sampah::firstOrCreate(
            ['name' => $sampahNameString],
            [
                'category_id' => $category->id,
                'price_per_kg' => $pricePerKg,
            ]
        );

        Transaction::create([
            'user_id' => $userId,
            'admin_id' => auth()->id(),
            'sampah_id' => $sampah->id,
            'total_weight' => $weight,
            'total_income' => $income,
            'point_received' => 0,
        ]);

        AuditLogger::log('create_transaction', "Admin mencatat setoran sampah ({$sampahNameString}) untuk Nasabah: {$nasabah->name} ({$weight} kg @ Rp ".number_format($pricePerKg, 0, ',', '.').'/kg, Total: Rp '.number_format($income, 0, ',', '.').')');

        return redirect()->route('admin.transactions.index')
            ->with('success', "Pencatatan setoran sampah ({$sampahNameString}) untuk {$nasabah->name} sebesar Rp ".number_format($income, 0, ',', '.').' berhasil disimpan!');
    }

    /**
     * Export admin transaction rekap to CSV / Excel format.
     */
    public function export(): StreamedResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $query = Transaction::with(['user', 'sampah']);

        if ($user->role !== 'super_admin') {
            $query->where('admin_id', $user->id);
        }

        $transactions = $query->latest()->get();

        $filename = 'rekap-setoran-sampah-'.now()->format('Y-m-d_H-i').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Microsoft Excel compatibility
            fwrite($file, "\xEF\xBB\xBF");

            // Header row
            fputcsv($file, [
                'ID Transaksi',
                'Tanggal Setor',
                'Nama Warga (Nasabah)',
                'Jenis Sampah',
                'Berat (KG)',
                'Harga per KG (Rp)',
                'Total Uang Diterima (Rp)',
            ]);

            foreach ($transactions as $tx) {
                $pricePerKg = $tx->total_weight > 0 ? round($tx->total_income / $tx->total_weight) : 0;
                fputcsv($file, [
                    $tx->id,
                    $tx->created_at->format('Y-m-d H:i:s'),
                    $tx->user?->name ?? '-',
                    $tx->sampah?->name ?? 'Sampah',
                    $tx->total_weight,
                    $pricePerKg,
                    $tx->total_income,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

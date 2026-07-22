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
        $adminId = auth()->id();
        $nasabahs = User::where('role', 'nasabah')->get();
        $sampahItems = Sampah::with('category')->get();

        $query = Transaction::with(['user', 'admin', 'sampah.category'])
            ->where('admin_id', $adminId);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Calculate Rekap Stats for this Admin
        $rekapQuery = Transaction::where('admin_id', $adminId);
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

        $sampahName = trim($validated['sampah_name']);
        $weight = (float) $validated['total_weight'];
        $pricePerKg = (float) $validated['custom_price_per_kg'];
        $income = (int) round($weight * $pricePerKg);

        $category = SampahCategory::first() ?? SampahCategory::create(['name' => 'Umum']);

        $sampah = Sampah::firstOrCreate(
            ['name' => $sampahName],
            [
                'category_id' => $category->id,
                'price_per_kg' => $pricePerKg,
            ]
        );

        $transaction = Transaction::create([
            'user_id' => $validated['user_id'],
            'admin_id' => auth()->id(),
            'sampah_id' => $sampah->id,
            'total_weight' => $weight,
            'total_income' => $income,
            'point_received' => 0,
        ]);

        $nasabah = User::find($validated['user_id']);
        if (! $nasabah instanceof User) {
            return redirect()->route('admin.transactions.index')
                ->with('error', 'Nasabah tidak ditemukan.');
        }

        AuditLogger::log('create_transaction', "Admin mencatat transaksi setoran sampah untuk Nasabah: {$nasabah->name} ({$weight} kg {$sampah->name} @ Rp ".number_format($pricePerKg, 0, ',', '.').'/kg, Total: Rp '.number_format($income, 0, ',', '.').')');

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaksi pencatatan setoran sampah berhasil disimpan!');
    }

    /**
     * Export admin transaction rekap to CSV / Excel format.
     */
    public function export(): StreamedResponse
    {
        $adminId = auth()->id();
        $transactions = Transaction::with(['user', 'sampah'])
            ->where('admin_id', $adminId)
            ->latest()
            ->get();

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

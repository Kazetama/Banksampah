<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use App\Models\TukarPoin;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TukarPoinController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = TukarPoin::with(['user', 'admin', 'reward']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })->orWhereHas('reward', function ($rq) use ($search) {
                    $rq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $redemptions = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/redemptions/index', [
            'redemptions' => $redemptions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Update the status of the redemption.
     */
    public function updateStatus(Request $request, TukarPoin $tukarPoin): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:pending,process,done,rejected'],
        ]);

        $newStatus = $request->input('status');
        $oldStatus = $tukarPoin->status;

        if ($oldStatus === $newStatus) {
            return redirect()->route('admin.redemptions.index');
        }

        if (in_array($oldStatus, ['done', 'rejected'])) {
            return redirect()->route('admin.redemptions.index')
                ->with('error', 'Cannot modify a finalized redemption request.');
        }

        if ($newStatus === 'done') {
            $reward = $tukarPoin->reward;

            if ($reward->stock < $tukarPoin->quantity) {
                return redirect()->route('admin.redemptions.index')
                    ->with('error', 'Insufficient stock for this reward.');
            }

            $reward->decrement('stock', $tukarPoin->quantity);

            $tukarPoin->update([
                'status' => 'done',
                'admin_id' => auth()->id(),
            ]);

            AuditLogger::log('approve_redemption', "Admin approved point redemption request (ID: {$tukarPoin->id}) for {$tukarPoin->user->name} (1x {$reward->name})");
        } elseif ($newStatus === 'rejected') {
            $pointModel = Point::firstOrCreate(
                ['user_id' => $tukarPoin->user_id],
                ['total_points' => 0]
            );
            $pointModel->increment('total_points', $tukarPoin->total_price);

            $tukarPoin->update([
                'status' => 'rejected',
                'admin_id' => auth()->id(),
            ]);

            AuditLogger::log('reject_redemption', "Admin rejected point redemption request (ID: {$tukarPoin->id}) for {$tukarPoin->user->name}");
        } else {
            $tukarPoin->update([
                'status' => $newStatus,
                'admin_id' => auth()->id(),
            ]);

            AuditLogger::log('process_redemption', "Admin updated point redemption status to: {$newStatus} (ID: {$tukarPoin->id})");
        }

        return redirect()->route('admin.redemptions.index')
            ->with('success', 'Redemption status updated successfully.');
    }
}

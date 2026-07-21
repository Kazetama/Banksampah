<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSampahRequest;
use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SampahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $categories = SampahCategory::all();
        $query = Sampah::with('category');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $sampah = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/sampah/index', [
            'sampah' => $sampah,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSampahRequest $request): RedirectResponse
    {
        $sampah = Sampah::create($request->validated());

        AuditLogger::log('create_sampah', "Admin created waste item: {$sampah->name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Waste item created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreSampahRequest $request, Sampah $sampah): RedirectResponse
    {
        $sampah->update($request->validated());

        AuditLogger::log('update_sampah', "Admin updated waste item: {$sampah->name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Waste item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sampah $sampah): RedirectResponse
    {
        $name = $sampah->name;

        if ($sampah->transactions()->exists()) {
            return redirect()->route('admin.sampah.index')
                ->with('error', 'Cannot delete waste item that has transaction history.');
        }

        $sampah->delete();

        AuditLogger::log('delete_sampah', "Admin deleted waste item: {$name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Waste item deleted successfully.');
    }
}

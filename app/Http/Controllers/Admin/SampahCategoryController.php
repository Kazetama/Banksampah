<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SampahCategory;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SampahCategoryController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sampah_categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        $category = SampahCategory::create($validated);

        AuditLogger::log('create_sampah_category', "Admin created waste category: {$category->name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SampahCategory $sampahCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sampah_categories,name,'.$sampahCategory->id],
            'description' => ['nullable', 'string'],
        ]);

        $sampahCategory->update($validated);

        AuditLogger::log('update_sampah_category', "Admin updated waste category: {$sampahCategory->name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SampahCategory $sampahCategory): RedirectResponse
    {
        $name = $sampahCategory->name;

        if ($sampahCategory->sampah()->exists()) {
            return redirect()->route('admin.sampah.index')
                ->with('error', 'Cannot delete category that contains waste items.');
        }

        $sampahCategory->delete();

        AuditLogger::log('delete_sampah_category', "Admin deleted waste category: {$name}");

        return redirect()->route('admin.sampah.index')
            ->with('success', 'Category deleted successfully.');
    }
}

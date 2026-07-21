<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Models\Sampah;
use App\Models\SampahCategory;
use Inertia\Inertia;
use Inertia\Response;

class KatalogSampahController extends Controller
{
    /**
     * Display the waste catalogue for citizens.
     */
    public function index(): Response
    {
        $categories = SampahCategory::orderBy('name')->get();
        $sampahItems = Sampah::with('category')->orderBy('name')->get();

        return Inertia::render('nasabah/katalog-sampah', [
            'categories' => $categories,
            'sampahItems' => $sampahItems,
        ]);
    }
}

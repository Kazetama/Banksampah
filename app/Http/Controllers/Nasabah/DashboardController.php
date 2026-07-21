<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the nasabah dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('nasabah/dashboard');
    }
}

<?php

use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Models\Transaction;
use App\Models\User;

test('nasabah users are blocked from admin routes', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);

    $this->actingAs($citizen);

    $this->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin users are blocked from nasabah routes', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin);

    $this->get(route('nasabah.dashboard'))
        ->assertForbidden();
});

test('nasabah can visit the dashboard', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);

    $this->actingAs($citizen);

    $this->get(route('nasabah.dashboard'))
        ->assertOk();
});

test('nasabah dashboard shows correct stats', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $admin = User::factory()->create(['role' => 'admin']);
    $category = SampahCategory::factory()->create();
    $sampah = Sampah::factory()->create(['category_id' => $category->id, 'price_per_kg' => 2000]);

    Transaction::create([
        'user_id' => $citizen->id,
        'admin_id' => $admin->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 5.0,
        'total_income' => 10000,
        'point_received' => 10,
    ]);

    $this->actingAs($citizen);

    $response = $this->get(route('nasabah.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('nasabah/dashboard')
        ->where('stats.total_income', 10000)
        ->where('stats.total_weight', 5)
    );
});

test('nasabah can view own transaction history', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $otherCitizen = User::factory()->create(['role' => 'nasabah']);
    $admin = User::factory()->create(['role' => 'admin']);
    $category = SampahCategory::factory()->create();
    $sampah = Sampah::factory()->create(['category_id' => $category->id]);

    // Transaction belonging to this citizen
    Transaction::create([
        'user_id' => $citizen->id,
        'admin_id' => $admin->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 3.0,
        'total_income' => 6000,
        'point_received' => 6,
    ]);

    // Transaction belonging to another citizen (should NOT appear)
    Transaction::create([
        'user_id' => $otherCitizen->id,
        'admin_id' => $admin->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 1.0,
        'total_income' => 2000,
        'point_received' => 2,
    ]);

    $this->actingAs($citizen);

    $response = $this->get(route('nasabah.transactions.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('nasabah/transactions')
        ->where('transactions.total', 1)
    );
});

<?php

use App\Models\Point;
use App\Models\Reward;
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

    Point::create(['user_id' => $citizen->id, 'total_points' => 80]);

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
        ->where('stats.total_points', 80)
        ->where('stats.total_income', 10000)
        ->where('stats.total_weight', 5)
    );
});

test('nasabah can view katalog sampah', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $category = SampahCategory::factory()->create();
    Sampah::factory()->create(['category_id' => $category->id]);

    $this->actingAs($citizen);

    $this->get(route('nasabah.katalog-sampah.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('nasabah/katalog-sampah'));
});

test('nasabah can view rewards catalogue', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    Point::create(['user_id' => $citizen->id, 'total_points' => 500]);
    Reward::factory()->create(['stock' => 10, 'price' => 100]);

    $this->actingAs($citizen);

    $this->get(route('nasabah.rewards.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('nasabah/rewards'));
});

test('nasabah can claim a reward and points are deducted', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    Point::create(['user_id' => $citizen->id, 'total_points' => 500]);
    $reward = Reward::factory()->create(['stock' => 5, 'price' => 200]);

    $this->actingAs($citizen);

    $this->post(route('nasabah.rewards.claim'), [
        'reward_id' => $reward->id,
        'quantity' => 2,
    ])->assertRedirect(route('nasabah.rewards.index'));

    $this->assertDatabaseHas('points', [
        'user_id' => $citizen->id,
        'total_points' => 100, // 500 - (200 * 2)
    ]);

    $this->assertDatabaseHas('tukar_poins', [
        'user_id' => $citizen->id,
        'reward_id' => $reward->id,
        'quantity' => 2,
        'total_price' => 400,
        'status' => 'pending',
    ]);
});

test('nasabah cannot claim a reward with insufficient points', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    Point::create(['user_id' => $citizen->id, 'total_points' => 50]);
    $reward = Reward::factory()->create(['stock' => 5, 'price' => 200]);

    $this->actingAs($citizen);

    $this->post(route('nasabah.rewards.claim'), [
        'reward_id' => $reward->id,
        'quantity' => 1,
    ])->assertRedirect(route('nasabah.rewards.index'))
        ->assertSessionHas('error');

    // Points should not change
    $this->assertDatabaseHas('points', [
        'user_id' => $citizen->id,
        'total_points' => 50,
    ]);
});

test('nasabah cannot claim a reward with insufficient stock', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);
    Point::create(['user_id' => $citizen->id, 'total_points' => 5000]);
    $reward = Reward::factory()->create(['stock' => 1, 'price' => 100]);

    $this->actingAs($citizen);

    $this->post(route('nasabah.rewards.claim'), [
        'reward_id' => $reward->id,
        'quantity' => 5,
    ])->assertRedirect(route('nasabah.rewards.index'))
        ->assertSessionHas('error');
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

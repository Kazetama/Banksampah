<?php

use App\Models\Point;
use App\Models\Reward;
use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Models\TukarPoin;
use App\Models\User;

test('non-admin users are blocked from admin routes', function () {
    $citizen = User::factory()->create(['role' => 'nasabah']);

    $this->actingAs($citizen);

    $this->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin users can visit the admin dashboard', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);

    $this->actingAs($adminUser);

    $this->get(route('admin.dashboard'))
        ->assertOk();
});

test('admin can record a waste deposit transaction which credits points to citizen', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $category = SampahCategory::create(['name' => 'Plastik']);
    $sampah = Sampah::create([
        'category_id' => $category->id,
        'name' => 'Botol PET',
        'price_per_kg' => 3000,
    ]);

    $this->actingAs($adminUser);

    $this->post(route('admin.transactions.store'), [
        'user_id' => $citizen->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 5.0,
    ])->assertRedirect(route('admin.transactions.index'));

    $this->assertDatabaseHas('transactions', [
        'user_id' => $citizen->id,
        'admin_id' => $adminUser->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 5.0,
        'total_income' => 15000,
        'point_received' => 15,
    ]);

    $this->assertDatabaseHas('points', [
        'user_id' => $citizen->id,
        'total_points' => 15,
    ]);
});

test('admin can approve a pending point redemption request which decrements stock', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $reward = Reward::create([
        'name' => 'Minyak Goreng',
        'category' => 'Sembako',
        'price' => 50,
        'stock' => 10,
    ]);

    $redemption = TukarPoin::create([
        'user_id' => $citizen->id,
        'reward_id' => $reward->id,
        'quantity' => 2,
        'total_price' => 100,
        'status' => 'pending',
    ]);

    $this->actingAs($adminUser);

    $this->patch(route('admin.redemptions.update-status', $redemption->id), [
        'status' => 'done',
    ])->assertRedirect(route('admin.redemptions.index'));

    expect($redemption->fresh()->status)->toBe('done');
    expect($redemption->fresh()->admin_id)->toBe($adminUser->id);
    expect($reward->fresh()->stock)->toBe(8);
});

test('admin can reject a pending point redemption request which refunds the points', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $reward = Reward::create([
        'name' => 'Minyak Goreng',
        'category' => 'Sembako',
        'price' => 50,
        'stock' => 10,
    ]);

    $pointModel = Point::create([
        'user_id' => $citizen->id,
        'total_points' => 150,
    ]);

    $redemption = TukarPoin::create([
        'user_id' => $citizen->id,
        'reward_id' => $reward->id,
        'quantity' => 2,
        'total_price' => 100,
        'status' => 'pending',
    ]);

    $this->actingAs($adminUser);

    $this->patch(route('admin.redemptions.update-status', $redemption->id), [
        'status' => 'rejected',
    ])->assertRedirect(route('admin.redemptions.index'));

    expect($redemption->fresh()->status)->toBe('rejected');
    expect($redemption->fresh()->admin_id)->toBe($adminUser->id);
    expect($reward->fresh()->stock)->toBe(10);
    expect($citizen->points->fresh()->total_points)->toBe(250);
});

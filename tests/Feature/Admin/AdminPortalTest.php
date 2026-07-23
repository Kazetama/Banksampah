<?php

use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Models\Transaction;
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

test('admin can record a waste deposit transaction with custom manual waste name and price per kg', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);

    $this->actingAs($adminUser);

    $this->post(route('admin.transactions.store'), [
        'user_id' => $citizen->id,
        'sampah_name' => 'Kardus Bekas Bebas',
        'total_weight' => 5.0,
        'custom_price_per_kg' => 4000,
    ])->assertRedirect(route('admin.transactions.index'));

    $this->assertDatabaseHas('transactions', [
        'user_id' => $citizen->id,
        'admin_id' => $adminUser->id,
        'total_weight' => 5.0,
        'total_income' => 20000, // 5.0 * 4000
    ]);
});

test('admin can export transaction rekap to csv excel file', function () {
    $adminUser = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $category = SampahCategory::create(['name' => 'Kertas']);
    $sampah = Sampah::create([
        'category_id' => $category->id,
        'name' => 'Kardus Bekas',
        'price_per_kg' => 1500,
    ]);

    Transaction::create([
        'user_id' => $citizen->id,
        'admin_id' => $adminUser->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 10.0,
        'total_income' => 15000,
        'point_received' => 0,
    ]);

    $this->actingAs($adminUser);

    $response = $this->get(route('admin.transactions.export'));
    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

test('admin only sees transactions recorded by themselves', function () {
    $admin1 = User::factory()->create(['role' => 'admin']);
    $admin2 = User::factory()->create(['role' => 'admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);
    $category = SampahCategory::create(['name' => 'Plastik']);
    $sampah = Sampah::create([
        'category_id' => $category->id,
        'name' => 'Botol PET',
        'price_per_kg' => 3000,
    ]);

    $tx1 = Transaction::create([
        'user_id' => $citizen->id,
        'admin_id' => $admin1->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 5.0,
        'total_income' => 15000,
        'point_received' => 0,
    ]);

    $tx2 = Transaction::create([
        'user_id' => $citizen->id,
        'admin_id' => $admin2->id,
        'sampah_id' => $sampah->id,
        'total_weight' => 10.0,
        'total_income' => 30000,
        'point_received' => 0,
    ]);

    $this->actingAs($admin1);
    $response = $this->get(route('admin.transactions.index'));
    $response->assertOk();
    $transactions = $response->inertiaProps('transactions.data');
    expect(count($transactions))->toBe(1);
    expect($transactions[0]['id'])->toBe($tx1->id);
});

test('super admin can also access and record waste deposit transactions', function () {
    $superAdmin = User::factory()->create(['role' => 'super_admin']);
    $citizen = User::factory()->create(['role' => 'nasabah']);

    $this->actingAs($superAdmin);

    $this->get(route('admin.transactions.index'))
        ->assertOk();

    $this->post(route('admin.transactions.store'), [
        'user_id' => $citizen->id,
        'sampah_name' => 'Kertas Koran',
        'total_weight' => 2.0,
        'custom_price_per_kg' => 3000,
    ])->assertRedirect(route('admin.transactions.index'));

    $this->assertDatabaseHas('transactions', [
        'user_id' => $citizen->id,
        'admin_id' => $superAdmin->id,
        'total_weight' => 2.0,
        'total_income' => 6000,
    ]);
});

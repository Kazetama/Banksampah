<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'name' => 'Super Admin User',
            'email' => 'super_admin@example.com',
            'role' => 'super_admin',
        ]);

        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Nasabah (default)
        User::factory()->create([
            'name' => 'Nasabah User',
            'email' => 'test@example.com',
            'role' => 'nasabah',
        ]);
    }
}

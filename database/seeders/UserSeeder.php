<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the user seeds.
     */
    public function run(): void
    {
        // 1. Super Admin Account
        User::factory()->create([
            'name' => 'Super Admin KKN',
            'email' => 'super_admin@example.com',
            'role' => 'super_admin',
            'password' => Hash::make('password'),
            'phone_number' => '081100001111',
            'address' => 'Posko Utama KKN Aktivis Doko',
        ]);

        // 2. Admin (Pengepul / Petugas POS Bank Sampah) Accounts
        User::factory()->create([
            'name' => 'Petugas POS Doko (Pengepul Utama)',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'phone_number' => '081234567890',
            'address' => 'Pos Penimbangan Dusun Doko RT 01 / RW 02',
        ]);

        User::factory()->create([
            'name' => 'Petugas POS Sukomulyo',
            'email' => 'admin2@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'phone_number' => '081987654321',
            'address' => 'Pos Penimbangan Dusun Sukomulyo RT 03 / RW 01',
        ]);

        // 3. Nasabah (Warga Desa) Accounts
        $nasabahsData = [
            [
                'name' => 'Nasabah User (Demo)',
                'email' => 'test@example.com',
                'phone' => '081234567890',
                'address' => 'Dusun Doko RT 01 / RW 02, Desa Doko',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'phone' => '081298765432',
                'address' => 'Dusun Doko RT 01 / RW 02, Desa Doko',
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti@example.com',
                'phone' => '085712345678',
                'address' => 'Dusun Doko RT 03 / RW 02, Desa Doko',
            ],
            [
                'name' => 'Eko Prasetyo',
                'email' => 'eko@example.com',
                'phone' => '081388776655',
                'address' => 'Dusun Sukomulyo RT 02 / RW 01, Desa Doko',
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@example.com',
                'phone' => '081544332211',
                'address' => 'Dusun Sukomulyo RT 04 / RW 03, Desa Doko',
            ],
            [
                'name' => 'Rahmat Hidayat',
                'email' => 'rahmat@example.com',
                'phone' => '087811223344',
                'address' => 'Dusun Krajan RT 01 / RW 03, Desa Doko',
            ],
            [
                'name' => 'Tri Wahyuni',
                'email' => 'tri@example.com',
                'phone' => '082199887766',
                'address' => 'Dusun Krajan RT 02 / RW 04, Desa Doko',
            ],
            [
                'name' => 'Ahmad Dahlan',
                'email' => 'ahmad@example.com',
                'phone' => '085677889900',
                'address' => 'Dusun Krajan RT 05 / RW 04, Desa Doko',
            ],
        ];

        foreach ($nasabahsData as $nd) {
            User::factory()->create([
                'name' => $nd['name'],
                'email' => $nd['email'],
                'role' => 'nasabah',
                'password' => Hash::make('password'),
                'address' => $nd['address'],
                'phone_number' => $nd['phone'],
            ]);
        }
    }
}

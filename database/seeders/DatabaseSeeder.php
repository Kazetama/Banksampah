<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with modular seeders.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SampahCategorySeeder::class,
            SampahSeeder::class,
            TransactionSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}

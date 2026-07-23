<?php

namespace Database\Seeders;

use App\Models\SampahCategory;
use Illuminate\Database\Seeder;

class SampahCategorySeeder extends Seeder
{
    /**
     * Run the category seeds.
     */
    public function run(): void
    {
        $categories = [
            'Plastik' => 'Kategori limbah plastik bersih seperti botol, gelas, dan wadah plastik.',
            'Kertas' => 'Kategori koran, kardus bekas, majalah, HVS, dan kertas bekas.',
            'Logam' => 'Kategori besi tua, aluminium kaleng, tembaga, dan kuningan.',
            'Kaca' => 'Kategori botol kaca, sirup, kecap, dan botol selai bersih.',
        ];

        foreach ($categories as $name => $desc) {
            SampahCategory::firstOrCreate(
                ['name' => $name],
                ['description' => $desc]
            );
        }
    }
}

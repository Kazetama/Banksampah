<?php

namespace Database\Seeders;

use App\Models\Sampah;
use App\Models\SampahCategory;
use Illuminate\Database\Seeder;

class SampahSeeder extends Seeder
{
    /**
     * Run the sampah seeds.
     */
    public function run(): void
    {
        $sampahItems = [
            [
                'category' => 'Plastik',
                'name' => 'Botol Plastik PET Bersih',
                'price' => 3000,
            ],
            [
                'category' => 'Plastik',
                'name' => 'Gelas Plastik Bersih',
                'price' => 2500,
            ],
            [
                'category' => 'Plastik',
                'name' => 'Plastik Campur / Bodong',
                'price' => 1500,
            ],
            [
                'category' => 'Kertas',
                'name' => 'Kardus Bekas Cokelat',
                'price' => 2000,
            ],
            [
                'category' => 'Kertas',
                'name' => 'Koran / HVS Bekas',
                'price' => 2500,
            ],
            [
                'category' => 'Logam',
                'name' => 'Kaleng Aluminium Minuman',
                'price' => 10000,
            ],
            [
                'category' => 'Logam',
                'name' => 'Besi Tua / Scrap',
                'price' => 4500,
            ],
            [
                'category' => 'Kaca',
                'name' => 'Botol Kaca Kecap / Sirup',
                'price' => 1200,
            ],
        ];

        foreach ($sampahItems as $item) {
            $cat = SampahCategory::where('name', $item['category'])->first();
            if ($cat) {
                Sampah::firstOrCreate(
                    ['name' => $item['name']],
                    [
                        'category_id' => $cat->id,
                        'price_per_kg' => $item['price'],
                    ]
                );
            }
        }
    }
}

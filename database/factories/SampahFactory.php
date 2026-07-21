<?php

namespace Database\Factories;

use App\Models\Sampah;
use App\Models\SampahCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sampah>
 */
class SampahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => SampahCategory::factory(),
            'name' => fake()->unique()->words(2, true),
            'image' => null,
            'price_per_kg' => fake()->numberBetween(1000, 10000),
        ];
    }
}

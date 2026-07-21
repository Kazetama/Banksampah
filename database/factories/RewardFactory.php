<?php

namespace Database\Factories;

use App\Models\Reward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reward>
 */
class RewardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(['Sembako', 'Elektronik', 'Voucher', 'Lainnya']),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(50, 1000),
            'image' => null,
            'stock' => fake()->numberBetween(1, 50),
        ];
    }
}

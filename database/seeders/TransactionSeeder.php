<?php

namespace Database\Seeders;

use App\Models\Sampah;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the transaction seeds.
     */
    public function run(): void
    {
        $admins = User::where('role', 'admin')->get();
        $nasabahs = User::where('role', 'nasabah')->get();
        $sampahModels = Sampah::all();

        if ($admins->isEmpty() || $nasabahs->isEmpty() || $sampahModels->isEmpty()) {
            return;
        }

        $startDate = Carbon::now()->subDays(30)->startOfDay();
        $today = Carbon::now();

        while ($startDate->lessThanOrEqualTo($today)) {
            // Random 1-3 transactions per day
            $dailyTx = rand(1, 3);
            for ($i = 0; $i < $dailyTx; $i++) {
                $targetAdmin = $admins->random();
                $targetNasabah = $nasabahs->random();
                $targetSampah = $sampahModels->random();

                $weight = round(rand(2, 25) + (rand(0, 9) / 10), 1); // 2.0 to 25.9 kg
                $customPricePerKg = $targetSampah->price_per_kg + rand(-200, 300);
                if ($customPricePerKg <= 0) {
                    $customPricePerKg = $targetSampah->price_per_kg;
                }

                $income = (int) round($weight * $customPricePerKg);

                // Set exact time between 08:00 and 17:59 on the target day
                $txDate = $startDate->copy()->setTime(rand(8, 17), rand(0, 59));

                // Strict check: Never set a timestamp in the future
                if ($txDate->greaterThan($today)) {
                    $txDate = $today->copy()->subMinutes(rand(5, 60));
                }

                Transaction::create([
                    'user_id' => $targetNasabah->id,
                    'admin_id' => $targetAdmin->id,
                    'sampah_id' => $targetSampah->id,
                    'total_weight' => $weight,
                    'total_income' => $income,
                    'point_received' => 0,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ]);
            }

            $startDate->addDay();
        }
    }
}

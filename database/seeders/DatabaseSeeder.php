<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Point;
use App\Models\Reward;
use App\Models\Sampah;
use App\Models\SampahCategory;
use App\Models\Transaction;
use App\Models\TukarPoin;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin User',
            'email' => 'super_admin@example.com',
            'role' => 'super_admin',
            'password' => Hash::make('password'),
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        $nasabahs = [];
        $nasabahs[] = User::factory()->create([
            'name' => 'Nasabah User',
            'email' => 'test@example.com',
            'role' => 'nasabah',
            'password' => Hash::make('password'),
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'phone_number' => '081234567890',
        ]);

        $nasabahs[] = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'role' => 'nasabah',
            'password' => Hash::make('password'),
            'address' => 'Jl. Mawar No. 5, Bandung',
            'phone_number' => '082198765432',
        ]);

        $nasabahs[] = User::factory()->create([
            'name' => 'Siti Aminah',
            'email' => 'siti@example.com',
            'role' => 'nasabah',
            'password' => Hash::make('password'),
            'address' => 'Jl. Melati No. 12, Surabaya',
            'phone_number' => '083812345678',
        ]);

        // 2. Seed Sampah Categories
        $categories = [
            'Plastik' => 'Kategori untuk segala jenis limbah plastik bersih.',
            'Kertas' => 'Kategori untuk koran, kardus, majalah, dan kertas kantor.',
            'Logam' => 'Kategori untuk besi, kuningan, tembaga, dan aluminium.',
            'Kaca' => 'Kategori untuk botol kaca, stoples, dan pecahan kaca bersih.',
        ];

        $categoryModels = [];
        foreach ($categories as $name => $desc) {
            $categoryModels[$name] = SampahCategory::create([
                'name' => $name,
                'description' => $desc,
            ]);
        }

        // 3. Seed Sampah Items
        $sampahItems = [
            [
                'category' => 'Plastik',
                'name' => 'Botol Plastik PET',
                'price' => 2000,
            ],
            [
                'category' => 'Plastik',
                'name' => 'Gelas Plastik Bersih',
                'price' => 1500,
            ],
            [
                'category' => 'Kertas',
                'name' => 'Kardus Bekas Cokelat',
                'price' => 3000,
            ],
            [
                'category' => 'Kertas',
                'name' => 'Koran Bekas',
                'price' => 2000,
            ],
            [
                'category' => 'Logam',
                'name' => 'Kaleng Aluminium Minuman',
                'price' => 9000,
            ],
            [
                'category' => 'Logam',
                'name' => 'Besi Tua / Scrap',
                'price' => 4500,
            ],
            [
                'category' => 'Kaca',
                'name' => 'Botol Kaca Sirup/Kecap',
                'price' => 1200,
            ],
        ];

        $sampahModels = [];
        foreach ($sampahItems as $item) {
            $sampahModels[] = Sampah::create([
                'category_id' => $categoryModels[$item['category']]->id,
                'name' => $item['name'],
                'price_per_kg' => $item['price'],
            ]);
        }

        // 4. Seed Rewards
        $rewards = [
            [
                'name' => 'Beras Premium 5kg',
                'category' => 'Sembako',
                'desc' => 'Beras kualitas super kemasan 5kg.',
                'price' => 100, // in points
                'stock' => 25,
            ],
            [
                'name' => 'Minyak Goreng 1L',
                'category' => 'Sembako',
                'desc' => 'Minyak goreng kelapa sawit kemasan botol 1 Liter.',
                'price' => 40,
                'stock' => 40,
            ],
            [
                'name' => 'Gula Pasir 1kg',
                'category' => 'Sembako',
                'desc' => 'Gula pasir tebu asli kemasan 1kg.',
                'price' => 30,
                'stock' => 35,
            ],
            [
                'name' => 'Voucher Pulsa 50rb',
                'category' => 'Elektronik',
                'desc' => 'Voucher isi ulang pulsa all operator senilai 50.000.',
                'price' => 50,
                'stock' => 100,
            ],
            [
                'name' => 'Botol Minum Eco-Friendly',
                'category' => 'Merchandise',
                'desc' => 'Tumbler minum ramah lingkungan tahan panas/dingin.',
                'price' => 60,
                'stock' => 15,
            ],
        ];

        $rewardModels = [];
        foreach ($rewards as $r) {
            $rewardModels[] = Reward::create([
                'name' => $r['name'],
                'category' => $r['category'],
                'description' => $r['desc'],
                'price' => $r['price'],
                'stock' => $r['stock'],
            ]);
        }

        // 5. Seed Historical Transactions & Points (Last 6 Months)
        $startDate = Carbon::now()->subMonths(5)->startOfMonth();
        $endDate = Carbon::now();

        $pointsTracker = [];
        foreach ($nasabahs as $n) {
            $pointsTracker[$n->id] = 0;
        }

        while ($startDate->lessThanOrEqualTo($endDate)) {
            // Generate 8-15 transactions for each month
            $numTransactions = rand(8, 15);
            for ($i = 0; $i < $numTransactions; $i++) {
                $targetNasabah = $nasabahs[array_rand($nasabahs)];
                $targetSampah = $sampahModels[array_rand($sampahModels)];

                $weight = round(rand(2, 25) + (rand(0, 9) / 10), 1); // 2.0 to 25.9 kg
                $income = (int) ($weight * $targetSampah->price_per_kg);
                // 1 point for every 1000 Rp
                $points = (int) ($income / 1000);

                // Create transaction
                $txDate = $startDate->copy()->addDays(rand(0, 27))->addHours(rand(8, 16));
                // Do not exceed current time
                if ($txDate->greaterThan(Carbon::now())) {
                    $txDate = Carbon::now();
                }

                Transaction::create([
                    'user_id' => $targetNasabah->id,
                    'admin_id' => $admin->id,
                    'sampah_id' => $targetSampah->id,
                    'total_weight' => $weight,
                    'total_income' => $income,
                    'point_received' => $points,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ]);

                $pointsTracker[$targetNasabah->id] += $points;
            }

            $startDate->addMonth();
        }

        // Write points balance to points table
        foreach ($nasabahs as $n) {
            Point::create([
                'user_id' => $n->id,
                'total_points' => $pointsTracker[$n->id],
            ]);
        }

        // 6. Seed Point Redemptions
        foreach ($nasabahs as $n) {
            // Seed a completed redemption
            $completedReward = $rewardModels[array_rand($rewardModels)];
            $qtyCompleted = rand(1, 2);
            $totalPointsCompleted = $completedReward->price * $qtyCompleted;

            // deduct points if they have enough
            if ($pointsTracker[$n->id] >= $totalPointsCompleted) {
                $txDate = Carbon::now()->subDays(rand(10, 30));
                TukarPoin::create([
                    'user_id' => $n->id,
                    'admin_id' => $admin->id,
                    'reward_id' => $completedReward->id,
                    'quantity' => $qtyCompleted,
                    'total_price' => $totalPointsCompleted,
                    'status' => 'done',
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ]);
                // update current balance in points table
                $pointModel = Point::where('user_id', $n->id)->first();
                $pointModel->decrement('total_points', $totalPointsCompleted);
            }

            // Seed a pending redemption
            $pendingReward = $rewardModels[array_rand($rewardModels)];
            $qtyPending = 1;
            $totalPointsPending = $pendingReward->price * $qtyPending;

            if ($totalPointsPending <= $pointsTracker[$n->id] - $totalPointsCompleted) {
                TukarPoin::create([
                    'user_id' => $n->id,
                    'admin_id' => null,
                    'reward_id' => $pendingReward->id,
                    'quantity' => $qtyPending,
                    'total_price' => $totalPointsPending,
                    'status' => 'pending',
                    'created_at' => Carbon::now()->subDays(rand(1, 5)),
                ]);
                $pointModel = Point::where('user_id', $n->id)->first();
                $pointModel->decrement('total_points', $totalPointsPending);
            }
        }

        // 7. Seed Audit Logs
        $auditLogs = [
            [
                'user_id' => $superAdmin->id,
                'action' => 'login',
                'desc' => 'Super Admin logged into the system.',
                'date' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $superAdmin->id,
                'action' => 'create_user',
                'desc' => 'Super Admin created a new Admin user account: Admin User.',
                'date' => Carbon::now()->subDays(5)->addMinutes(15),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'create_sampah',
                'desc' => 'Admin added new waste item: Kaleng Aluminium Minuman.',
                'date' => Carbon::now()->subDays(4),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'add_transaction',
                'desc' => 'Admin recorded a new waste deposit transaction for Nasabah: Siti Aminah (8.5 kg).',
                'date' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'approve_redemption',
                'desc' => 'Admin approved points redemption request for Budi Santoso (1x Beras Premium 5kg).',
                'date' => Carbon::now()->subDays(1),
            ],
        ];

        foreach ($auditLogs as $log) {
            AuditLog::create([
                'user_id' => $log['user_id'],
                'action' => $log['action'],
                'description' => $log['desc'],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'created_at' => $log['date'],
                'updated_at' => $log['date'],
            ]);
        }
    }
}

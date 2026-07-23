<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the audit log seeds.
     */
    public function run(): void
    {
        $superAdmin = User::where('role', 'super_admin')->first();
        $admin1 = User::where('email', 'admin@example.com')->first();
        $admin2 = User::where('email', 'admin2@example.com')->first();

        if (! $superAdmin || ! $admin1 || ! $admin2) {
            return;
        }

        $auditLogs = [
            [
                'user_id' => $superAdmin->id,
                'action' => 'login',
                'desc' => 'Super Admin masuk ke portal sistem.',
                'date' => Carbon::now()->subDays(10),
            ],
            [
                'user_id' => $admin1->id,
                'action' => 'create_transaction',
                'desc' => 'Admin POS Doko mencatat setoran sampah untuk Budi Santoso (12.5 kg Kardus Bekas Cokelat).',
                'date' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $admin2->id,
                'action' => 'create_transaction',
                'desc' => 'Admin POS Sukomulyo mencatat setoran sampah untuk Siti Aminah (8.0 kg Botol Plastik PET Bersih).',
                'date' => Carbon::now()->subDays(3),
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

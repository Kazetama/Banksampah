<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    /**
     * Log a user action.
     */
    public static function log(string $action, string $description, ?int $userId = null): void
    {
        AuditLog::create([
            'user_id' => $userId ?? Auth::id() ?? 1,
            'action' => $action,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}

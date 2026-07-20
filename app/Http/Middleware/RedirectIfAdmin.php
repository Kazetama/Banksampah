<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        Log::info('RedirectIfAdmin check:', [
            'url' => $request->fullUrl(),
            'user_id' => $user?->id,
            'user_role' => $user?->role,
            'is_admin' => $user?->isAdmin() ? 'yes' : 'no',
        ]);

        if ($user && $user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}

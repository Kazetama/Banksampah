<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        if (! $user) {
            abort(403, 'Unauthorized action.');
        }

        $allowedRoles = [];
        foreach ($roles as $role) {
            foreach (explode('|', $role) as $r) {
                $allowedRoles[] = trim($r);
            }
        }

        if (! in_array($user->role, $allowedRoles, true)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}

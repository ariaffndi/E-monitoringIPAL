<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectSelected
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        // OPERATOR
        if ($request->user()->role === 'operator') {

            if (!session('selected_project_id')) {

                session([
                    'selected_project_id' =>
                        $request->user()->project_id
                ]);
            }

            if (!currentProject()) {

                abort(
                    403,
                    'Operator belum memiliki project'
                );
            }
        }

        return $next($request);
    }
}
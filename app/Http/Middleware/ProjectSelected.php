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

        // ADMIN
        if ($request->user()->role === 'admin') {

            if (!currentProject()) {

                return redirect('/projects');
            }
        }

        // OPERATOR
        if ($request->user()->role === 'operator') {

            // ambil project otomatis dari user
            if (!session('selected_project_id')) {

                session([
                    'selected_project_id' =>
                        $request->user()->project_id
                ]);
            }

            // kalau operator tidak punya project
            if (!currentProject()) {

                abort(403, 'Operator belum memiliki project');
            }
        }

        return $next($request);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\OperationalReport;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\WaterParameter;
use App\Models\WaterTest;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // ================= ADMIN =================
        if ($user->role === 'admin') {

            $units = Unit::with('latestTest')
                ->oldest()
                ->get();

            $waterParameters = WaterParameter::oldest()->get([
                'id',
                'name',
            ]);

            $selectedParameter =
            $request->parameter ??
            $waterParameters->first()?->id;

            $chartData = WaterTest::query()
                ->where('water_parameter_id', $selectedParameter)
                ->whereIn('location', ['inlet', 'outlet'])
                ->with('operationalReport:id,created_at')
                ->latest()
                ->take(20)
                ->get()
                ->groupBy(function ($item) {
                    return optional($item->operationalReport)
                        ->created_at
                        ?->format('d M');
                })
                ->map(function ($items, $date) {
                    return [
                        'date' => $date,
                        'inlet' => optional(
                            $items->firstWhere('location', 'inlet')
                        )->value,
                        'outlet' => optional(
                            $items->firstWhere('location', 'outlet')
                        )->value,
                    ];
                })
                ->take(10)
                ->reverse()
                ->values();

            $operators = User::where('role', 'operator')
                ->oldest()
                ->take(3)
                ->get();

            $notes = OperationalReport::whereNotNull('note')
                ->where('note', '!=', '')
                ->latest()
                ->take(2)
                ->get(['id', 'note', 'created_at']);
            
            $datesWithReports = OperationalReport::selectRaw('DATE(created_at) as date')
                ->distinct()
                ->pluck('date');

            return Inertia::render('admin/Dashboard', [
                'units' => $units,
                'waterParameters' => $waterParameters,
                'chartData' => $chartData,
                'selectedParameter' => $selectedParameter,
                'operators' => $operators,
                'notes' => $notes,
                'datesWithReports' => $datesWithReports,
            ]);
        }
        // ================= OPERATOR =================
        $userId = $user->id;

        $todayReport = OperationalReport::whereDate('created_at', now())
            ->where('user_id', $userId)
            ->exists();

        $month = OperationalReport::whereMonth('created_at', now()->month)
            ->where('user_id', $userId)
            ->count();

        $week = OperationalReport::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->where('user_id', $userId)->count();

        $latest = OperationalReport::with(['unitTests', 'waterTests.waterParameter'])
    ->where('user_id', $userId)
    ->latest()
    ->first();

        $latestReport = null;

        if ($latest) {
            // ================= UNIT AVG =================
            $unitAvg = $latest->unitTests->avg(function ($item) {
                return $this->conditionToNumber($item->condition);
            });

            // ================= INLET =================
            $inlet = $latest->waterTests->where('location', 'inlet')->pluck('value')->map(fn($v) => (float) $v);

            $inletAvg = $inlet->count() ? $inlet->avg() : 0;

            // ================= OUTLET =================
            $outlet = $latest->waterTests->where('location', 'outlet')->pluck('value')->map(fn($v) => (float) $v);

            $outletAvg = $outlet->count() ? $outlet->avg() : 0;

            $latestReport = [
                'id' => $latest->id,
                'created_at' => $latest->created_at,
                'unit_avg' => round($unitAvg, 2),
                'inlet_avg' => round($inletAvg, 2),
                'outlet_avg' => round($outletAvg, 2),
            ];
        }

        $recentReports = OperationalReport::where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('operator/Dashboard', [
            'user' => [
                'name' => $user->name,
            ],

            'todayReport' => $todayReport ?? false,

            'stats' => [
                'month' => $month ?? 0,
                'week' => $week ?? 0,
                'streak' => 0,
            ],

            'latestReport' => $latestReport,

            'recentReports' => $recentReports ?? [],
        ]);
    }

    private function conditionToNumber($condition)
    {
        return match ($condition) {
            'sangat baik' => 5,
            'baik' => 4,
            'cukup' => 3,
            'kurang' => 2,
            'sangat kurang' => 1,
            default => 0,
        };
    }



}


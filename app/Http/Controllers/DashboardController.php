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
        $projectId = session('selected_project_id');

        // ================= ADMIN =================
        if ($user->role === 'admin') {

            $units = Unit::with('latestTest')
                ->where('project_id', $projectId)
                ->oldest()
                ->get();

            $waterParameters = WaterParameter::where('project_id', $projectId)
                ->oldest()
                ->get([
                    'id',
                    'name',
                ]);

            $selectedParameter =
                $request->parameter ??
                $waterParameters->first()?->id;

            $chartData = WaterTest::query()
                ->whereHas('operationalReport', function ($query) use ($projectId) {

                    $query->where('project_id', $projectId);
                })
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
            ->where('project_id', $projectId)
            ->oldest()
            ->take(2)
            ->get([
                'id',
                'name',
                'email',
                'image',
            ]);

            $conditionScores = [
                'sangat kurang' => 1,
                'kurang' => 2,
                'cukup' => 3,
                'baik' => 4,
                'sangat baik' => 5,
            ];

            $recentReports = OperationalReport::with([
                'unitTests',
                'waterTests.waterParameter',
            ])
            ->where('project_id', $projectId)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($report) use ($conditionScores) {

                // ================= UNIT AVG =================
                $unitAvg = round(
                    $report->unitTests->avg(function ($unitTest) use ($conditionScores) {

                        return $conditionScores[
                            strtolower($unitTest->condition)
                        ] ?? 0;
                    }),
                    1
                );

                // ================= INLET =================
                $inletTests = $report->waterTests
                    ->where('location', 'inlet');

                $inletMeet = 0;
                $inletNotMeet = 0;

                foreach ($inletTests as $test) {

                    $value = (float) $test->value;

                    $min = $test->waterParameter?->min_value;
                    $max = $test->waterParameter?->max_value;

                    $isMeet =
                        ($min === null || $value >= $min) &&
                        ($max === null || $value <= $max);

                    if ($isMeet) {
                        $inletMeet++;
                    } else {
                        $inletNotMeet++;
                    }
                }

                // ================= OUTLET =================
                $outletTests = $report->waterTests
                    ->where('location', 'outlet');

                $outletMeet = 0;
                $outletNotMeet = 0;

                foreach ($outletTests as $test) {

                    $value = (float) $test->value;

                    $min = $test->waterParameter?->min_value;
                    $max = $test->waterParameter?->max_value;

                    $isMeet =
                        ($min === null || $value >= $min) &&
                        ($max === null || $value <= $max);

                    if ($isMeet) {
                        $outletMeet++;
                    } else {
                        $outletNotMeet++;
                    }
                }

                return [
                    'id' => $report->id,
                    'created_at' => $report->created_at,
                    'note' => $report->note,
                    'unit_avg' => $unitAvg,

                    'inlet' => [
                        'meet' => $inletMeet,
                        'not_meet' => $inletNotMeet,
                    ],

                    'outlet' => [
                        'meet' => $outletMeet,
                        'not_meet' => $outletNotMeet,
                    ],
                ];
            });

            $datesWithReports = OperationalReport::where('project_id', $projectId)
                ->selectRaw('DATE(created_at) as date')
                ->distinct()
                ->pluck('date');

            $reportsCount = OperationalReport::where('project_id', $projectId)->count();
            $todayReport = OperationalReport::whereDate(
                'created_at',
                today()
            )
            ->exists();

            return Inertia::render('admin/Dashboard', [
                'units' => $units,
                'waterParameters' => $waterParameters,
                'chartData' => $chartData,
                'selectedParameter' => $selectedParameter,
                'operators' => $operators,
                'recentReports' => $recentReports,
                'datesWithReports' => $datesWithReports,
                'reportsCount' => $reportsCount,
                'todayReport' => $todayReport,
            ]);
        }

        // ================= OPERATOR =================

        $userId = $user->id;
        $reportsCount = OperationalReport::where('project_id', $projectId)->where('user_id', $userId)->count();
        $todayReport = OperationalReport::where('project_id', $projectId)
            ->whereDate('created_at', now())
            ->where('user_id', $userId)
            ->exists();

        $month = OperationalReport::where('project_id', $projectId)
            ->whereMonth('created_at', now()->month)
            ->where('user_id', $userId)
            ->count();

        $week = OperationalReport::where('project_id', $projectId)
            ->whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ])
            ->where('user_id', $userId)
            ->count();

        $conditionScores = [
            'sangat kurang' => 1,
            'kurang' => 2,
            'cukup' => 3,
            'baik' => 4,
            'sangat baik' => 5,
        ];

        $latestReport = OperationalReport::with([
                'unitTests',
                'waterTests.waterParameter',
            ])
            ->where('user_id', Auth::id())
            ->where(
                'project_id',
                session('selected_project_id')
            )
            ->latest()
            ->first();

        if ($latestReport) {

            // ================= UNIT AVG =================
            $unitAvg = round(
                $latestReport->unitTests->avg(function ($unitTest) use ($conditionScores) {

                    return $conditionScores[
                        strtolower($unitTest->condition)
                    ] ?? 0;
                }),
                1
            );

            // ================= INLET =================
            $inletTests = $latestReport->waterTests
                ->where('location', 'inlet');

            $inletMeet = 0;
            $inletNotMeet = 0;

            foreach ($inletTests as $test) {

                $value = (float) $test->value;

                $min = $test->waterParameter?->min_value;
                $max = $test->waterParameter?->max_value;

                $isMeet =
                    ($min === null || $value >= $min) &&
                    ($max === null || $value <= $max);

                if ($isMeet) {
                    $inletMeet++;
                } else {
                    $inletNotMeet++;
                }
            }

            // ================= OUTLET =================
            $outletTests = $latestReport->waterTests
                ->where('location', 'outlet');

            $outletMeet = 0;
            $outletNotMeet = 0;

            foreach ($outletTests as $test) {

                $value = (float) $test->value;

                $min = $test->waterParameter?->min_value;
                $max = $test->waterParameter?->max_value;

                $isMeet =
                    ($min === null || $value >= $min) &&
                    ($max === null || $value <= $max);

                if ($isMeet) {
                    $outletMeet++;
                } else {
                    $outletNotMeet++;
                }
            }

            $latestReport = [
                'id' => $latestReport->id,
                'created_at' => $latestReport->created_at,
                'unit_avg' => $unitAvg,

                'inlet' => [
                    'meet' => $inletMeet,
                    'not_meet' => $inletNotMeet,
                ],

                'outlet' => [
                    'meet' => $outletMeet,
                    'not_meet' => $outletNotMeet,
                ],
            ];
        }

        $recentReports = OperationalReport::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('operator/Dashboard', [
            'user' => [
                'name' => $user->name,
            ],
            'reportsCount' => $reportsCount,
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
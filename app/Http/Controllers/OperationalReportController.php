<?php

namespace App\Http\Controllers;

use App\Models\OperationalReport;
use App\Models\Unit;
use App\Models\UnitTest;
use App\Models\WaterParameter;
use App\Models\WaterTest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class OperationalReportController extends Controller
{
    private array $conditionMap = [
        'sangat kurang' => 1,
        'kurang' => 2,
        'cukup' => 3,
        'baik' => 4,
        'sangat baik' => 5,
    ];

    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $projectId = session('selected_project_id');

        $query = OperationalReport::with([
            'user',
            'unitTests',
            'waterTests.waterParameter'
        ])
        ->where('project_id', $projectId);

        if ($request->search) {

            $query->where(function ($q) use ($request) {

                $q->where(
                    'note',
                    'like',
                    '%' . $request->search . '%'
                )
                ->orWhereHas('user', function ($q2) use ($request) {

                    $q2->where(
                        'name',
                        'like',
                        '%' . $request->search . '%'
                    );
                });
            });
        }

        $reports = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $reports->getCollection()->transform(function ($report) {

            // ================= UNIT AVG =================
            $report->unit_avg = $this->calculateUnitAverage($report);

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

            $report->inlet = [
                'meet' => $inletMeet,
                'not_meet' => $inletNotMeet,
            ];

            $report->outlet = [
                'meet' => $outletMeet,
                'not_meet' => $outletNotMeet,
            ];

            return $report;
        });

        return Inertia::render(
            'admin/operational-reports/Index',
            [
                'reports' => $reports,
                'filters' => $request->only('search'),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        $this->authorizeOperator();

        return Inertia::render(
            'operator/operational-reports/Create',
            [
                'units' => Unit::where(
                        'project_id',
                        session('selected_project_id')
                    )
                    ->select('id', 'name', 'description')
                    ->get(),

                'parameters' => WaterParameter::where(
                        'project_id',
                        session('selected_project_id')
                    )
                    ->select(
                        'id',
                        'name',
                        'unit',
                        'type',
                        'min_value',
                        'max_value'
                    )
                    ->get(),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $this->authorizeOperator();

        $request->validate([
            'unit_tests' => 'required|array',
            'water_tests.inlet' => 'required|array',
            'water_tests.outlet' => 'required|array',
        ]);

        DB::beginTransaction();

        try {

            $report = OperationalReport::create([
                'project_id' => session('selected_project_id'),
                'user_id' => Auth::id(),
                'note' => $request->note,
                'date' => now(),
            ]);

            $this->storeUnitTests($request, $report->id);

            $this->storeWaterTests($request, $report->id);

            DB::commit();

            return redirect()
                ->route('dashboard')
                ->with(
                    'success',
                    'Laporan Operasional Berhasil Ditambahkan!'
                );

        } catch (\Exception $e) {

            DB::rollBack();

            dd($e->getMessage());
        }
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $this->authorizeAdmin();

        $report = $this->getReportDetail($id);

        return Inertia::render(
            'admin/operational-reports/Show',
            [
                'report' => $report
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | HISTORY
    |--------------------------------------------------------------------------
    */

    public function history(Request $request)
    {
        $this->authorizeOperator();

        $conditionScores = [
            'sangat kurang' => 1,
            'kurang' => 2,
            'cukup' => 3,
            'baik' => 4,
            'sangat baik' => 5,
        ];

        $reports = OperationalReport::with([
                'unitTests',
                'waterTests.waterParameter',
            ])
            ->where('user_id', Auth::id())
            ->where(
                'project_id',
                session('selected_project_id')
            )
            ->when($request->search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', '%' . $search . '%');
                $q->orWhereDate('created_at', $search);
                $q->orWhereRaw(
                    "DATE_FORMAT(created_at, '%d-%m-%Y') LIKE ?",
                    ['%' . $search . '%']
                );
                $q->orWhereRaw(
                    "DATE_FORMAT(created_at, '%Y-%m-%d') LIKE ?",
                    ['%' . $search . '%']
                );
            });
        })
            ->latest()
            ->paginate(15)
            ->through(function ($report) use ($conditionScores) {

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

        return Inertia::render(
            'operator/operational-reports/History',
            [
                'reports' => $reports,

                'filters' => [
                    'search' => $request->search,
                ],
            ]
        );
    }

    public function historyShow($id)
    {
        $this->authorizeOperator();

        $report = OperationalReport::with([
                'unitTests.unit',
                'waterTests.waterParameter'
            ])
            ->where('user_id', Auth::id())
            ->where(
                'project_id',
                session('selected_project_id')
            )
            ->findOrFail($id);

        return Inertia::render(
            'operator/operational-reports/HistoryShow',
            [
                'report' => $report
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | RECAP
    |--------------------------------------------------------------------------
    */

    public function recap(Request $request)
    {
        return Inertia::render(
            'admin/operational-reports/Recap',
            $this->buildRecapData($request)
        );
    }


    public function printRecap(Request $request)
    {
        return Inertia::render(
            'admin/operational-reports/PrintRecap',
            $this->buildRecapData($request)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PRINT DETAIL
    |--------------------------------------------------------------------------
    */

    public function print(OperationalReport $report)
    {
        $report->load([
            'project',
            'user',
            'unitTests.unit',
            'waterTests.waterParameter',
        ]);

        return Inertia::render(
            'admin/operational-reports/Print',
            [
                'report' => $report,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PRIVATE METHODS
    |--------------------------------------------------------------------------
    */

    private function authorizeAdmin()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }
    }

    private function authorizeOperator()
    {
        if (Auth::user()->role !== 'operator') {
            abort(403);
        }
    }

    private function getReportDetail($id)
    {
        return OperationalReport::with([
            'user',
            'unitTests.unit',
            'waterTests.waterParameter'
        ])
        ->where(
            'project_id',
            session('selected_project_id')
        )
        ->findOrFail($id);
    }

    private function calculateUnitAverage($report)
    {
        $scores = $report->unitTests->map(function ($u) {

            return $this->conditionMap[
                strtolower($u->condition)
            ] ?? 0;
        });

        return round($scores->avg(), 2);
    }

    private function calculateWaterAverage($report, $location)
    {
        $scores = [];

        foreach (
            $report->waterTests
                ->where('location', $location)
            as $w
        ) {

            $min = $w->waterParameter->min_value;
            $max = $w->waterParameter->max_value;

            $scores[] =
                ($w->value >= $min && $w->value <= $max)
                ? 5
                : 2;
        }

        return round(collect($scores)->avg(), 2);
    }

    private function buildRecapData(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $project = currentProject();
        $reports = OperationalReport::with([
            'user',
            'unitTests.unit',
            'waterTests.waterParameter',
        ])
        ->where(
            'project_id',
            session('selected_project_id')
        )
        ->whereDate('created_at', '>=', $from)
        ->whereDate('created_at', '<=', $to)
        ->latest()
        ->get();

        return [
            'project' => $project,
            'reports' => $reports,
            'from' => $from,
            'to' => $to,
            'chartData' => $this->buildChartData($reports),
            'unitRecap' => $this->buildUnitRecap($from, $to),
            'parameterRecap' => $this->buildParameterRecap($from, $to),
        ];
    }

    private function buildChartData($reports)
    {
        return $reports
            ->sortBy('created_at')
            ->groupBy(fn ($r) => $r->created_at->format('Y-m-d'))
            ->map(function ($items, $date) {

                $total = 0;
                $passed = 0;

                foreach ($items as $report) {

                    foreach (
                        $report->waterTests
                            ->where('location', 'outlet')
                        as $test
                    ) {

                        $total++;

                        $min = $test->waterParameter->min_value;
                        $max = $test->waterParameter->max_value;

                        if (
                            $test->value >= $min &&
                            $test->value <= $max
                        ) {
                            $passed++;
                        }
                    }
                }

                return [
                    'date' => \Carbon\Carbon::parse($date)->format('d M'),
                    'compliance' => $total
                        ? round(($passed / $total) * 100, 2)
                        : 0,
                ];
            })
            ->values();
    }

    private function buildUnitRecap($from, $to)
    {
        return Unit::where(
                'project_id',
                session('selected_project_id')
            )
            ->with([
                'unitTests' => function ($query) use ($from, $to) {

                    $query->whereHas(
                        'operationalReport',
                        function ($q) use ($from, $to) {

                            $q->whereDate('created_at', '>=', $from)
                              ->whereDate('created_at', '<=', $to);
                        }
                    );
                }
            ])
            ->get()
            ->map(function ($unit) {

                $scores = $unit->unitTests->map(function ($test) {

                    return $this->conditionMap[
                        strtolower($test->condition)
                    ] ?? 0;
                });

                $avg = round($scores->avg(), 2);

                return [
                    'name' => $unit->name,
                    'avg' => $avg,
                    'status' => $this->getStatusLabel($avg),
                ];
            });
    }

    private function buildParameterRecap($from, $to)
    {
        return WaterParameter::where(
                'project_id',
                session('selected_project_id')
            )
            ->with([
                'waterTests' => function ($query) use ($from, $to) {

                    $query->whereHas(
                        'operationalReport',
                        function ($q) use ($from, $to) {

                            $q->whereDate('created_at', '>=', $from)
                              ->whereDate('created_at', '<=', $to);
                        }
                    );
                }
            ])
            ->get()
            ->map(function ($parameter) {

                $inlet = $parameter->waterTests
                    ->where('location', 'inlet');

                $outlet = $parameter->waterTests
                    ->where('location', 'outlet');

                return [
                    'name' => $parameter->name,
                    'min' => $parameter->min_value,
                    'max' => $parameter->max_value,
                    'avg_inlet' => round($inlet->avg('value'), 2),
                    'avg_outlet' => round($outlet->avg('value'), 2),
                ];
            });
    }

    private function getStatusLabel($avg)
    {
        return match (true) {
            $avg >= 4.5 => 'Sangat Baik',
            $avg >= 3.5 => 'Baik',
            $avg >= 2.5 => 'Cukup',
            $avg >= 1.5 => 'Kurang',
            default => 'Sangat Kurang',
        };
    }

    private function storeUnitTests($request, $reportId)
    {
        foreach ($request->unit_tests as $index => $unit) {

            $unitExists = Unit::where(
                    'id',
                    $unit['unit_id']
                )
                ->where(
                    'project_id',
                    session('selected_project_id')
                )
                ->exists();

            if (!$unitExists) {
                continue;
            }

            $imagePath = null;

            if ($request->hasFile("unit_tests.$index.test_image")) {

                $imagePath = $this->uploadImage(
                    $request->file("unit_tests.$index.test_image"),
                    'unit-tests'
                );
            }

            // $image = null;

            // if ($request->hasFile("unit_tests.$index.test_image")) {

            //     $image = $request
            //         ->file("unit_tests.$index.test_image")
            //         ->store('unit-tests', 'public');
            // }

            UnitTest::create([
                'operational_report_id' => $reportId,
                'unit_id' => $unit['unit_id'],
                'condition' => $unit['condition'],
                'test_image' => $imagePath,
            ]);
        }
    }

    private function storeWaterTests($request, $reportId)
    {
        foreach (['inlet', 'outlet'] as $location) {

            foreach (
                $request->water_tests[$location]
                as $index => $water
            ) {

                $parameterExists = WaterParameter::where(
                        'id',
                        $water['water_parameter_id']
                    )
                    ->where(
                        'project_id',
                        session('selected_project_id')
                    )
                    ->exists();

                if (!$parameterExists) {
                    continue;
                }

                WaterTest::create([
                    'operational_report_id' => $reportId,
                    'water_parameter_id' =>
                        $water['water_parameter_id'],
                    'location' => $location,
                    'value' => $water['value'],
                ]);
            }
        }
    }

    private function uploadImage($file, string $folder): string
    {
        $manager = new ImageManager(
            new Driver()
        );

        $filename = Str::uuid() . '.webp';

        $image = $manager->decode($file);

        $image->scaleDown(width: 1200);

        Storage::disk('public')->put(
            "{$folder}/{$filename}",
            (string) $image->encodeUsingFileExtension(
                'webp',
                quality: 50
            )
        );

        return "{$folder}/{$filename}";
    }
}
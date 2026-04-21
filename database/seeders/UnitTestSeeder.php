<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = DB::table('operational_reports')->get();
        $units = DB::table('units')->get();

        $conditions = [
            'Sangat Baik',
            'Baik',
            'Cukup',
            'Kurang',
            'Sangat Kurang',
        ];

        foreach ($reports as $report) {
            foreach ($units as $unit) {
                DB::table('unit_tests')->insert([
                    'operational_report_id' => $report->id,
                    'unit_id' => $unit->id,
                    'condition' => $conditions[array_rand($conditions)],
                    'test_image' => 'units/sample.jpg',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

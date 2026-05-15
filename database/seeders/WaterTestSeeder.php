<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WaterTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = DB::table('operational_reports')->get();
        $parameters = DB::table('water_parameters')->get();

        foreach ($reports as $report) {
            foreach ($parameters as $param) {

                // ================= INLET (lebih kotor) =================
                DB::table('water_tests')->insert([
                    'operational_report_id' => $report->id,
                    'water_parameter_id' => $param->id,
                    'location' => 'inlet',
                    'value' => $this->generateValue($param, 'inlet'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // ================= OUTLET (lebih bersih) =================
                DB::table('water_tests')->insert([
                    'operational_report_id' => $report->id,
                    'water_parameter_id' => $param->id,
                    'location' => 'outlet',
                    'value' => $this->generateValue($param, 'outlet'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function generateValue($param, $type)
    {
        $min = $param->min_value;
        $max = $param->max_value;

        if ($type === 'inlet') {
            // lebih sering di atas baku mutu
            return rand($max, $max * 2);
        }

        // outlet → mendekati atau dalam batas
        return rand($min, $max + ($max * 0.2));
    }
}

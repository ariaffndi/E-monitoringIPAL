<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WaterParameter;

class WaterParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [

            // ================= FISIKA =================
            [
                'name' => 'Suhu',
                'unit' => '°C',
                'min_value' => 25,
                'max_value' => 35,
                'type' => 'fisika',
            ],
            [
                'name' => 'TSS',
                'unit' => 'mg/L',
                'min_value' => 0,
                'max_value' => 50,
                'type' => 'fisika',
            ],

            // ================= KIMIA =================
            [
                'name' => 'pH',
                'unit' => '',
                'min_value' => 6,
                'max_value' => 9,
                'type' => 'kimia',
            ],
            [
                'name' => 'BOD',
                'unit' => 'mg/L',
                'min_value' => 0,
                'max_value' => 30,
                'type' => 'kimia',
            ],
            [
                'name' => 'COD',
                'unit' => 'mg/L',
                'min_value' => 0,
                'max_value' => 100,
                'type' => 'kimia',
            ],

            // ================= BIOLOGI =================
            [
                'name' => 'E. Coli',
                'unit' => 'MPN/100ml',
                'min_value' => 0,
                'max_value' => 1000,
                'type' => 'biologi',
            ],
        ];

        foreach ($data as $item) {
            WaterParameter::create($item);
        }
    }
}

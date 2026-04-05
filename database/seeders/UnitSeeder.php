<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('units')->insert([
        [
            'name' => 'unit 1',
            'specification' => 'Specification Unit 1',
            'dimension' => 'Dimension Unit 1',
            'description' => 'Description Unit 1',
            'image' => 'image unit 1',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'name' => 'unit 2',
            'specification' => 'Specification Unit 2',
            'dimension' => 'Dimension Unit 2',
            'description' => 'Description Unit 2',
            'image' => 'image unit 2',
            'created_at' => now(),
            'updated_at' => now(),
        ]
    ]);
    }
}

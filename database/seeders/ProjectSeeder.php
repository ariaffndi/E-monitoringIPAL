<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'name' => 'IPAL Hotel Batu',
            'location' => 'Batu',
            'type' => 'Domestik',
            'capacity' => 300,
        ]);
        Project::create([
            'name' => 'IPAL Rumah Sakit Surabaya',
            'location' => 'Surabaya',
            'type' => 'Medis',
            'capacity' => 500,
        ]);
        Project::create([
            'name' => 'IPAL Industri Sidoarjo',
            'location' => 'Sidoarjo',
            'type' => 'Industri',
            'capacity' => 1200,
        ]);
    }
}
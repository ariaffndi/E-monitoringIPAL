<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OperationalReportSeeder extends Seeder
{
    public function run(): void
    {
        $operators = DB::table('users')
            ->where('role', 'operator')
            ->where('project_id', 1)
            ->get();

        foreach ($operators as $operator) {
            for ($i = 1; $i <= 3; $i++) {
                DB::table('operational_reports')->insert([
                    'project_id' => 1,
                    'user_id' => $operator->id,
                    'note' => $this->randomNote(),
                    'created_at' => Carbon::now()
                        ->subDays(10 - $i),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function randomNote()
    {
        $notes = [
            'Kondisi IPAL normal',
            'Sedikit bau terdeteksi di aerasi',
            'Debit meningkat karena hujan',
            null,
        ];

        return $notes[array_rand($notes)];
    }
}
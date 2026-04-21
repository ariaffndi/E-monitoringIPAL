<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OperationalReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $operators = DB::table('users')
            ->where('role', 'operator')
            ->get();

        foreach ($operators as $operator) {
            for ($i = 1; $i <= 10; $i++) {
                DB::table('operational_reports')->insert([
                    'user_id' => $operator->id,
                    'note' => $this->randomNote(),
                    'created_at' => Carbon::now()->subDays(10 - $i),
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
            'Filter perlu backwash',
            'Semua parameter dalam batas normal',
            'Terjadi sedikit kekeruhan di outlet',
            'Pompa bekerja normal',
            'Perlu pengecekan lanjutan pada ABR',
            null,
        ];

        return $notes[array_rand($notes)];
    }
}

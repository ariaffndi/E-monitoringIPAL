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
                'name' => 'Grease Trap (GT)',
                'specification' => 'Struktur Beton',
                'dimension' => '2 x 1 x 1.5 m',
                'description' => 'Memisahkan minyak dan lemak dari air limbah agar tidak mengganggu proses biologis.',
                'image' => 'units/grease-trap.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Equalization Tank',
                'specification' => 'Struktur Beton',
                'dimension' => '3 x 2 x 2 m',
                'description' => 'Menstabilkan debit dan beban pencemar sebelum masuk proses pengolahan.',
                'image' => 'units/equalization.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Anaerobic Baffled Reactor (ABR)',
                'specification' => 'Struktur Beton',
                'dimension' => '5 x 2 x 2.5 m',
                'description' => 'Menguraikan zat organik secara anaerob melalui beberapa kompartemen.',
                'image' => 'units/abr.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aeration Tank',
                'specification' => 'Struktur Beton',
                'dimension' => '4 x 2 x 2.5 m',
                'description' => 'Proses biologis aerob dengan bantuan aerasi untuk menguraikan zat organik.',
                'image' => 'units/aeration.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Clarifier',
                'specification' => 'Struktur Beton',
                'dimension' => '3 x 2 x 2 m',
                'description' => 'Mengendapkan lumpur hasil proses biologis.',
                'image' => 'units/clarifier.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Effluent Tank',
                'specification' => 'Struktur Beton',
                'dimension' => '2 x 2 x 2 m',
                'description' => 'Menampung air hasil olahan sebelum proses lanjutan.',
                'image' => 'units/effluent.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Filter Pump',
                'specification' => 'Fabrikasi Vendor',
                'dimension' => 'Pompa 1.5 HP',
                'description' => 'Pompa untuk mengalirkan air ke unit filtrasi.',
                'image' => 'units/pump.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pressure Filter',
                'specification' => 'Fibre-reinforced plastic',
                'dimension' => 'Ø 1 m, tinggi 2 m',
                'description' => 'Filter tekanan untuk menyaring partikel dan meningkatkan kualitas air.',
                'image' => 'units/pressure-filter.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Backwash Tank',
                'specification' => 'Fibre-reinforced plastic',
                'dimension' => '2 x 1.5 x 1.5 m',
                'description' => 'Tangki untuk proses pencucian media filter.',
                'image' => 'units/backwash.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Clear Water Tank',
                'specification' => 'Fibre-reinforced plastic',
                'dimension' => '2 x 2 x 2 m',
                'description' => 'Menampung air bersih hasil akhir pengolahan.',
                'image' => 'units/clear-water.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

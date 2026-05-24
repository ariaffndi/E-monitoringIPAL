<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([

            [
                'project_id' => null,
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('passadmin'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'project_id' => 1,
                'name' => 'Operator',
                'email' => 'operator@gmail.com',
                'password' => Hash::make('passoperator'),
                'role' => 'operator',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'project_id' => 1,
                'name' => 'Operator2',
                'email' => 'operator2@gmail.com',
                'password' => Hash::make('passoperator2'),
                'role' => 'operator',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'project_id' => 1,
                'name' => 'Operator3',
                'email' => 'operator3@gmail.com',
                'password' => Hash::make('passoperator3'),
                'role' => 'operator',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
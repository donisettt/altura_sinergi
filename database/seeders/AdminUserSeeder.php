<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@alturasinergi.com'],
            [
                'name'       => 'Super Admin',
                'password'   => Hash::make('Admin@1234'),
                'is_active'  => true,
            ]
        );

        $admin->assignRole('super_admin');

        $this->command->info('✅ Admin user created: admin@alturasinergi.com / Admin@1234');
    }
}

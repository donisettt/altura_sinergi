<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $admin      = Role::firstOrCreate(['name' => 'admin',       'guard_name' => 'web']);
        $editor     = Role::firstOrCreate(['name' => 'editor',      'guard_name' => 'web']);

        // Permissions
        $permissions = [
            // User management
            'user.view', 'user.create', 'user.edit', 'user.delete',
            // Content management (for future use)
            'content.view', 'content.create', 'content.edit', 'content.delete',
            // Settings
            'settings.view', 'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign all permissions to super_admin
        $superAdmin->syncPermissions(Permission::all());

        // Admin gets most permissions except delete
        $admin->syncPermissions(
            Permission::whereNotIn('name', ['user.delete', 'settings.edit'])->get()
        );

        // Editor gets content permissions only
        $editor->syncPermissions(
            Permission::where('name', 'like', 'content.%')->get()
        );
    }
}

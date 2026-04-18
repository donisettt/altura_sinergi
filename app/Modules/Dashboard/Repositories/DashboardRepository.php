<?php

namespace App\Modules\Dashboard\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function __construct(protected User $user) {}

    /**
     * Get total number of users.
     */
    public function getTotalUsers(): int
    {
        return $this->user->count();
    }

    /**
     * Get total active users.
     */
    public function getActiveUsers(): int
    {
        return $this->user->where('is_active', true)->count();
    }

    /**
     * Get new users registered in the last 30 days.
     */
    public function getNewUsersThisMonth(): int
    {
        return $this->user->where('created_at', '>=', now()->startOfMonth())->count();
    }

    /**
     * Get today's login count.
     */
    public function getTodayLogins(): int
    {
        return $this->user->whereDate('last_login_at', today())->count();
    }

    /**
     * Get recent users (last 10 registered).
     */
    public function getRecentUsers(int $limit = 8): mixed
    {
        return $this->user
            ->select('id', 'name', 'email', 'avatar', 'is_active', 'created_at', 'last_login_at')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Get admin and role stats.
     */
    public function getRoleStats(): mixed
    {
        return DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('roles.name as role', DB::raw('COUNT(*) as total'))
            ->groupBy('roles.name')
            ->get();
    }
}

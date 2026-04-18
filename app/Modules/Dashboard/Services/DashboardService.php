<?php

namespace App\Modules\Dashboard\Services;

use App\Modules\Dashboard\Repositories\DashboardRepository;
use App\Services\BaseService;

class DashboardService extends BaseService
{
    public function __construct(
        protected DashboardRepository $dashboardRepository
    ) {}

    /**
     * Aggregate all overview stats for the dashboard.
     */
    public function getOverviewStats(): array
    {
        return [
            'total_users'       => $this->dashboardRepository->getTotalUsers(),
            'active_users'      => $this->dashboardRepository->getActiveUsers(),
            'new_users_month'   => $this->dashboardRepository->getNewUsersThisMonth(),
            'today_logins'      => $this->dashboardRepository->getTodayLogins(),
        ];
    }

    /**
     * Get recent user list for the activity table.
     */
    public function getRecentUsers(int $limit = 8): mixed
    {
        return $this->dashboardRepository->getRecentUsers($limit);
    }

    /**
     * Get role distribution data.
     */
    public function getRoleStats(): mixed
    {
        return $this->dashboardRepository->getRoleStats();
    }
}

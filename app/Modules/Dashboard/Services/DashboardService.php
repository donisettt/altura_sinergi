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
     * Aggregate all overview stats for the dashboard top cards & activity.
     */
    public function getOverviewStats(): array
    {
        return [
            // User section
            'total_users'       => $this->dashboardRepository->getTotalUsers(),
            'active_users'      => $this->dashboardRepository->getActiveUsers(),
            'today_logins'      => $this->dashboardRepository->getTodayLogins(),

            // Content & CRM Section
            'total_leads'       => $this->dashboardRepository->getTotalLeads(),
            'new_leads_month'   => $this->dashboardRepository->getNewLeadsThisMonth(),
            
            'total_case_studies'=> $this->dashboardRepository->getTotalCaseStudies(),
            'total_services'    => $this->dashboardRepository->getTotalServices(),
            
            'leads_deals_today' => $this->dashboardRepository->getLeadsDealsToday(),
            'new_leads_today'   => $this->dashboardRepository->getNewLeadsToday(),
        ];
    }

    /**
     * Fetch chart datasets
     */
    public function getChartData(): array
    {
        return [
            'monthly_leads' => $this->dashboardRepository->getMonthlyLeadStats(8),
            'yearly_growth' => $this->dashboardRepository->getYearlyLeadGrowth(),
        ];
    }

    public function getLeadStatusDistribution(): mixed
    {
        return $this->dashboardRepository->getLeadStatusDistribution();
    }

    /**
     * Get recent lists
     */
    public function getRecentUsers(int $limit = 5): mixed
    {
        return $this->dashboardRepository->getRecentUsers($limit);
    }

    public function getRecentLeads(int $limit = 6): mixed
    {
        return $this->dashboardRepository->getRecentLeads($limit);
    }
}

<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Render the admin dashboard overview page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'stats'            => $this->dashboardService->getOverviewStats(),
            'chartData'        => $this->dashboardService->getChartData(),
            'leadStatusStats'  => $this->dashboardService->getLeadStatusDistribution(),
            'recentUsers'      => $this->dashboardService->getRecentUsers(),
            'recentLeads'      => $this->dashboardService->getRecentLeads(),
        ]);
    }
}

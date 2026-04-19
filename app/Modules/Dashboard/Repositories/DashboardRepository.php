<?php

namespace App\Modules\Dashboard\Repositories;

use App\Models\User;
use App\Models\Lead;
use App\Models\CaseStudy;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardRepository
{
    public function __construct(protected User $user) {}

    /**
     * Users & Login Stats
     */
    public function getTotalUsers(): int
    {
        return $this->user->count();
    }

    public function getActiveUsers(): int
    {
        return $this->user->where('is_active', true)->count();
    }

    public function getTodayLogins(): int
    {
        return $this->user->whereDate('last_login_at', today())->count();
    }

    /**
     * CMS Stats
     */
    public function getTotalLeads(): int
    {
        return Lead::count();
    }

    public function getNewLeadsThisMonth(): int
    {
        return Lead::where('created_at', '>=', now()->startOfMonth())->count();
    }

    public function getTotalCaseStudies(): int
    {
        return CaseStudy::count();
    }

    public function getTotalServices(): int
    {
        return Service::count();
    }

    public function getLeadsDealsToday(): int
    {
        return Lead::where('status', 'deal')->whereDate('updated_at', today())->count();
    }

    public function getNewLeadsToday(): int
    {
        return Lead::whereDate('created_at', today())->count();
    }

    /**
     * Monthly Lead Data (Bar Chart)
     */
    public function getMonthlyLeadStats(int $months = 6): array
    {
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $monthStart = now()->subMonthsNoOverflow($i)->startOfMonth();
            $monthEnd   = now()->subMonthsNoOverflow($i)->endOfMonth();

            $total = Lead::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $deal  = Lead::where('status', 'deal')->whereBetween('updated_at', [$monthStart, $monthEnd])->count();

            $data[] = [
                'month' => $monthStart->format('M'),
                'total' => $total,
                'deals' => $deal,
            ];
        }

        return $data;
    }

    /**
     * Lead Status Distribution (Donut Chart)
     */
    public function getLeadStatusDistribution(): mixed
    {
        return Lead::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get();
    }

    /**
     * Lead Growth Data (Line Chart)
     */
    public function getYearlyLeadGrowth(): array
    {
        $data = [];
        $currentYear = now()->year;
        
        for ($i = 4; $i >= 0; $i--) {
            $year = $currentYear - $i;
            $data[] = [
                'year'  => (string) $year,
                'total' => Lead::whereYear('created_at', '<=', $year)->count(),
            ];
        }
        
        return $data;
    }

    /**
     * Recent Records
     */
    public function getRecentUsers(int $limit = 4): mixed
    {
        return $this->user
            ->select('id', 'name', 'email', 'avatar', 'is_active', 'created_at', 'last_login_at')
            ->latest('last_login_at')
            ->limit($limit)
            ->get();
    }

    public function getRecentLeads(int $limit = 4): mixed
    {
        return Lead::select('id', 'name', 'company', 'status', 'created_at')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Admin Role Stats
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

<?php

namespace App\Providers;

use App\Modules\Auth\Repositories\AuthRepository;
use App\Modules\Auth\Repositories\Contracts\AuthRepositoryInterface;
use App\Modules\User\Repositories\Contracts\UserRepositoryInterface;
use App\Modules\User\Repositories\UserRepository;

// CMS Landing Page
use App\Modules\LandingPage\Hero\Repositories\Contracts\HeroRepositoryInterface;
use App\Modules\LandingPage\Hero\Repositories\HeroRepository;
use App\Modules\LandingPage\Metric\Repositories\Contracts\MetricRepositoryInterface;
use App\Modules\LandingPage\Metric\Repositories\MetricRepository;
use App\Modules\LandingPage\ValueProposition\Repositories\Contracts\ValuePropositionRepositoryInterface;
use App\Modules\LandingPage\ValueProposition\Repositories\ValuePropositionRepository;

// CMS Entities
use App\Modules\CmsService\Repositories\Contracts\ServiceRepositoryInterface;
use App\Modules\CmsService\Repositories\ServiceRepository;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepositoryInterface;
use App\Modules\CaseStudy\Repositories\CaseStudyRepository;
use App\Modules\Client\Repositories\Contracts\ClientRepositoryInterface;
use App\Modules\Client\Repositories\ClientRepository;
use App\Modules\Lead\Repositories\Contracts\LeadRepositoryInterface;
use App\Modules\Lead\Repositories\LeadRepository;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Auth Module
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);

        // User Module
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        // CMS — Landing Page
        $this->app->bind(HeroRepositoryInterface::class, HeroRepository::class);
        $this->app->bind(MetricRepositoryInterface::class, MetricRepository::class);
        $this->app->bind(ValuePropositionRepositoryInterface::class, ValuePropositionRepository::class);

        // CMS — Entities
        $this->app->bind(ServiceRepositoryInterface::class, ServiceRepository::class);
        $this->app->bind(CaseStudyRepositoryInterface::class, CaseStudyRepository::class);
        $this->app->bind(ClientRepositoryInterface::class, ClientRepository::class);
        $this->app->bind(LeadRepositoryInterface::class, LeadRepository::class);
    }

    public function boot(): void
    {
        //
    }
}

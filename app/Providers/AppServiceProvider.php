<?php

namespace App\Providers;

use App\Modules\Auth\Repositories\AuthRepository;
use App\Modules\Auth\Repositories\Contracts\AuthRepositoryInterface;
use App\Modules\User\Repositories\Contracts\UserRepositoryInterface;
use App\Modules\User\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Auth Module
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);

        // User Module
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    public function boot(): void
    {
        //
    }
}

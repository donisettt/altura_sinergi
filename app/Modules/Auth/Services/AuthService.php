<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Repositories\Contracts\AuthRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Support\Facades\Auth;

class AuthService extends BaseService
{
    public function __construct(
        protected AuthRepositoryInterface $authRepository
    ) {}

    /**
     * Attempt to authenticate the user.
     *
     * @param  array{email: string, password: string, remember: bool}  $credentials
     */
    public function login(array $credentials): bool
    {
        $remember = $credentials['remember'] ?? false;

        $attempt = Auth::attempt([
            'email'     => $credentials['email'],
            'password'  => $credentials['password'],
            'is_active' => true,
        ], $remember);

        if ($attempt) {
            $this->authRepository->updateLastLogin(Auth::id());
        }

        return $attempt;
    }

    /**
     * Log out the currently authenticated user.
     */
    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    /**
     * Get the currently authenticated user.
     */
    public function getCurrentUser()
    {
        return Auth::user();
    }
}

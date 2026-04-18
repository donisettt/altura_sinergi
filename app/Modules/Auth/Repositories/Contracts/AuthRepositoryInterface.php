<?php

namespace App\Modules\Auth\Repositories\Contracts;

interface AuthRepositoryInterface
{
    public function findByEmail(string $email);
    public function updateLastLogin(int $userId): void;
}

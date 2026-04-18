<?php

namespace App\Modules\User\Services;

use App\Modules\User\Repositories\Contracts\UserRepositoryInterface;
use App\Services\BaseService;

class UserService extends BaseService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get paginated users with filters.
     */
    public function getUsers(array $filters = [], int $perPage = 10)
    {
        return $this->userRepository->paginate($filters, $perPage);
    }

    /**
     * Get a single user for editing.
     */
    public function getUserById(int $id)
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Get available roles for select dropdowns.
     */
    public function getRoles(): array
    {
        return $this->userRepository->getRolesForSelect();
    }

    /**
     * Create a new user account.
     */
    public function createUser(array $data)
    {
        return $this->userRepository->create($data);
    }

    /**
     * Update an existing user account.
     */
    public function updateUser(int $id, array $data): bool
    {
        return $this->userRepository->update($id, $data);
    }

    /**
     * Delete a user account.
     */
    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    /**
     * Aggregate quick stats for the users list page header.
     */
    public function getStats(): array
    {
        $model = app(\App\Models\User::class);

        return [
            'total'     => $model->count(),
            'active'    => $model->where('is_active', true)->count(),
            'inactive'  => $model->where('is_active', false)->count(),
            'new_month' => $model->where('created_at', '>=', now()->startOfMonth())->count(),
        ];
    }
}

<?php

namespace App\Modules\User\Repositories;

use App\Models\User;
use App\Modules\User\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Paginate users with optional filters.
     *
     * @param  array{search?: string, role?: string, status?: string}  $filters
     */
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->model
            ->with('roles')
            ->select('id', 'name', 'email', 'avatar', 'is_active', 'last_login_at', 'created_at');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->whereHas('roles', fn($q) => $q->where('name', $filters['role']));
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('is_active', (bool) $filters['status']);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    /**
     * Find user by ID with roles loaded.
     */
    public function findById(int $id): User
    {
        return $this->model->with('roles')->findOrFail($id);
    }

    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        $user = $this->model->create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => $data['password'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        if (!empty($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user;
    }

    /**
     * Update an existing user.
     */
    public function update(int $id, array $data): bool
    {
        $user = $this->model->findOrFail($id);

        $payload = [
            'name'      => $data['name'],
            'email'     => $data['email'],
            'is_active' => isset($data['is_active']) ? (bool) $data['is_active'] : $user->is_active,
        ];

        if (!empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $user->fill($payload)->save();

        if (!empty($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return true;
    }

    /**
     * Delete a user by ID.
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Get all roles for select dropdowns.
     */
    public function getRolesForSelect(): array
    {
        return Role::orderBy('name')->pluck('name', 'name')->toArray();
    }
}

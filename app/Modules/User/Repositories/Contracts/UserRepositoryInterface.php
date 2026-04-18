<?php

namespace App\Modules\User\Repositories\Contracts;

interface UserRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 10);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getRolesForSelect(): array;
}

<?php

namespace App\Modules\CmsService\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ServiceRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): \App\Models\Service;
    public function create(array $data): \App\Models\Service;
    public function update(int $id, array $data): \App\Models\Service;
    public function delete(int $id): void;
    public function reorder(array $orderedIds): void;
}

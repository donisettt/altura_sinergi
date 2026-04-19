<?php

namespace App\Modules\Client\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ClientRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): \App\Models\Client;
    public function create(array $data): \App\Models\Client;
    public function update(int $id, array $data): \App\Models\Client;
    public function delete(int $id): void;
    public function reorder(array $orderedIds): void;
}

<?php

namespace App\Modules\Lead\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LeadRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): \App\Models\Lead;
    public function create(array $data): \App\Models\Lead;
    public function update(int $id, array $data): \App\Models\Lead;
    public function delete(int $id): void;
    public function getStats(): array;
}

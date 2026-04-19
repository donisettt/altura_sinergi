<?php

namespace App\Modules\LandingPage\Metric\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface MetricRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): \App\Models\Metric;
    public function create(array $data): \App\Models\Metric;
    public function update(int $id, array $data): \App\Models\Metric;
    public function delete(int $id): void;
    public function reorder(array $orderedIds): void;
}

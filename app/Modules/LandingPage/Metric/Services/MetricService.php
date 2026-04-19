<?php

namespace App\Modules\LandingPage\Metric\Services;

use App\Modules\LandingPage\Metric\Repositories\Contracts\MetricRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;

class MetricService extends BaseService
{
    public function __construct(
        protected MetricRepositoryInterface $repo
    ) {}

    public function getAll(): Collection
    {
        return $this->repo->getAll();
    }

    public function create(array $data): \App\Models\Metric
    {
        $data['sort_order'] = \App\Models\Metric::max('sort_order') + 1;
        return $this->repo->create($data);
    }

    public function update(int $id, array $data): \App\Models\Metric
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repo->delete($id);
    }

    public function reorder(array $orderedIds): void
    {
        $this->repo->reorder($orderedIds);
    }
}

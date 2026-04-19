<?php

namespace App\Modules\LandingPage\Metric\Repositories;

use App\Models\Metric;
use App\Modules\LandingPage\Metric\Repositories\Contracts\MetricRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class MetricRepository extends BaseRepository implements MetricRepositoryInterface
{
    public function __construct(Metric $model)
    {
        parent::__construct($model);
    }

    public function getAll(): Collection
    {
        return Metric::orderBy('sort_order')->get();
    }

    public function findById(int $id): Metric
    {
        return Metric::findOrFail($id);
    }

    public function create(array $data): Metric
    {
        return Metric::create($data);
    }

    public function update(int $id, array $data): Metric
    {
        $metric = Metric::findOrFail($id);
        $metric->update($data);
        return $metric->fresh();
    }

    public function delete(int $id): void
    {
        Metric::findOrFail($id)->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            Metric::where('id', $id)->update(['sort_order' => $position + 1]);
        }
    }
}

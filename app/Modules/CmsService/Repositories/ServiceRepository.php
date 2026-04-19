<?php

namespace App\Modules\CmsService\Repositories;

use App\Models\Service;
use App\Modules\CmsService\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ServiceRepository extends BaseRepository implements ServiceRepositoryInterface
{
    public function __construct(Service $model)
    {
        parent::__construct($model);
    }

    public function getAll(): Collection
    {
        return Service::orderBy('sort_order')->get();
    }

    public function findById(int $id): Service
    {
        return Service::findOrFail($id);
    }

    public function create(array $data): Service
    {
        return Service::create($data);
    }

    public function update(int $id, array $data): Service
    {
        $service = Service::findOrFail($id);
        $service->update($data);
        return $service->fresh();
    }

    public function delete(int $id): void
    {
        Service::findOrFail($id)->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            Service::where('id', $id)->update(['sort_order' => $position + 1]);
        }
    }
}

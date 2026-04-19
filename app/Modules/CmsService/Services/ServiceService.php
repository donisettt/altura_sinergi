<?php

namespace App\Modules\CmsService\Services;

use App\Models\Service;
use App\Modules\CmsService\Repositories\Contracts\ServiceRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ServiceService extends BaseService
{
    public function __construct(
        protected ServiceRepositoryInterface $repo
    ) {}

    public function getAll(): Collection
    {
        return $this->repo->getAll();
    }

    public function findById(int $id): Service
    {
        return $this->repo->findById($id);
    }

    public function create(array $data, ?UploadedFile $image = null): Service
    {
        $data['sort_order'] = Service::max('sort_order') + 1;
        if ($image) {
            $data['image'] = $image->store('services', 'public');
        }
        return $this->repo->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $image = null): Service
    {
        if ($image) {
            $old = $this->repo->findById($id);
            if ($old->image) {
                Storage::disk('public')->delete($old->image);
            }
            $data['image'] = $image->store('services', 'public');
        }
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $service = $this->repo->findById($id);
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }
        $this->repo->delete($id);
    }

    public function reorder(array $orderedIds): void
    {
        $this->repo->reorder($orderedIds);
    }
}

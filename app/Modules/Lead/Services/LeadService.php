<?php

namespace App\Modules\Lead\Services;

use App\Models\Lead;
use App\Modules\Lead\Repositories\Contracts\LeadRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadService extends BaseService
{
    public function __construct(
        protected LeadRepositoryInterface $repo
    ) {}

    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function findById(int $id): Lead
    {
        return $this->repo->findById($id);
    }

    public function create(array $data): Lead
    {
        return $this->repo->create($data);
    }

    public function updateStatus(int $id, string $status, ?string $notes = null): Lead
    {
        $data = ['status' => $status];
        if ($status === 'contacted') {
            $data['contacted_at'] = now();
        }
        if ($notes !== null) {
            $data['notes'] = $notes;
        }
        return $this->repo->update($id, $data);
    }

    public function update(int $id, array $data): Lead
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repo->delete($id);
    }

    public function getStats(): array
    {
        return $this->repo->getStats();
    }
}

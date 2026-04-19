<?php

namespace App\Modules\LandingPage\ValueProposition\Services;

use App\Models\ValueProposition;
use App\Modules\LandingPage\ValueProposition\Repositories\Contracts\ValuePropositionRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;

class ValuePropositionService extends BaseService
{
    public function __construct(
        protected ValuePropositionRepositoryInterface $repo
    ) {}

    public function getAll(): Collection
    {
        return $this->repo->getAll();
    }

    public function create(array $data): ValueProposition
    {
        $data['sort_order'] = ValueProposition::max('sort_order') + 1;
        return $this->repo->create($data);
    }

    public function update(int $id, array $data): ValueProposition
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

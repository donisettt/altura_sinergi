<?php

namespace App\Modules\LandingPage\ValueProposition\Repositories;

use App\Models\ValueProposition;
use App\Modules\LandingPage\ValueProposition\Repositories\Contracts\ValuePropositionRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ValuePropositionRepository extends BaseRepository implements ValuePropositionRepositoryInterface
{
    public function __construct(ValueProposition $model)
    {
        parent::__construct($model);
    }

    public function getAll(): Collection
    {
        return ValueProposition::orderBy('sort_order')->get();
    }

    public function findById(int $id): ValueProposition
    {
        return ValueProposition::findOrFail($id);
    }

    public function create(array $data): ValueProposition
    {
        return ValueProposition::create($data);
    }

    public function update(int $id, array $data): ValueProposition
    {
        $vp = ValueProposition::findOrFail($id);
        $vp->update($data);
        return $vp->fresh();
    }

    public function delete(int $id): void
    {
        ValueProposition::findOrFail($id)->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            ValueProposition::where('id', $id)->update(['sort_order' => $position + 1]);
        }
    }
}

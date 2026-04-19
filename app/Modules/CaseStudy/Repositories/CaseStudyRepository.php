<?php

namespace App\Modules\CaseStudy\Repositories;

use App\Models\CaseStudy;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CaseStudyRepository extends BaseRepository implements CaseStudyRepositoryInterface
{
    public function __construct(CaseStudy $model)
    {
        parent::__construct($model);
    }

    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $q = CaseStudy::orderBy('sort_order');

        if (!empty($filters['search'])) {
            $q->where('title', 'like', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['category'])) {
            $q->where('category', $filters['category']);
        }

        return $q->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): CaseStudy
    {
        return CaseStudy::findOrFail($id);
    }

    public function create(array $data): CaseStudy
    {
        return CaseStudy::create($data);
    }

    public function update(int $id, array $data): CaseStudy
    {
        $cs = CaseStudy::findOrFail($id);
        $cs->update($data);
        return $cs->fresh();
    }

    public function delete(int $id): void
    {
        CaseStudy::findOrFail($id)->delete();
    }
}

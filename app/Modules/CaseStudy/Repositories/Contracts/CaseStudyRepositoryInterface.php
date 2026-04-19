<?php

namespace App\Modules\CaseStudy\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CaseStudyRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator;
    public function findById(int $id): \App\Models\CaseStudy;
    public function create(array $data): \App\Models\CaseStudy;
    public function update(int $id, array $data): \App\Models\CaseStudy;
    public function delete(int $id): void;
}

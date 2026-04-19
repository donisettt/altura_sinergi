<?php

namespace App\Modules\CaseStudy\Services;

use App\Models\CaseStudy;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CaseStudyService extends BaseService
{
    public function __construct(
        protected CaseStudyRepositoryInterface $repo
    ) {}

    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function findById(int $id): CaseStudy
    {
        return $this->repo->findById($id);
    }

    public function create(array $data, ?UploadedFile $image = null): CaseStudy
    {
        $data['sort_order'] = CaseStudy::max('sort_order') + 1;
        if ($image) {
            $data['image'] = $image->store('case-studies', 'public');
        }
        return $this->repo->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $image = null): CaseStudy
    {
        if ($image) {
            $old = $this->repo->findById($id);
            if ($old->image) {
                Storage::disk('public')->delete($old->image);
            }
            $data['image'] = $image->store('case-studies', 'public');
        }
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $cs = $this->repo->findById($id);
        if ($cs->image) {
            Storage::disk('public')->delete($cs->image);
        }
        $this->repo->delete($id);
    }
}

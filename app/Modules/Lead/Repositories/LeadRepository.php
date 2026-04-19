<?php

namespace App\Modules\Lead\Repositories;

use App\Models\Lead;
use App\Modules\Lead\Repositories\Contracts\LeadRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadRepository extends BaseRepository implements LeadRepositoryInterface
{
    public function __construct(Lead $model)
    {
        parent::__construct($model);
    }

    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $q = Lead::latest();

        if (!empty($filters['search'])) {
            $q->where(function ($q2) use ($filters) {
                $q2->where('name', 'like', '%' . $filters['search'] . '%')
                   ->orWhere('company', 'like', '%' . $filters['search'] . '%')
                   ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }
        if (!empty($filters['status'])) {
            $q->where('status', $filters['status']);
        }

        return $q->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): Lead
    {
        return Lead::findOrFail($id);
    }

    public function create(array $data): Lead
    {
        return Lead::create($data);
    }

    public function update(int $id, array $data): Lead
    {
        $lead = Lead::findOrFail($id);
        $lead->update($data);
        return $lead->fresh();
    }

    public function delete(int $id): void
    {
        Lead::findOrFail($id)->delete();
    }

    public function getStats(): array
    {
        return [
            'total'     => Lead::count(),
            'new'       => Lead::where('status', 'new')->count(),
            'contacted' => Lead::where('status', 'contacted')->count(),
            'deal'      => Lead::where('status', 'deal')->count(),
            'rejected'  => Lead::where('status', 'rejected')->count(),
        ];
    }
}

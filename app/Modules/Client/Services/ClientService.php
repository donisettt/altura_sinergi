<?php

namespace App\Modules\Client\Services;

use App\Models\Client;
use App\Modules\Client\Repositories\Contracts\ClientRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ClientService extends BaseService
{
    public function __construct(
        protected ClientRepositoryInterface $repo
    ) {}

    public function getAll(): Collection
    {
        return $this->repo->getAll();
    }

    public function create(array $data, ?UploadedFile $logo = null): Client
    {
        $data['sort_order'] = Client::max('sort_order') + 1;
        if ($logo) {
            $data['logo'] = $logo->store('clients', 'public');
        }
        return $this->repo->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $logo = null): Client
    {
        if ($logo) {
            $old = $this->repo->findById($id);
            if ($old->logo) {
                Storage::disk('public')->delete($old->logo);
            }
            $data['logo'] = $logo->store('clients', 'public');
        }
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $client = $this->repo->findById($id);
        if ($client->logo) {
            Storage::disk('public')->delete($client->logo);
        }
        $this->repo->delete($id);
    }

    public function reorder(array $orderedIds): void
    {
        $this->repo->reorder($orderedIds);
    }
}

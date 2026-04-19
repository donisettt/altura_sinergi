<?php

namespace App\Modules\Client\Repositories;

use App\Models\Client;
use App\Modules\Client\Repositories\Contracts\ClientRepositoryInterface;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class ClientRepository extends BaseRepository implements ClientRepositoryInterface
{
    public function __construct(Client $model)
    {
        parent::__construct($model);
    }

    public function getAll(): Collection
    {
        return Client::orderBy('sort_order')->get();
    }

    public function findById(int $id): Client
    {
        return Client::findOrFail($id);
    }

    public function create(array $data): Client
    {
        return Client::create($data);
    }

    public function update(int $id, array $data): Client
    {
        $client = Client::findOrFail($id);
        $client->update($data);
        return $client->fresh();
    }

    public function delete(int $id): void
    {
        Client::findOrFail($id)->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            Client::where('id', $id)->update(['sort_order' => $position + 1]);
        }
    }
}

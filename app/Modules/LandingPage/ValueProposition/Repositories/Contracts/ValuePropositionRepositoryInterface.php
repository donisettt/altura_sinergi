<?php

namespace App\Modules\LandingPage\ValueProposition\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ValuePropositionRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): \App\Models\ValueProposition;
    public function create(array $data): \App\Models\ValueProposition;
    public function update(int $id, array $data): \App\Models\ValueProposition;
    public function delete(int $id): void;
    public function reorder(array $orderedIds): void;
}

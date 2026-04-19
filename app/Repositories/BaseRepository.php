<?php

namespace App\Repositories;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*'])
    {
        return $this->model->get($columns);
    }

    public function find(int $id, array $columns = ['*'])
    {
        return $this->model->select($columns)->findOrFail($id);
    }

    public function findBy(string $field, mixed $value, array $columns = ['*'])
    {
        return $this->model->select($columns)->where($field, $value)->first();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        return (bool) $this->model->where('id', $id)->update($data);
    }

    public function delete(int $id)
    {
        return (bool) $this->model->destroy($id);
    }
}

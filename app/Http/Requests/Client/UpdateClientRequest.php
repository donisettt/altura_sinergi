<?php

namespace App\Http\Requests\Client;

class UpdateClientRequest extends StoreClientRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['logo'] = 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048';
        return $rules;
    }
}

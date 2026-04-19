<?php

namespace App\Http\Requests\CmsService;

class UpdateServiceRequest extends StoreServiceRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['image'] = 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072';
        return $rules;
    }
}

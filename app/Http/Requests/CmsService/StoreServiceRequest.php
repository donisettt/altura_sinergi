<?php

namespace App\Http\Requests\CmsService;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'             => 'required|string|max:120',
            'category'         => 'required|in:IT,Electrical,SPBU',
            'description'      => 'nullable|string',
            'features'         => 'nullable|array',
            'features.*'       => 'string|max:200',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'cta_text'         => 'nullable|string|max:80',
            'cta_link'         => 'nullable|string|max:255',
            'badge'            => 'nullable|string|max:50',
            'show_on_homepage' => 'boolean',
            'is_active'        => 'boolean',
        ];
    }
}

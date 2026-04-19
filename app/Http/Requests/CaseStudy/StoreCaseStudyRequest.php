<?php

namespace App\Http\Requests\CaseStudy;

use Illuminate\Foundation\Http\FormRequest;

class StoreCaseStudyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'        => 'required|string|max:200',
            'category'     => 'nullable|string|max:80',
            'metric_value' => 'nullable|string|max:30',
            'metric_label' => 'nullable|string|max:80',
            'description'  => 'nullable|string',
            'location'     => 'nullable|string|max:120',
            'tags'         => 'nullable|array',
            'tags.*'       => 'string|max:50',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'is_active'    => 'boolean',
        ];
    }
}

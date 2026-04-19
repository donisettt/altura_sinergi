<?php

namespace App\Http\Requests\Seo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'            => 'nullable|string|max:80',
            'meta_description' => 'nullable|string|max:300',
            'og_image'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'keywords'         => 'nullable|string|max:500',
        ];
    }
}

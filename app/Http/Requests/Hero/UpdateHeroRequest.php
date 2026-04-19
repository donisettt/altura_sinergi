<?php

namespace App\Http\Requests\Hero;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'headline'         => 'nullable|array',
            'subheadline'      => 'nullable|string|max:255',
            'tagline'          => 'nullable|string|max:120',
            'cta1_text'        => 'nullable|string|max:80',
            'cta1_link'        => 'nullable|string|max:255',
            'cta2_text'        => 'nullable|string|max:80',
            'cta2_link'        => 'nullable|string|max:255',
            'background_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'use_gradient'     => 'boolean',
            'use_animation'    => 'boolean',
        ];
    }
}

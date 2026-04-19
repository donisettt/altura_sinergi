<?php

namespace App\Http\Requests\Footer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFooterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'description'             => 'nullable|string|max:500',
            'nav_links'               => 'nullable|array',
            'nav_links.*.label'       => 'required_with:nav_links|string|max:80',
            'nav_links.*.url'         => 'required_with:nav_links|string|max:255',
            'social_media'            => 'nullable|array',
            'social_media.*.platform' => 'required_with:social_media|string|max:50',
            'social_media.*.url'      => 'required_with:social_media|string|max:255',
            'social_media.*.icon'     => 'nullable|string|max:50',
            'legal_links'             => 'nullable|array',
            'legal_links.*.label'     => 'required_with:legal_links|string|max:80',
            'legal_links.*.url'       => 'required_with:legal_links|string|max:255',
            'copyright_text'          => 'nullable|string|max:200',
        ];
    }
}

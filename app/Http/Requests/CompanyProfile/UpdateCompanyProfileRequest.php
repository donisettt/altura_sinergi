<?php

namespace App\Http\Requests\CompanyProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'description' => 'nullable|string',
            'vision'      => 'nullable|string',
            'mission'     => 'nullable|array',
            'mission.*'   => 'string|max:300',
            'stats'       => 'nullable|array',
            'stats.*.label'=> 'string|max:50',
            'stats.*.value'=> 'string|max:30',
        ];
    }
}

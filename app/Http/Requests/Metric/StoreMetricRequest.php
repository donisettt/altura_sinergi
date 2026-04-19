<?php

namespace App\Http\Requests\Metric;

use Illuminate\Foundation\Http\FormRequest;

class StoreMetricRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'     => 'required|string|max:50',
            'subtitle'  => 'nullable|string|max:100',
            'icon'      => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ];
    }
}

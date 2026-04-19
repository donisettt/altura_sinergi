<?php

namespace App\Http\Requests\ValueProposition;

use Illuminate\Foundation\Http\FormRequest;

class StoreValuePropositionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'          => 'required|string|max:120',
            'description'    => 'nullable|string|max:500',
            'icon'           => 'nullable|string|max:50',
            'highlight_text' => 'nullable|string|max:100',
            'is_active'      => 'boolean',
        ];
    }
}

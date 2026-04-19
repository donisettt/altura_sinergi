<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:120',
            'logo'      => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'category'  => 'required|in:BUMN,Swasta,Pemerintah,Lainnya',
            'is_active' => 'boolean',
        ];
    }
}

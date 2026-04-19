<?php

namespace App\Http\Requests\Profile;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorized by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'email'  => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:3072'], // 3MB Max
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'name.required'  => 'Nama profil wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique'   => 'Email tersebut sudah terdaftar pada akun lain.',
            'avatar.image'   => 'File yang diunggah harus berupa gambar.',
            'avatar.max'     => 'Ukuran gambar maksimal adalah 3MB.',
        ];
    }
}

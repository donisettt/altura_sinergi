<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class PasswordUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', Password::defaults(), 'confirmed'],
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'current_password.required'         => 'Sandi saat ini wajib diisi.',
            'current_password.current_password' => 'Sandi saat ini yang Anda masukkan salah.',
            'password.required'                 => 'Sandi baru wajib diisi.',
            'password.confirmed'                => 'Konfirmasi sandi baru tidak cocok.',
        ];
    }
}

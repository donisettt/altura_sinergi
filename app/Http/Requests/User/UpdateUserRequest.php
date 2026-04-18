<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', "unique:users,email,{$userId}"],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'role'     => ['required', 'string', 'exists:roles,name'],
            'is_active'=> ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Nama wajib diisi.',
            'email.required'    => 'Email wajib diisi.',
            'email.unique'      => 'Email sudah digunakan akun lain.',
            'password.confirmed'=> 'Konfirmasi password tidak cocok.',
            'role.required'     => 'Role wajib dipilih.',
        ];
    }
}

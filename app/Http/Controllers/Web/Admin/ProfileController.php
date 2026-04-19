<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\PasswordUpdateRequest;
use App\Http\Requests\Profile\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Admin/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status'          => session('status'),
            'user'            => [
                'name'       => $request->user()->name,
                'email'      => $request->user()->email,
                'avatar_url' => $request->user()->avatar_url,
                'avatar'     => $request->user()->avatar, // The raw DB path
                'roles'      => $request->user()->roles->pluck('name'),
            ],
        ]);
    }

    /**
     * Update the user's profile information and avatar.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle Avatar Upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        // Wait! The user might want to remove the avatar. How?
        // Wait, standard file input doesn't send "null" to delete.
        // We will add a 'remove_avatar' boolean field.
        if ($request->input('remove_avatar') == 'true' || $request->input('remove_avatar') === true) {
             if ($user->avatar) {
                 Storage::disk('public')->delete($user->avatar);
                 $user->avatar = null;
             }
        }

        $user->save();

        return redirect()->route('admin.profile.edit')->with('success', 'Profil Anda berhasil diperbarui.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}

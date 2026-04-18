<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Modules\User\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display the users list.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'status']);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $this->userService->getUsers($filters, 10),
            'stats'   => $this->userService->getStats(),
            'roles'   => $this->userService->getRoles(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the create user form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => $this->userService->getRoles(),
        ]);
    }

    /**
     * Store a new user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Show the edit user form.
     */
    public function edit(int $id): Response
    {
        $user = $this->userService->getUserById($id);

        return Inertia::render('Admin/Users/Edit', [
            'user'  => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'is_active' => $user->is_active,
                'avatar_url'=> $user->avatar_url,
                'role'      => $user->roles->first()?->name,
                'last_login_at' => $user->last_login_at,
                'created_at'    => $user->created_at,
            ],
            'roles' => $this->userService->getRoles(),
        ]);
    }

    /**
     * Update an existing user.
     */
    public function update(UpdateUserRequest $request, int $id): RedirectResponse
    {
        $this->userService->updateUser($id, $request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Delete a user.
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->userService->deleteUser($id);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}

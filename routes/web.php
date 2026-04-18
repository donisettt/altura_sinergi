<?php

use App\Http\Controllers\Web\Admin\DashboardController;
use App\Http\Controllers\Web\Admin\UserController;
use App\Http\Controllers\Web\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'showLogin'])->name('login');
    Route::post('/admin/login', [LoginController::class, 'login'])->name('login.post');
});

// Authenticated Admin Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users
    Route::resource('users', UserController::class)->except(['show']);

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Root redirect
Route::get('/', fn () => redirect()->route('admin.dashboard'));

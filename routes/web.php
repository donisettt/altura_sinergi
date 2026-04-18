<?php

use App\Http\Controllers\Web\Admin\DashboardController;
use App\Http\Controllers\Web\Auth\LoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ------------------------------------------------------------------
// Guest Routes (redirect to dashboard if already authenticated)
// ------------------------------------------------------------------
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'showLogin'])
        ->name('login');

    Route::post('/admin/login', [LoginController::class, 'login'])
        ->name('login.post');
});

// ------------------------------------------------------------------
// Authenticated Admin Routes
// ------------------------------------------------------------------
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
});

// Root redirect
Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

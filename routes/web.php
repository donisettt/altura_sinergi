<?php

use App\Http\Controllers\Web\Admin\CaseStudyController;
use App\Http\Controllers\Web\Admin\ClientController;
use App\Http\Controllers\Web\Admin\CompanyProfileController;
use App\Http\Controllers\Web\Admin\DashboardController;
use App\Http\Controllers\Web\Admin\FooterController;
use App\Http\Controllers\Web\Admin\HeroController;
use App\Http\Controllers\Web\Admin\LeadController;
use App\Http\Controllers\Web\Admin\MetricController;
use App\Http\Controllers\Web\Admin\ProfileController;
use App\Http\Controllers\Web\Admin\SeoController;
use App\Http\Controllers\Web\Admin\ServiceController;
use App\Http\Controllers\Web\Admin\SettingController;
use App\Http\Controllers\Web\Admin\UserController;
use App\Http\Controllers\Web\Admin\ValuePropositionController;
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

    // System Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Users
    Route::resource('users', UserController::class)->except(['show']);

    // Landing Page
    Route::prefix('landing-page')->name('landing-page.')->group(function () {

        // Hero (singleton)
        Route::get('/hero', [HeroController::class, 'show'])->name('hero.show');
        Route::post('/hero', [HeroController::class, 'update'])->name('hero.update');

        // Metrics
        Route::get('/metrics', [MetricController::class, 'index'])->name('metrics.index');
        Route::post('/metrics', [MetricController::class, 'store'])->name('metrics.store');
        Route::put('/metrics/{metric}', [MetricController::class, 'update'])->name('metrics.update');
        Route::delete('/metrics/{metric}', [MetricController::class, 'destroy'])->name('metrics.destroy');
        Route::post('/metrics/reorder', [MetricController::class, 'reorder'])->name('metrics.reorder');

        // Value Propositions
        Route::get('/value-propositions', [ValuePropositionController::class, 'index'])->name('value-propositions.index');
        Route::post('/value-propositions', [ValuePropositionController::class, 'store'])->name('value-propositions.store');
        Route::put('/value-propositions/{valueProposition}', [ValuePropositionController::class, 'update'])->name('value-propositions.update');
        Route::delete('/value-propositions/{valueProposition}', [ValuePropositionController::class, 'destroy'])->name('value-propositions.destroy');
        Route::post('/value-propositions/reorder', [ValuePropositionController::class, 'reorder'])->name('value-propositions.reorder');
    });

    // Services
    Route::resource('services', ServiceController::class)->except(['show']);
    Route::post('services/reorder', [ServiceController::class, 'reorder'])->name('services.reorder');

    // Case Studies
    Route::resource('case-studies', CaseStudyController::class)->except(['show']);

    // Clients
    Route::resource('clients', ClientController::class)->except(['show']);
    Route::post('clients/reorder', [ClientController::class, 'reorder'])->name('clients.reorder');

    // Leads (Mini CRM)
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
    Route::patch('/leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');

    // Company Profile (singleton)
    Route::get('/company-profile', [CompanyProfileController::class, 'show'])->name('company-profile.show');
    Route::post('/company-profile', [CompanyProfileController::class, 'update'])->name('company-profile.update');

    // Footer (singleton)
    Route::get('/footer', [FooterController::class, 'show'])->name('footer.show');
    Route::post('/footer', [FooterController::class, 'update'])->name('footer.update');

    // SEO Settings
    Route::get('/seo', [SeoController::class, 'index'])->name('seo.index');
    Route::post('/seo/{pageKey}', [SeoController::class, 'update'])->name('seo.update');

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Root redirect
Route::get('/', fn () => redirect()->route('admin.dashboard'));


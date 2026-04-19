<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Modules\Setting\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct(
        protected SettingService $settingService
    ) {}

    public function index()
    {
        $settings = $this->settingService->getSettings();
        
        // Expose SMTP config directly from environment to the frontend (read-only mode)
        $envSmtp = [
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'user' => config('mail.mailers.smtp.username'),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'envSmtp'  => $envSmtp,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            // General
            'company_name'     => 'nullable|string|max:255',
            'tagline'          => 'nullable|string|max:255',
            'logo_light'       => 'nullable|image|max:2048',
            'logo_dark'        => 'nullable|image|max:2048',
            'favicon'          => 'nullable|mimes:ico,png,jpg,svg|max:1024',
            'contact_email'    => 'nullable|email|max:255',
            'contact_whatsapp' => 'nullable|string|max:50',
            'office_address'   => 'nullable|string',
            'gmaps_embed'      => 'nullable|string',

            // Removal flags
            'remove_logo_light'=> 'nullable|boolean',
            'remove_logo_dark' => 'nullable|boolean',
            'remove_favicon'   => 'nullable|boolean',

            // Integration
            'ga_id'            => 'nullable|string|max:255',
            'fb_pixel'         => 'nullable|string|max:255',
            'wa_api_link'      => 'nullable|string|max:255',
            'webhook_url'      => 'nullable|url|max:255',

            // Lead
            'notify_email'          => 'nullable|string|max:255',
            'enable_auto_reply'     => 'boolean',
            'redirect_url'          => 'nullable|string|max:255',
            'wa_auto_message'       => 'nullable|string',
        ]);

        $this->settingService->updateSettings($validated);

        return back()->with('success', 'Konfigurasi sistem berhasil diperbarui.');
    }
}

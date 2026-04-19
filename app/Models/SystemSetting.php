<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    /**
     * Because there is only one row, we can just unguard or fillable all form fields.
     */
    protected $fillable = [
        // General
        'company_name',
        'tagline',
        'logo_light',
        'logo_dark',
        'favicon',
        'contact_email',
        'contact_whatsapp',
        'office_address',
        'gmaps_embed',
        
        // Integrations
        'ga_id',
        'fb_pixel',
        'wa_api_link',
        'webhook_url',
        
        // Leads & Notifications
        'notify_email',
        'enable_auto_reply',
        'redirect_url',
        'wa_auto_message',
    ];

    protected $casts = [
        'enable_auto_reply' => 'boolean',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    protected $fillable = [
        'description', 'nav_links', 'social_media', 'legal_links', 'copyright_text',
    ];

    protected $casts = [
        'nav_links'   => 'array',
        'social_media'=> 'array',
        'legal_links' => 'array',
    ];
}

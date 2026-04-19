<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $fillable = [
        'headline', 'subheadline', 'tagline',
        'cta1_text', 'cta1_link', 'cta2_text', 'cta2_link',
        'background_image', 'use_gradient', 'use_animation',
    ];

    protected $casts = [
        'headline'     => 'array',
        'use_gradient' => 'boolean',
        'use_animation'=> 'boolean',
    ];
}

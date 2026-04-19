<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name', 'category', 'description', 'features',
        'image', 'cta_text', 'cta_link', 'badge',
        'show_on_homepage', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'features'         => 'array',
        'show_on_homepage' => 'boolean',
        'is_active'        => 'boolean',
        'sort_order'       => 'integer',
    ];

    public static array $categories = ['IT', 'Electrical', 'SPBU'];
}

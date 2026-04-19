<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $fillable = [
        'title', 'category', 'metric_value', 'metric_label',
        'description', 'location', 'tags', 'image',
        'is_active', 'sort_order',
    ];

    protected $casts = [
        'tags'       => 'array',
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
    ];

    public static array $categories = [
        'Energy Efficiency', 'IT Infrastructure', 'SPBU', 'Electrical', 'Other',
    ];
}

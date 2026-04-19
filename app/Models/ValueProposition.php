<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValueProposition extends Model
{
    protected $fillable = [
        'title', 'description', 'icon', 'highlight_text', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

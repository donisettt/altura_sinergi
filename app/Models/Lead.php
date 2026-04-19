<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name', 'company', 'needs', 'status', 'notes',
        'email', 'phone', 'contacted_at',
    ];

    protected $casts = [
        'contacted_at' => 'datetime',
    ];

    public static array $statuses = ['new', 'contacted', 'deal', 'rejected'];

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'new'       => 'New Lead',
            'contacted' => 'Contacted',
            'deal'      => 'Deal Closed',
            'rejected'  => 'Rejected',
            default     => ucfirst($this->status),
        };
    }
}

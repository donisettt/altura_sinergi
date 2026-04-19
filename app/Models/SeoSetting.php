<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $fillable = [
        'page_key', 'title', 'meta_description', 'og_image', 'keywords',
    ];

    public static array $pages = [
        'home'      => 'Home / Landing Page',
        'services'  => 'Services',
        'about'     => 'About / Company Profile',
        'contact'   => 'Contact',
        'blog'      => 'Blog',
    ];
}

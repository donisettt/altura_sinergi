<?php

namespace App\Modules\Seo\Services;

use App\Models\SeoSetting;
use App\Services\BaseService;

class SeoService extends BaseService
{
    public function getAllPages(): array
    {
        $existing = SeoSetting::all()->keyBy('page_key')->toArray();
        $pages    = [];

        foreach (SeoSetting::$pages as $key => $label) {
            $pages[$key] = array_merge(
                ['page_key' => $key, 'label' => $label, 'title' => '', 'meta_description' => '', 'og_image' => '', 'keywords' => ''],
                $existing[$key] ?? []
            );
        }

        return $pages;
    }

    public function update(string $pageKey, array $data): SeoSetting
    {
        return SeoSetting::updateOrCreate(
            ['page_key' => $pageKey],
            $data
        );
    }
}

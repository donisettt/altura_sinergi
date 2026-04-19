<?php

namespace App\Modules\Footer\Services;

use App\Models\FooterSetting;
use App\Services\BaseService;

class FooterService extends BaseService
{
    public function getSetting(): array
    {
        $footer = FooterSetting::first();
        return $footer ? $footer->toArray() : [
            'description'    => '',
            'nav_links'      => [],
            'social_media'   => [],
            'legal_links'    => [],
            'copyright_text' => '',
        ];
    }

    public function update(array $data): FooterSetting
    {
        $footer = FooterSetting::first();
        if ($footer) {
            $footer->update($data);
            return $footer->fresh();
        }
        return FooterSetting::create($data);
    }
}

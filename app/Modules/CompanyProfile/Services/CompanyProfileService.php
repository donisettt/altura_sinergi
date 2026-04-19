<?php

namespace App\Modules\CompanyProfile\Services;

use App\Models\CompanyProfile;
use App\Services\BaseService;

class CompanyProfileService extends BaseService
{
    public function getSetting(): array
    {
        $profile = CompanyProfile::first();
        return $profile ? $profile->toArray() : [
            'description' => '',
            'vision'      => '',
            'mission'     => [],
            'stats'       => [],
        ];
    }

    public function update(array $data): CompanyProfile
    {
        $profile = CompanyProfile::first();
        if ($profile) {
            $profile->update($data);
            return $profile->fresh();
        }
        return CompanyProfile::create($data);
    }
}

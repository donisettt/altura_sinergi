<?php

namespace App\Modules\Setting\Repositories;

use App\Models\SystemSetting;

class SettingRepository
{
    /**
     * Get the single settings record or create an empty one.
     */
    public function getSettings(): SystemSetting
    {
        return SystemSetting::firstOrCreate([]);
    }

    /**
     * Update the settings record.
     */
    public function updateSettings(SystemSetting $setting, array $data): SystemSetting
    {
        $setting->update($data);
        return $setting;
    }
}

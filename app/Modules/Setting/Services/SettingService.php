<?php

namespace App\Modules\Setting\Services;

use App\Models\SystemSetting;
use App\Modules\Setting\Repositories\SettingRepository;
use App\Services\BaseService;
use Illuminate\Support\Facades\Storage;

class SettingService extends BaseService
{
    public function __construct(
        protected SettingRepository $settingRepository
    ) {}

    public function getSettings(): SystemSetting
    {
        return $this->settingRepository->getSettings();
    }

    public function updateSettings(array $data): SystemSetting
    {
        $setting = $this->getSettings();

        // Array of image fields we want to check for uploading
        $imageFields = ['logo_light', 'logo_dark', 'favicon'];

        foreach ($imageFields as $field) {
            // Check if file is uploaded
            if (isset($data[$field]) && is_file($data[$field])) {
                // Delete old file
                if ($setting->$field) {
                     Storage::disk('public')->delete($setting->$field);
                }
                $data[$field] = $data[$field]->store('settings', 'public');
            } elseif (isset($data["remove_{$field}"]) && filter_var($data["remove_{$field}"], FILTER_VALIDATE_BOOLEAN)) {
                // Check if user requested removal
                if ($setting->$field) {
                     Storage::disk('public')->delete($setting->$field);
                }
                $data[$field] = null;
            } else {
                // If it isn't a new file and isn't being removed, don't overwrite it with null/string
                unset($data[$field]);
            }
        }

        return $this->settingRepository->updateSettings($setting, $data);
    }
}

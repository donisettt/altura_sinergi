<?php

namespace App\Modules\LandingPage\Hero\Repositories\Contracts;

interface HeroRepositoryInterface
{
    public function getSetting(): ?\App\Models\HeroSetting;
    public function updateOrCreate(array $data): \App\Models\HeroSetting;
}

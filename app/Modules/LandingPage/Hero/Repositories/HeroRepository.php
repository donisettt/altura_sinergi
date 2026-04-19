<?php

namespace App\Modules\LandingPage\Hero\Repositories;

use App\Models\HeroSetting;
use App\Modules\LandingPage\Hero\Repositories\Contracts\HeroRepositoryInterface;
use App\Repositories\BaseRepository;

class HeroRepository extends BaseRepository implements HeroRepositoryInterface
{
    public function __construct(HeroSetting $model)
    {
        parent::__construct($model);
    }

    public function getSetting(): ?HeroSetting
    {
        return HeroSetting::first();
    }

    public function updateOrCreate(array $data): HeroSetting
    {
        $hero = HeroSetting::first();
        if ($hero) {
            $hero->update($data);
            return $hero->fresh();
        }
        return HeroSetting::create($data);
    }
}

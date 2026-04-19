<?php

namespace App\Modules\LandingPage\Hero\Services;

use App\Modules\LandingPage\Hero\Repositories\Contracts\HeroRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class HeroService extends BaseService
{
    public function __construct(
        protected HeroRepositoryInterface $repo
    ) {}

    public function getSetting(): array
    {
        $hero = $this->repo->getSetting();
        return $hero ? $hero->toArray() : [];
    }

    public function update(array $data, ?UploadedFile $image = null): array
    {
        if ($image) {
            // Remove old image
            $old = $this->repo->getSetting();
            if ($old?->background_image) {
                Storage::disk('public')->delete($old->background_image);
            }
            $data['background_image'] = $image->store('hero', 'public');
        }

        $hero = $this->repo->updateOrCreate($data);
        return $hero->toArray();
    }
}

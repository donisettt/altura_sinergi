<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hero\UpdateHeroRequest;
use App\Modules\LandingPage\Hero\Services\HeroService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    public function __construct(protected HeroService $service) {}

    public function show(): Response
    {
        return Inertia::render('Admin/LandingPage/Hero/Index', [
            'hero' => $this->service->getSetting(),
        ]);
    }

    public function update(UpdateHeroRequest $request): RedirectResponse
    {
        $data  = $request->except('background_image');
        $image = $request->file('background_image');

        // Cast booleans
        $data['use_gradient']  = $request->boolean('use_gradient');
        $data['use_animation'] = $request->boolean('use_animation');

        $this->service->update($data, $image);

        return back()->with('success', 'Hero section berhasil diperbarui.');
    }
}

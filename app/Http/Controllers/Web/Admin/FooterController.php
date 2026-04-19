<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Footer\UpdateFooterRequest;
use App\Modules\Footer\Services\FooterService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FooterController extends Controller
{
    public function __construct(protected FooterService $service) {}

    public function show(): Response
    {
        return Inertia::render('Admin/Footer/Index', [
            'footer' => $this->service->getSetting(),
        ]);
    }

    public function update(UpdateFooterRequest $request): RedirectResponse
    {
        $this->service->update($request->validated());
        return back()->with('success', 'Footer berhasil diperbarui.');
    }
}

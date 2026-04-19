<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyProfile\UpdateCompanyProfileRequest;
use App\Modules\CompanyProfile\Services\CompanyProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends Controller
{
    public function __construct(protected CompanyProfileService $service) {}

    public function show(): Response
    {
        return Inertia::render('Admin/CompanyProfile/Index', [
            'profile' => $this->service->getSetting(),
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request): RedirectResponse
    {
        $this->service->update($request->validated());
        return back()->with('success', 'Company profile berhasil diperbarui.');
    }
}

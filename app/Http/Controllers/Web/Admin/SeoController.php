<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seo\UpdateSeoRequest;
use App\Models\SeoSetting;
use App\Modules\Seo\Services\SeoService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function __construct(protected SeoService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Seo/Index', [
            'pages'   => $this->service->getAllPages(),
            'pageMap' => SeoSetting::$pages,
        ]);
    }

    public function update(UpdateSeoRequest $request, string $pageKey): RedirectResponse
    {
        $this->service->update($pageKey, $request->validated());
        return back()->with('success', 'SEO settings berhasil diperbarui.');
    }
}

<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CmsService\StoreServiceRequest;
use App\Http\Requests\CmsService\UpdateServiceRequest;
use App\Models\Service;
use App\Modules\CmsService\Services\ServiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(protected ServiceService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Services/Index', [
            'services'   => $this->service->getAll(),
            'categories' => Service::$categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Services/Create', [
            'categories' => Service::$categories,
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $data = $request->except('image');
        $data['show_on_homepage'] = $request->boolean('show_on_homepage');
        $data['is_active']        = $request->boolean('is_active', true);
        $this->service->create($data, $request->file('image'));
        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function edit(int $service): Response
    {
        return Inertia::render('Admin/Services/Edit', [
            'service'    => $this->service->findById($service),
            'categories' => Service::$categories,
        ]);
    }

    public function update(UpdateServiceRequest $request, int $service): RedirectResponse
    {
        $data = $request->except('image');
        $data['show_on_homepage'] = $request->boolean('show_on_homepage');
        $data['is_active']        = $request->boolean('is_active', true);
        $this->service->update($service, $data, $request->file('image'));
        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(int $service): RedirectResponse
    {
        $this->service->delete($service);
        return back()->with('success', 'Layanan berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $this->service->reorder($request->input('ids'));
        return back()->with('success', 'Urutan berhasil disimpan.');
    }
}

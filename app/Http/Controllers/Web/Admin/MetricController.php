<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Metric\StoreMetricRequest;
use App\Http\Requests\Metric\UpdateMetricRequest;
use App\Modules\LandingPage\Metric\Services\MetricService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MetricController extends Controller
{
    public function __construct(protected MetricService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/LandingPage/Metrics/Index', [
            'metrics' => $this->service->getAll(),
        ]);
    }

    public function store(StoreMetricRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->create($data);
        return back()->with('success', 'Metric berhasil ditambahkan.');
    }

    public function update(UpdateMetricRequest $request, int $metric): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->update($metric, $data);
        return back()->with('success', 'Metric berhasil diperbarui.');
    }

    public function destroy(int $metric): RedirectResponse
    {
        $this->service->delete($metric);
        return back()->with('success', 'Metric berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $this->service->reorder($request->input('ids'));
        return back()->with('success', 'Urutan berhasil disimpan.');
    }
}

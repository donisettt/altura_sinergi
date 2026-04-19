<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValueProposition\StoreValuePropositionRequest;
use App\Http\Requests\ValueProposition\UpdateValuePropositionRequest;
use App\Modules\LandingPage\ValueProposition\Services\ValuePropositionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValuePropositionController extends Controller
{
    public function __construct(protected ValuePropositionService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/LandingPage/ValueProposition/Index', [
            'items' => $this->service->getAll(),
        ]);
    }

    public function store(StoreValuePropositionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->create($data);
        return back()->with('success', 'Value proposition berhasil ditambahkan.');
    }

    public function update(UpdateValuePropositionRequest $request, int $valueProposition): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->update($valueProposition, $data);
        return back()->with('success', 'Value proposition berhasil diperbarui.');
    }

    public function destroy(int $valueProposition): RedirectResponse
    {
        $this->service->delete($valueProposition);
        return back()->with('success', 'Value proposition berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $this->service->reorder($request->input('ids'));
        return back()->with('success', 'Urutan berhasil disimpan.');
    }
}

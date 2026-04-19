<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lead\UpdateLeadRequest;
use App\Modules\Lead\Services\LeadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function __construct(protected LeadService $service) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);
        return Inertia::render('Admin/Leads/Index', [
            'leads'    => $this->service->paginate($filters, 15),
            'stats'    => $this->service->getStats(),
            'statuses' => \App\Models\Lead::$statuses,
            'filters'  => $filters,
        ]);
    }

    public function show(int $lead): Response
    {
        return Inertia::render('Admin/Leads/Show', [
            'lead'     => $this->service->findById($lead),
            'statuses' => \App\Models\Lead::$statuses,
        ]);
    }

    public function update(UpdateLeadRequest $request, int $lead): RedirectResponse
    {
        $this->service->updateStatus(
            $lead,
            $request->input('status'),
            $request->input('notes')
        );
        return back()->with('success', 'Status lead berhasil diperbarui.');
    }

    public function destroy(int $lead): RedirectResponse
    {
        $this->service->delete($lead);
        return redirect()->route('admin.leads.index')->with('success', 'Lead berhasil dihapus.');
    }
}

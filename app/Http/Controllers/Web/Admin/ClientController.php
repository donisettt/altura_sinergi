<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Models\Client;
use App\Modules\Client\Services\ClientService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(protected ClientService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Clients/Index', [
            'clients'    => $this->service->getAll(),
            'categories' => Client::$categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Clients/Create', [
            'categories' => Client::$categories,
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $data = $request->except('logo');
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->create($data, $request->file('logo'));
        return redirect()->route('admin.clients.index')->with('success', 'Client berhasil ditambahkan.');
    }

    public function edit(int $client): Response
    {
        return Inertia::render('Admin/Clients/Edit', [
            'client'     => $this->service->getAll()->find($client),
            'categories' => Client::$categories,
        ]);
    }

    public function update(UpdateClientRequest $request, int $client): RedirectResponse
    {
        $data = $request->except('logo');
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->update($client, $data, $request->file('logo'));
        return redirect()->route('admin.clients.index')->with('success', 'Client berhasil diperbarui.');
    }

    public function destroy(int $client): RedirectResponse
    {
        $this->service->delete($client);
        return back()->with('success', 'Client berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        $this->service->reorder($request->input('ids'));
        return back()->with('success', 'Urutan berhasil disimpan.');
    }
}

<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaseStudy\StoreCaseStudyRequest;
use App\Http\Requests\CaseStudy\UpdateCaseStudyRequest;
use App\Models\CaseStudy;
use App\Modules\CaseStudy\Services\CaseStudyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CaseStudyController extends Controller
{
    public function __construct(protected CaseStudyService $service) {}

    public function index(\Illuminate\Http\Request $request): Response
    {
        $filters = $request->only(['search', 'category']);
        return Inertia::render('Admin/CaseStudies/Index', [
            'caseStudies' => $this->service->paginate($filters, 12),
            'categories'  => CaseStudy::$categories,
            'filters'     => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/CaseStudies/Create', [
            'categories' => CaseStudy::$categories,
        ]);
    }

    public function store(StoreCaseStudyRequest $request): RedirectResponse
    {
        $data = $request->except('image');
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->create($data, $request->file('image'));
        return redirect()->route('admin.case-studies.index')->with('success', 'Case study berhasil ditambahkan.');
    }

    public function edit(int $caseStudy): Response
    {
        return Inertia::render('Admin/CaseStudies/Edit', [
            'caseStudy'  => $this->service->findById($caseStudy),
            'categories' => CaseStudy::$categories,
        ]);
    }

    public function update(UpdateCaseStudyRequest $request, int $caseStudy): RedirectResponse
    {
        $data = $request->except('image');
        $data['is_active'] = $request->boolean('is_active', true);
        $this->service->update($caseStudy, $data, $request->file('image'));
        return redirect()->route('admin.case-studies.index')->with('success', 'Case study berhasil diperbarui.');
    }

    public function destroy(int $caseStudy): RedirectResponse
    {
        $this->service->delete($caseStudy);
        return back()->with('success', 'Case study berhasil dihapus.');
    }
}

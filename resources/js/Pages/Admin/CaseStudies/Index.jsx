import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, BarChart, Search, MapPin, Tag as TagIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { StatusBadge } from '@/Components/cms/StatusBadge';

const CATEGORY_COLORS = {
    'Energy Efficiency': 'text-success bg-success/10',
    'IT Infrastructure':  'text-primary bg-primary/10',
    'SPBU':               'text-warning bg-warning/10',
    'Electrical':         'text-orange-400 bg-orange-400/10',
};

export default function CaseStudiesIndex({ caseStudies, categories = [], filters = {} }) {
    const flash  = usePage().props.flash ?? {};
    const [search, setSearch] = useState(filters.search ?? '');
    const [catFilter, setCat] = useState(filters.category ?? '');

    const handleFilter = (newSearch, newCat) => {
        router.get(route('admin.case-studies.index'), {
            search: newSearch,
            category: newCat,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus case study ini?')) return;
        router.delete(route('admin.case-studies.destroy', id), { preserveScroll: true });
    };

    const data = caseStudies?.data ?? [];
    const meta = caseStudies?.meta ?? {};

    return (
        <AdminLayout>
            <Head title="Case Studies" />

            <PageHeader
                title="Case Studies"
                subtitle="Manajemen studi kasus dan hasil proyek"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Case Studies' },
                ]}
                actions={
                    <Link href={route('admin.case-studies.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                        <Plus size={15} /> Tambah Case Study
                    </Link>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">✓ {flash.success}</div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); handleFilter(e.target.value, catFilter); }}
                        placeholder="Cari case study..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all"
                    />
                </div>
                <select value={catFilter} onChange={e => { setCat(e.target.value); handleFilter(search, e.target.value); }}
                    className="px-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 appearance-none">
                    <option value="">Semua Kategori</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Grid Cards */}
            {data.length === 0 ? (
                <div className="card p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BarChart size={28} className="text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">Belum ada case study</p>
                        <p className="text-sm text-text-muted mt-1">Tambahkan studi kasus proyek Anda</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.map(cs => (
                        <div key={cs.id} className="card overflow-hidden group hover:border-primary/30 transition-colors">
                            {/* Image */}
                            <div className="h-40 relative overflow-hidden bg-bg-hover">
                                {cs.image
                                    ? <img src={`/storage/${cs.image}`} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    : <div className="w-full h-full flex items-center justify-center"><BarChart size={40} className="text-text-muted/30" /></div>
                                }
                                {/* Metric badge */}
                                {cs.metric_value && (
                                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                                        <p className="text-lg font-bold text-success">{cs.metric_value}</p>
                                        <p className="text-[10px] text-white/70">{cs.metric_label}</p>
                                    </div>
                                )}
                                {/* Active badge */}
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={cs.is_active ? 'active' : 'inactive'} />
                                </div>
                            </div>

                            <div className="p-4">
                                {cs.category && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cs.category] ?? 'bg-bg-hover text-text-muted'}`}>
                                        {cs.category}
                                    </span>
                                )}
                                <h3 className="font-semibold text-sm text-text-primary mt-2 mb-1 line-clamp-2">{cs.title}</h3>
                                {cs.location && (
                                    <p className="text-xs text-text-muted flex items-center gap-1 mb-2">
                                        <MapPin size={10} /> {cs.location}
                                    </p>
                                )}
                                {cs.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {cs.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-hover text-text-muted">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-3 border-t border-border">
                                    <Link href={route('admin.case-studies.edit', cs.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors">
                                        <Edit2 size={12} /> Edit
                                    </Link>
                                    <button type="button" onClick={() => handleDelete(cs.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors">
                                        <Trash2 size={12} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {caseStudies?.links && (
                <div className="mt-5 flex justify-center gap-1">
                    {caseStudies.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${link.active ? 'bg-primary text-white' : 'border border-border text-text-secondary hover:border-primary/40 disabled:opacity-40'}`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}

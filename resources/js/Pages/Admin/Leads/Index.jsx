import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Eye, Trash2, Mail, Phone, Building, Calendar, Filter } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { StatusBadge } from '@/Components/cms/StatusBadge';

export default function LeadsIndex({ leads, stats, statuses, filters }) {
    const flash = usePage().props.flash ?? {};
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatus] = useState(filters.status ?? '');

    const handleFilter = (newSearch, newStatus) => {
        router.get(route('admin.leads.index'), {
            search: newSearch,
            status: newStatus,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus lead ini permanen?')) return;
        router.delete(route('admin.leads.destroy', id), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Leads (CRM)" />
            <PageHeader
                title="Leads (CRM)"
                subtitle="Kelola pesan / inquiry dari form landing page"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Leads' },
                ]}
            />

            {flash.success && <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 text-success text-sm">✓ {flash.success}</div>}

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="card p-4">
                    <p className="text-xs font-semibold text-text-muted uppercase mb-1">Total Leads</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="card p-4 border-l-4 border-l-primary/60">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">New</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.new}</p>
                </div>
                <div className="card p-4 border-l-4 border-l-warning/60">
                    <p className="text-xs font-semibold text-warning uppercase mb-1">Contacted</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.contacted}</p>
                </div>
                <div className="card p-4 border-l-4 border-l-success/60">
                    <p className="text-xs font-semibold text-success uppercase mb-1">Deal Closed</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.deal}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); handleFilter(e.target.value, statusFilter); }}
                        placeholder="Cari nama, email, perusahaan..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all"
                    />
                </div>
                <div className="relative shrink-0 w-full sm:w-48">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <select
                        value={statusFilter}
                        onChange={e => { setStatus(e.target.value); handleFilter(search, e.target.value); }}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 appearance-none transition-all"
                    >
                        <option value="">Semua Status</option>
                        {Object.entries(statuses).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-bg-card text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            <th className="p-4">Lead / Date</th>
                            <th className="p-4 hidden md:table-cell">Kontak</th>
                            <th className="p-4 hidden lg:table-cell">Perusahaan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm text-text-primary">
                        {leads.data.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-text-muted">Tidak ada lead ditemukan.</td>
                            </tr>
                        ) : leads.data.map(lead => (
                            <tr key={lead.id} className="hover:bg-bg-hover transition-colors">
                                <td className="p-4">
                                    <p className="font-semibold">{lead.name}</p>
                                    <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                                        <Calendar size={10} /> {new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <div className="space-y-1 text-xs">
                                        <p className="flex items-center gap-1.5 text-text-secondary"><Mail size={12} className="text-text-muted" /> {lead.email}</p>
                                        {lead.phone && <p className="flex items-center gap-1.5 text-text-secondary"><Phone size={12} className="text-text-muted" /> {lead.phone}</p>}
                                    </div>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                    <p className="flex items-center gap-1.5 text-text-secondary">
                                        <Building size={12} className="text-text-muted" /> {lead.company || '-'}
                                    </p>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={lead.status} />
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Link href={route('admin.leads.show', lead.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Lihat Detail">
                                            <Eye size={14} />
                                        </Link>
                                        <button onClick={() => handleDelete(lead.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:bg-error/10 hover:text-error transition-colors" title="Hapus">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {leads.links && leads.links.length > 3 && (
                <div className="mt-4 flex justify-end gap-1">
                    {leads.links.map((link, i) => (
                        <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${link.active ? 'bg-primary text-white' : 'border border-border text-text-secondary hover:border-primary/40 disabled:opacity-40'}`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}

import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, Building, Calendar, MessageSquare, Save, UserCheck, AlertCircle } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { StatusBadge } from '@/Components/cms/StatusBadge';

export default function LeadsShow({ lead, statuses }) {
    const flash = usePage().props.flash ?? {};
    const { data, setData, patch, processing } = useForm({
        status: lead.status,
        notes:  lead.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.leads.update', lead.id));
    };

    const formatDate = (ds) => {
        if (!ds) return '-';
        return new Date(ds).toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title={`Lead: ${lead.name}`} />
            <PageHeader
                title="Detail Lead"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Leads', href: route('admin.leads.index') },
                    { label: 'Detail' },
                ]}
                actions={
                    <Link href={route('admin.leads.index')} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary border border-border hover:border-primary/40 rounded-lg transition-colors">
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            {flash.success && <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 text-success text-sm max-w-5xl">✓ {flash.success}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                {/* Left - Detail Info */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="card p-6">
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <User size={16} className="text-primary" /> Informasi Lead
                            </h2>
                            <StatusBadge status={lead.status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                            <div>
                                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><User size={12} /> Nama Lengkap</p>
                                <p className="text-sm font-medium text-text-primary">{lead.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><Mail size={12} /> Email</p>
                                <a href={`mailto:${lead.email}`} className="text-sm font-medium text-primary hover:underline">{lead.email}</a>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><Phone size={12} /> No. Telepon</p>
                                <p className="text-sm font-medium text-text-primary">{lead.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><Building size={12} /> Perusahaan</p>
                                <p className="text-sm font-medium text-text-primary">{lead.company || '-'}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5"><MessageSquare size={12} /> Subjek</p>
                                <p className="text-sm font-medium text-text-primary">{lead.subject || '-'}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-border">
                            <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wider">Pesan / Inquiry</p>
                            <div className="p-4 bg-bg-main border border-border rounded-xl">
                                <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{lead.message || <span className="text-text-muted italic">Tidak ada pesan.</span>}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - CRM Actions */}
                <div className="space-y-5">
                    <div className="card p-6 border-t-4 border-t-primary">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
                            <UserCheck size={16} className="text-primary" /> Update Status Lead
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1.5">Status Proses</label>
                                <select
                                    value={data.status} onChange={e => setData('status', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60"
                                >
                                    {Object.entries(statuses).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1.5">Catatan Internal (Notes)</label>
                                <textarea
                                    value={data.notes} onChange={e => setData('notes', e.target.value)} rows={4}
                                    placeholder="Tulis log aktivitas atau hasil meeting di sini..."
                                    className="w-full px-3 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-none"
                                />
                                <p className="text-[10px] text-text-muted mt-1 float-right">Hanya dapat dilihat oleh admin</p>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full py-2.5 mt-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20">
                                {processing ? 'Menyimpan...' : <><Save size={15} /> Simpan Catatan & Status</>}
                            </button>
                        </form>
                    </div>

                    <div className="card p-5 bg-bg-hover/50">
                        <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                            <AlertCircle size={14} className="text-text-muted" /> Meta Data
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-text-muted">Waktu Masuk (Created)</p>
                                <p className="text-xs font-medium text-text-secondary">{formatDate(lead.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted">Terakhir Update</p>
                                <p className="text-xs font-medium text-text-secondary">{formatDate(lead.updated_at)}</p>
                            </div>
                            {lead.contacted_at && (
                                <div>
                                    <p className="text-[10px] text-text-muted">Mulai Dihubungi</p>
                                    <p className="text-xs font-medium text-primary">{formatDate(lead.contacted_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

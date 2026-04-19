import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Tag, Link as LinkIcon, Globe } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { ImageUpload } from '@/Components/cms/ImageUpload';
import { DynamicList } from '@/Components/cms/DynamicList';

function Field({ label, error, children, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">{label} {required && <span className="text-error">*</span>}</label>
            {children}
            {error && <p className="text-xs text-error">⚠ {error}</p>}
        </div>
    );
}

function Input({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />}
            <input className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all`} {...props} />
        </div>
    );
}

function Toggle({ label, description, checked, onChange }) {
    return (
        <label className="flex items-center justify-between gap-4 cursor-pointer py-2.5">
            <div>
                <p className="text-sm font-medium text-text-primary">{label}</p>
                {description && <p className="text-xs text-text-muted">{description}</p>}
            </div>
            <div className="relative shrink-0">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all" />
            </div>
        </label>
    );
}

export default function ServicesEdit({ service, categories = [] }) {
    const flash = usePage().props.flash ?? {};
    const { data, setData, post, processing, errors } = useForm({
        _method:          'PUT',
        name:             service.name             ?? '',
        category:         service.category         ?? 'IT',
        description:      service.description      ?? '',
        features:         service.features         ?? [],
        image:            null,
        cta_text:         service.cta_text         ?? '',
        cta_link:         service.cta_link         ?? '',
        badge:            service.badge            ?? '',
        show_on_homepage: service.show_on_homepage ?? false,
        is_active:        service.is_active        ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.services.update', service.id), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`Edit — ${service.name}`} />

            <PageHeader
                title={`Edit: ${service.name}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Services', href: route('admin.services.index') },
                    { label: 'Edit' },
                ]}
                actions={
                    <Link href={route('admin.services.index')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border hover:border-primary/40 rounded-lg transition-colors">
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">✓ {flash.success}</div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Informasi Dasar</h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field label="Nama Layanan" error={errors.name} required>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                    </Field>
                                    <Field label="Kategori" error={errors.category} required>
                                        <div className="relative">
                                            <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                            <select value={data.category} onChange={e => setData('category', e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 appearance-none">
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </Field>
                                </div>

                                <Field label="Deskripsi" error={errors.description}>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                        rows={4} className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-none" />
                                </Field>
                                <Field label="Badge" error={errors.badge}>
                                    <Input value={data.badge} onChange={e => setData('badge', e.target.value)} placeholder="Core Service" />
                                </Field>
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Feature List</h2>
                            <DynamicList items={data.features} onChange={val => setData('features', val)} placeholder="Tambah fitur..." />
                        </div>

                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Gambar Layanan</h2>
                            {service.image && (
                                <div className="mb-3 flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-hover">
                                    <img src={`/storage/${service.image}`} alt="" className="w-16 h-12 object-cover rounded" />
                                    <div>
                                        <p className="text-xs text-text-secondary">Gambar saat ini</p>
                                        <p className="text-xs text-text-muted">{service.image}</p>
                                    </div>
                                </div>
                            )}
                            <ImageUpload onChange={file => setData('image', file)} label="Ganti gambar (opsional)" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border flex items-center gap-2">
                                <LinkIcon size={14} className="text-primary" /> CTA Button
                            </h2>
                            <div className="space-y-4">
                                <Field label="Button Text" error={errors.cta_text}>
                                    <Input value={data.cta_text} onChange={e => setData('cta_text', e.target.value)} placeholder="Lihat Detail" />
                                </Field>
                                <Field label="Link URL" error={errors.cta_link}>
                                    <Input icon={Globe} value={data.cta_link} onChange={e => setData('cta_link', e.target.value)} placeholder="/layanan/it" />
                                </Field>
                            </div>
                        </div>

                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">Visibilitas</h2>
                            <div className="divide-y divide-border">
                                <Toggle label="Aktif" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                <Toggle label="Tampil di Homepage" description="Ditampilkan di section services" checked={data.show_on_homepage} onChange={e => setData('show_on_homepage', e.target.checked)} />
                            </div>
                        </div>

                        <div className="card p-5 flex flex-col gap-3">
                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20">
                                {processing
                                    ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Menyimpan...</>
                                    : <><Save size={15} /> Simpan Perubahan</>
                                }
                            </button>
                            <Link href={route('admin.services.index')}
                                className="w-full flex items-center justify-center py-2.5 text-sm text-text-secondary border border-border hover:border-primary/30 rounded-lg transition-colors">
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

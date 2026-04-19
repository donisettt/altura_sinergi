import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, BarChart } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { ImageUpload } from '@/Components/cms/ImageUpload';
import { DynamicList } from '@/Components/cms/DynamicList';

function Field({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">{label}</label>
            {children}
            {error && <p className="text-xs text-error">⚠ {error}</p>}
        </div>
    );
}

function Input(props) {
    return <input className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/60 transition-all" {...props} />;
}

export default function CaseStudiesCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title:        '',
        category:     '',
        metric_value: '',
        metric_label: '',
        description:  '',
        location:     '',
        tags:         [],
        image:        null,
        is_active:    true,
    });

    return (
        <AdminLayout>
            <Head title="Tambah Case Study" />
            <PageHeader
                title="Tambah Case Study"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Case Studies', href: route('admin.case-studies.index') },
                    { label: 'Tambah' },
                ]}
                actions={
                    <Link href={route('admin.case-studies.index')}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary border border-border hover:border-primary/40 rounded-lg transition-colors">
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            <form onSubmit={e => { e.preventDefault(); post(route('admin.case-studies.store'), { forceFormData: true }); }} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border flex items-center gap-2">
                                <BarChart size={14} className="text-primary" /> Informasi Proyek
                            </h2>
                            <div className="space-y-5">
                                <Field label="Judul *" error={errors.title}>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Implementasi SCADA SPBU Jawa Tengah" />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field label="Kategori" error={errors.category}>
                                        <select value={data.category} onChange={e => setData('category', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 appearance-none">
                                            <option value="">Pilih kategori</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Lokasi Proyek" error={errors.location}>
                                        <Input value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Jawa Tengah, Indonesia" />
                                    </Field>
                                </div>
                                <Field label="Deskripsi Hasil" error={errors.description}>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                        rows={4} placeholder="Hasil yang dicapai dari proyek ini..."
                                        className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-none" />
                                </Field>
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Metric Utama</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Nilai Metric" error={errors.metric_value}>
                                    <Input value={data.metric_value} onChange={e => setData('metric_value', e.target.value)} placeholder="+25%" />
                                </Field>
                                <Field label="Label Metric" error={errors.metric_label}>
                                    <Input value={data.metric_label} onChange={e => setData('metric_label', e.target.value)} placeholder="Energy Saved" />
                                </Field>
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Tags</h2>
                            <DynamicList items={data.tags} onChange={val => setData('tags', val)} placeholder="Tambah tag..." maxItems={8} />
                        </div>

                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Gambar</h2>
                            <ImageUpload onChange={file => setData('image', file)} label="Upload gambar proyek" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">Status</h2>
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Aktif</p>
                                    <p className="text-xs text-text-muted">Tampilkan di halaman</p>
                                </div>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only peer" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                    <div className="w-11 h-6 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                                    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all" />
                                </div>
                            </label>
                        </div>

                        <div className="card p-5 flex flex-col gap-3">
                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20">
                                {processing
                                    ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Menyimpan...</>
                                    : <><Save size={15} /> Simpan</>
                                }
                            </button>
                            <Link href={route('admin.case-studies.index')}
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

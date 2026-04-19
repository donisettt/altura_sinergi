import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { ImageUpload } from '@/Components/cms/ImageUpload';

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
    return <input className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all" {...props} />;
}

export default function ClientsCreate({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name:      '',
        category:  categories[0] ?? '',
        logo:      null,
        is_active: true,
    });

    return (
        <AdminLayout>
            <Head title="Tambah Client" />
            <PageHeader
                title="Tambah Client"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Clients', href: route('admin.clients.index') },
                    { label: 'Tambah' },
                ]}
                actions={
                    <Link href={route('admin.clients.index')}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary border border-border hover:border-primary/40 rounded-lg transition-colors">
                        <ArrowLeft size={14} /> Kembali
                    </Link>
                }
            />

            <form onSubmit={e => { e.preventDefault(); post(route('admin.clients.store'), { forceFormData: true }); }} encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                    <div className="card p-6 space-y-5">
                        <h2 className="text-sm font-semibold text-text-primary pb-3 border-b border-border flex items-center gap-2">
                            <Building2 size={14} className="text-primary" /> Info Client
                        </h2>
                        <Field label="Nama Perusahaan *" error={errors.name}>
                            <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="PT Pertamina (Persero)" />
                        </Field>
                        <Field label="Kategori" error={errors.category}>
                            <select value={data.category} onChange={e => setData('category', e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 appearance-none">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <label className="flex items-center justify-between cursor-pointer pt-3">
                            <div>
                                <p className="text-sm font-medium text-text-primary">Tampilkan</p>
                                <p className="text-xs text-text-muted">Muncul di landing page</p>
                            </div>
                            <div className="relative">
                                <input type="checkbox" className="sr-only peer" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                <div className="w-11 h-6 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all" />
                            </div>
                        </label>
                    </div>

                    <div className="space-y-5">
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">Logo Perusahaan</h2>
                            <ImageUpload onChange={file => setData('logo', file)} label="Upload Logo (PNG transparan disarankan)" accept="image/*, image/svg+xml" />
                            {errors.logo && <p className="text-xs text-error mt-1">⚠ {errors.logo}</p>}
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20">
                            {processing ? 'Menyimpan...' : <><Save size={15} /> Simpan Client</>}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

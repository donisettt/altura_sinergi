import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Save, Search, Globe, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { ImageUpload } from '@/Components/cms/ImageUpload';
import { cn } from '@/lib/utils';

export default function SeoIndex({ pages, pageMap }) {
    const flash = usePage().props.flash ?? {};
    const pageKeys = Object.keys(pageMap);
    const [activeTab, setActiveTab] = useState(pageKeys[0]);

    // Track active page data
    const activeData = pages[activeTab] || {};

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title:            activeData.title || '',
        meta_description: activeData.meta_description || '',
        keywords:         activeData.keywords || '',
        og_image:         null,
    });

    // Reset form when tab changes
    useEffect(() => {
        const newData = pages[activeTab] || {};
        setData({
            title:            newData.title || '',
            meta_description: newData.meta_description || '',
            keywords:         newData.keywords || '',
            og_image:         null,
        });
        clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, pages]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.seo.update', activeTab), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="SEO Settings" />
            <PageHeader
                title="SEO & Metadata"
                subtitle="Optimisasi mesin pencari untuk setiap halaman website"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'SEO Settings' },
                ]}
            />

            {flash.success && <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 text-success text-sm max-w-5xl">✓ {flash.success}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 max-w-5xl">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">Pilih Halaman</p>
                    {pageKeys.map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={cn(
                                'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                                activeTab === key
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-bg-card hover:bg-bg-hover text-text-secondary border border-border'
                            )}
                        >
                            <span>{pageMap[key]}</span>
                            <span className={cn('w-2 h-2 rounded-full', pages[key]?.title ? 'bg-success' : 'bg-text-muted/30')} />
                        </button>
                    ))}

                    <div className="mt-5 p-4 rounded-xl bg-warning/10 border border-warning/20">
                        <p className="text-xs text-warning font-semibold flex items-center gap-1.5 mb-2">
                            <Search size={14} /> Tips SEO
                        </p>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                            Pastikan meta title panjangnya ideal (50-60 karakter) & meta description cukup persuasif (150-160 karakter) untuk meningkatkan CTR di Google.
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3">
                    <form onSubmit={submit} className="card p-6 border-t-4 border-t-primary">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <Globe size={18} className="text-primary" /> {pageMap[activeTab]}
                                </h2>
                                <p className="text-xs text-text-muted mt-1">Konfigurasi meta tags untuk halaman ini</p>
                            </div>
                            <button type="submit" disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20">
                                {processing ? 'Menyimpan...' : <><Save size={15} /> Simpan SEO</>}
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Meta Title */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Meta Title</label>
                                    <span className={cn('text-xs', (data.title?.length || 0) > 60 ? 'text-warning' : 'text-text-muted')}>
                                        {data.title?.length || 0} / 60
                                    </span>
                                </div>
                                <input
                                    value={data.title} onChange={e => setData('title', e.target.value)}
                                    placeholder="Altura Sinergi — Smart Infrastructure Solutions"
                                    className="w-full px-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60"
                                />
                                {errors.title && <p className="text-xs text-error mt-1">⚠ {errors.title}</p>}
                            </div>

                            {/* Meta Description */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Meta Description</label>
                                    <span className={cn('text-xs', (data.meta_description?.length || 0) > 160 ? 'text-warning' : 'text-text-muted')}>
                                        {data.meta_description?.length || 0} / 160
                                    </span>
                                </div>
                                <textarea
                                    value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={3}
                                    placeholder="Penyedia layanan infrastruktur terintegrasi meliputi IT, SPBU, dan Electrical..."
                                    className="w-full px-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-none"
                                />
                                {errors.meta_description && <p className="text-xs text-error mt-1">⚠ {errors.meta_description}</p>}
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="text-sm font-medium text-text-secondary mb-1.5 block">Keywords (opsional)</label>
                                <input
                                    value={data.keywords} onChange={e => setData('keywords', e.target.value)}
                                    placeholder="infrastruktur IT, kontraktor SPBU, sistem electrical"
                                    className="w-full px-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60"
                                />
                                <p className="text-xs text-text-muted mt-1">Pisahkan dengan koma.</p>
                                {errors.keywords && <p className="text-xs text-error mt-1">⚠ {errors.keywords}</p>}
                            </div>

                            {/* OG Image */}
                            <div className="pt-4 border-t border-border">
                                <label className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                                    <ImageIcon size={15} /> Social Preview Image (OG Image)
                                </label>
                                <div className="flex gap-4 items-start">
                                    <div className="w-48 shrink-0">
                                        <ImageUpload onChange={file => setData('og_image', file)} label="Upload OG Image" accept="image/jpeg, image/png, image/webp" maxMB={2} />
                                        {errors.og_image && <p className="text-xs text-error mt-1">⚠ {errors.og_image}</p>}
                                    </div>
                                    <div className="flex-1 bg-bg-main border border-border rounded-lg p-4">
                                        <p className="text-xs font-semibold text-text-muted uppercase mb-3">Google Preview Mockup</p>
                                        <div className="max-w-md">
                                            <p className="text-sm text-blue-400 font-medium truncate mb-0.5">{data.title || 'Judul Halaman akan muncul di sini'}</p>
                                            <p className="text-xs text-green-500 truncate mb-1">https://alturasinergi.com/{activeTab === 'home' ? '' : activeTab}</p>
                                            <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                                                {data.meta_description || 'Deskripsi singkat halaman yang akan terlihat oleh pengguna saat mereka mencari di Google. Usahakan menarik dan relevan.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {activeData.og_image && !data.og_image && (
                                    <p className="text-xs text-text-muted mt-2 inline-flex items-center gap-1.5 bg-bg-hover px-2 py-1 rounded">
                                        ✓ Sudah ada gambar OG terpasang (<a href={`/storage/${activeData.og_image}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">Lihat</a>)
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}

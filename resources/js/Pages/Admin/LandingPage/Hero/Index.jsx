import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Save, Eye, EyeOff, Globe, Zap, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { RichTextEditor } from '@/Components/cms/RichTextEditor';
import { ImageUpload } from '@/Components/cms/ImageUpload';

function ToggleField({ label, description, checked, onChange }) {
    return (
        <label className="flex items-center justify-between gap-4 cursor-pointer py-3">
            <div>
                <p className="text-sm font-medium text-text-primary">{label}</p>
                {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
            </div>
            <div className="relative shrink-0">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all" />
            </div>
        </label>
    );
}

function Field({ label, error, children, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
                {label} {required && <span className="text-error">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-error flex items-center gap-1">⚠ {error}</p>}
        </div>
    );
}

function TextInput({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />}
            <input
                className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all`}
                {...props}
            />
        </div>
    );
}

export default function HeroIndex({ hero = {} }) {
    const flash = usePage().props.flash ?? {};

    const { data, setData, post, processing, errors } = useForm({
        headline:          hero.headline ?? null,
        subheadline:       hero.subheadline ?? '',
        tagline:           hero.tagline ?? '',
        cta1_text:         hero.cta1_text ?? '',
        cta1_link:         hero.cta1_link ?? '',
        cta2_text:         hero.cta2_text ?? '',
        cta2_link:         hero.cta2_link ?? '',
        background_image:  null,
        use_gradient:      hero.use_gradient ?? true,
        use_animation:     hero.use_animation ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.landing-page.hero.update'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Hero Section" />

            <PageHeader
                title="Hero Section"
                subtitle="Kelola tampilan utama landing page"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Landing Page' },
                    { label: 'Hero' },
                ]}
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
                    ✓ {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left — Main Content */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Headline */}
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border flex items-center gap-2">
                                <Zap size={15} className="text-primary" /> Headline & Tagline
                            </h2>
                            <div className="space-y-5">
                                <Field label="Headline (Rich Text — supports color highlight)" error={errors.headline} required>
                                    <RichTextEditor
                                        value={data.headline}
                                        onChange={(val) => setData('headline', val)}
                                        placeholder="Smart Solution for your Infrastructure..."
                                    />
                                    <p className="text-xs text-text-muted mt-1">
                                        Gunakan toolbar highlight (🟡 🔵 🟢) untuk mewarnai kata-kata spesifik
                                    </p>
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Subheadline" error={errors.subheadline}>
                                        <TextInput
                                            placeholder="We deliver excellence in..."
                                            value={data.subheadline}
                                            onChange={(e) => setData('subheadline', e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Tagline kecil" error={errors.tagline}>
                                        <TextInput
                                            placeholder="Smart Infrastructure Indonesia"
                                            value={data.tagline}
                                            onChange={(e) => setData('tagline', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border flex items-center gap-2">
                                <LinkIcon size={15} className="text-primary" /> Call to Action Buttons
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-4 rounded-lg border border-border space-y-3">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">CTA Primary</p>
                                    <Field label="Button Text" error={errors.cta1_text}>
                                        <TextInput
                                            placeholder="Hubungi Kami"
                                            value={data.cta1_text}
                                            onChange={(e) => setData('cta1_text', e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Link URL" error={errors.cta1_link}>
                                        <TextInput
                                            icon={Globe}
                                            placeholder="/kontakt atau https://..."
                                            value={data.cta1_link}
                                            onChange={(e) => setData('cta1_link', e.target.value)}
                                        />
                                    </Field>
                                </div>
                                <div className="p-4 rounded-lg border border-border space-y-3">
                                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">CTA Secondary</p>
                                    <Field label="Button Text" error={errors.cta2_text}>
                                        <TextInput
                                            placeholder="Lihat Layanan"
                                            value={data.cta2_text}
                                            onChange={(e) => setData('cta2_text', e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Link URL" error={errors.cta2_link}>
                                        <TextInput
                                            icon={Globe}
                                            placeholder="/layanan atau https://..."
                                            value={data.cta2_link}
                                            onChange={(e) => setData('cta2_link', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* Background Image */}
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border flex items-center gap-2">
                                <ImageIcon size={15} className="text-primary" /> Background Image
                            </h2>
                            <ImageUpload
                                value={hero.background_image}
                                onChange={(file) => setData('background_image', file)}
                                label="Upload background hero"
                                maxMB={3}
                            />
                        </div>
                    </div>

                    {/* Right — Settings & Save */}
                    <div className="space-y-5">
                        {/* Visual Options */}
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">
                                Visual Options
                            </h2>
                            <div className="divide-y divide-border">
                                <ToggleField
                                    label="Gunakan Gradient"
                                    description="Overlay gradient warna di atas background"
                                    checked={data.use_gradient}
                                    onChange={(e) => setData('use_gradient', e.target.checked)}
                                />
                                <ToggleField
                                    label="Aktifkan Animasi"
                                    description="Animated particle / floating elements"
                                    checked={data.use_animation}
                                    onChange={(e) => setData('use_animation', e.target.checked)}
                                />
                            </div>
                        </div>

                        {/* Preview Info */}
                        <div className="card p-5" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Eye size={14} className="text-white" />
                                </div>
                                <p className="text-sm font-semibold text-white">Preview Info</p>
                            </div>
                            <div className="space-y-2 text-xs text-white/70">
                                <p>• Gradient: <span className="text-white font-medium">{data.use_gradient ? 'Aktif' : 'Nonaktif'}</span></p>
                                <p>• Animasi: <span className="text-white font-medium">{data.use_animation ? 'Aktif' : 'Nonaktif'}</span></p>
                                <p>• CTA 1: <span className="text-white font-medium">{data.cta1_text || '—'}</span></p>
                                <p>• CTA 2: <span className="text-white font-medium">{data.cta2_text || '—'}</span></p>
                            </div>
                        </div>

                        {/* Save */}
                        <div className="card p-5 flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
                            >
                                {processing
                                    ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Menyimpan...</>
                                    : <><Save size={15} /> Simpan Perubahan</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

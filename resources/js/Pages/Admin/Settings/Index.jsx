import { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Link2, Bell, MapPin, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/Components/cms/ImageUpload';

export default function Index({ settings, envSmtp }) {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('general');

    const form = useForm({
        // General
        company_name: settings?.company_name || '',
        tagline: settings?.tagline || '',
        logo_light: null,
        remove_logo_light: false,
        logo_dark: null,
        remove_logo_dark: false,
        favicon: null,
        remove_favicon: false,
        contact_email: settings?.contact_email || '',
        contact_whatsapp: settings?.contact_whatsapp || '',
        office_address: settings?.office_address || '',
        gmaps_embed: settings?.gmaps_embed || '',

        // Integration
        ga_id: settings?.ga_id || '',
        fb_pixel: settings?.fb_pixel || '',
        wa_api_link: settings?.wa_api_link || 'https://api.whatsapp.com/send',
        webhook_url: settings?.webhook_url || '',

        // Leads
        notify_email: settings?.notify_email || '',
        enable_auto_reply: settings?.enable_auto_reply || false,
        redirect_url: settings?.redirect_url || '',
        wa_auto_message: settings?.wa_auto_message || '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => alert('Berhasil menyimpan konfigurasi Settings!'),
        });
    };

    const tabs = [
        { id: 'general', label: 'General Settings', icon: SettingsIcon, description: 'Identitas & Info Perusahaan' },
        { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Analytics, SMTP & Webhooks' },
        { id: 'leads', label: 'Leads & Notifications', icon: Bell, description: 'Notifikasi & CRM Auto-reply' },
    ];

    return (
        <AdminLayout>
            <Head title="System Settings" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Konfigurasi terpusat untuk profil perusahaan dan integrasi aplikasi.
                    </p>
                </div>
                <button
                    onClick={submit}
                    disabled={form.processing}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-brand-blue-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    <Save size={18} /> {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Menu / Tabs */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left border border-transparent',
                                activeTab === tab.id 
                                    ? 'bg-bg-hover text-text-primary border-border shadow-sm ring-1 ring-primary/20' 
                                    : 'text-text-secondary hover:bg-bg-hover/50 hover:text-text-primary'
                            )}
                        >
                            <div className={cn(
                                'p-2 rounded-lg shrink-0 transition-colors',
                                activeTab === tab.id ? 'bg-primary text-white' : 'bg-bg-card border border-border text-text-muted'
                            )}>
                                <tab.icon size={18} />
                            </div>
                            <div>
                                <h3 className={cn('text-sm font-semibold', activeTab === tab.id ? 'text-primary' : '')}>{tab.label}</h3>
                                <p className="text-[11px] text-text-muted mt-0.5 leading-tight tracking-tight">{tab.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Form Content Panel */}
                <div className="flex-1 card p-6 lg:p-8">
                    <form id="settings-form" onSubmit={submit}>

                        {/* ================= GENERAL ================= */}
                        <div className={activeTab === 'general' ? 'block space-y-8' : 'hidden'}>
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Identitas Dasar</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Nama Perusahaan</label>
                                        <input
                                            type="text"
                                            value={form.data.company_name}
                                            onChange={e => form.setData('company_name', e.target.value)}
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Tagline Utama</label>
                                        <input
                                            type="text"
                                            value={form.data.tagline}
                                            onChange={e => form.setData('tagline', e.target.value)}
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Aset Visual Grafis</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <ImageUpload
                                        label="Logo (Mode Terang)"
                                        value={settings?.logo_light}
                                        onChange={(file) => {
                                            form.setData('logo_light', file);
                                            form.setData('remove_logo_light', file === null);
                                        }}
                                    />
                                    <ImageUpload
                                        label="Logo (Mode Gelap)"
                                        value={settings?.logo_dark}
                                        onChange={(file) => {
                                            form.setData('logo_dark', file);
                                            form.setData('remove_logo_dark', file === null);
                                        }}
                                    />
                                    <ImageUpload
                                        label="Favicon Bintik"
                                        accept=".ico,.png,.jpg"
                                        value={settings?.favicon}
                                        onChange={(file) => {
                                            form.setData('favicon', file);
                                            form.setData('remove_favicon', file === null);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Info Kontak Eksternal</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Resmi</label>
                                        <input
                                            type="email"
                                            value={form.data.contact_email}
                                            onChange={e => form.setData('contact_email', e.target.value)}
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">WhatsApp Admin</label>
                                        <input
                                            type="text"
                                            value={form.data.contact_whatsapp}
                                            onChange={e => form.setData('contact_whatsapp', e.target.value)}
                                            placeholder="Contoh: 62812345678"
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-2 relative">
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Alamat Kantor Lengkap</label>
                                        <MapPin size={16} className="absolute left-3 top-9 text-text-muted" />
                                        <textarea
                                            rows="3"
                                            value={form.data.office_address}
                                            onChange={e => form.setData('office_address', e.target.value)}
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 pl-9 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Google Maps Embed <span className="text-xs font-normal text-text-muted ml-2">(Raw Iframe)</span></h2>
                                <div>
                                    <textarea
                                        rows="4"
                                        value={form.data.gmaps_embed}
                                        onChange={e => form.setData('gmaps_embed', e.target.value)}
                                        placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                                        className="w-full font-mono text-sm bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-text-muted mt-1.5">Minta URL Iframe langsung dari situs Google Maps (Share {'>'} Embed a map).</p>
                                </div>
                                {form.data.gmaps_embed && form.data.gmaps_embed.includes('<iframe') && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-border relative h-[250px] bg-bg-hover">
                                        <div className="w-full h-full pointer-events-none" dangerouslySetInnerHTML={{ __html: form.data.gmaps_embed }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ================= INTEGRATIONS ================= */}
                        <div className={activeTab === 'integrations' ? 'block space-y-8' : 'hidden'}>
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Analytics & Trackers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">ID Google Analytics (G-TAG)</label>
                                        <input
                                            type="text"
                                            value={form.data.ga_id}
                                            onChange={e => form.setData('ga_id', e.target.value)}
                                            placeholder="G-XXXXXXXXXX"
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Meta / Facebook Pixel ID <span className="text-xs font-normal text-text-muted">(Optional)</span></label>
                                        <input
                                            type="text"
                                            value={form.data.fb_pixel}
                                            onChange={e => form.setData('fb_pixel', e.target.value)}
                                            placeholder="XXXXXXXXXXXXXXXX"
                                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Komunikasi (API Konfigurasi)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border bg-bg-hover p-4 rounded-xl">
                                    <div className="col-span-full mb-2">
                                        <h3 className="text-sm font-bold text-text-primary">Email SMTP (Read-Only)</h3>
                                        <p className="text-xs text-text-muted text-balance mt-0.5">Pengaturan SMTP direferensikan langsung secara tertutup melalui File konfigurasi <code>.env</code> eksternal server Anda (Laravel Env) agar aman dari risiko pencurian kredensial di Database.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Host & Port</label>
                                        <div className="text-sm font-semibold text-text-secondary font-mono">{envSmtp?.host}:{envSmtp?.port}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Authenticated Email</label>
                                        <div className="text-sm font-semibold text-text-secondary">{envSmtp?.user}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">WhatsApp Tautan / Gateway API Link</label>
                                    <input
                                        type="url"
                                        value={form.data.wa_api_link}
                                        onChange={e => form.setData('wa_api_link', e.target.value)}
                                        className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary text-sm font-mono"
                                    />
                                    <p className="text-xs text-text-muted mt-1.5">Default bawaan: <code>https://api.whatsapp.com/send</code>, rubah bila menggunakan gateway 3rd-party.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">Tools Lanjutan</h2>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">CRM Endpoint / Outbound Webhook <span className="text-error text-xs">*</span></label>
                                    <input
                                        type="url"
                                        value={form.data.webhook_url}
                                        onChange={e => form.setData('webhook_url', e.target.value)}
                                        placeholder="https://hook.endpoint.com/receive"
                                        className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= LEADS & NOTIFICATIONS ================= */}
                        <div className={activeTab === 'leads' ? 'block space-y-8' : 'hidden'}>
                            
                            <div className="card p-5 bg-gradient-to-br from-bg-card to-bg-hover border-l-4 border-primary">
                                <h3 className="text-sm font-bold text-text-primary mb-1">Manajemen Alur Prospek Bisnis (Leads Workflow)</h3>
                                <p className="text-xs text-text-secondary">Atur sistem pelacakan (tracking) respons otomatis manakala ada klien yang mensubmit pengajuan/inquiry Form masuk.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Penampung Notifikasi Pipeline Baru Masuk</label>
                                    <input
                                        type="email"
                                        value={form.data.notify_email}
                                        onChange={e => form.setData('notify_email', e.target.value)}
                                        placeholder="sales@perusahaan.com"
                                        className="w-full md:w-2/3 bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <label className="flex items-start gap-3 p-4 bg-bg-hover rounded-xl border border-border cursor-pointer">
                                    <div className="pt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={form.data.enable_auto_reply}
                                            onChange={(e) => form.setData('enable_auto_reply', e.target.checked)}
                                            className="w-4 h-4 text-primary bg-bg-main border-border rounded focus:ring-primary focus:ring-2"
                                        />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-text-primary">E-Mail Auto-Reply (Balasan Otomatis)</span>
                                        <span className="block text-xs text-text-muted mt-1 text-balance">Bila diaktifkan, pengguna/klien yang mengajukan form lead akan serta-merta mendapatkan salinan email balasan yang menandakan ajuan sukses terkirim.</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-text-primary border-b border-border pb-2">WhatsApp Redirect Response</h2>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">URL / Slug Pengalihan Pascakirim (Redirect After Submit)</label>
                                    <input
                                        type="text"
                                        value={form.data.redirect_url}
                                        onChange={e => form.setData('redirect_url', e.target.value)}
                                        placeholder="/thank-you"
                                        className="w-full md:w-2/3 bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Pesan Teks Otomatis WhatsApp (Greeting API Message)</label>
                                    <textarea
                                        rows="4"
                                        value={form.data.wa_auto_message}
                                        onChange={e => form.setData('wa_auto_message', e.target.value)}
                                        placeholder="Halo! Saya mensubmit inquiry di web Anda, ingin berdiskusi perihal layanan..."
                                        className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Layers, Plus, X, GripVertical } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Field({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">{label}</label>
            {children}
            {error && <p className="text-xs text-error">⚠ {error}</p>}
        </div>
    );
}

function SortablePair({ id, item, onUpdate, onRemove, labelPlaceholder1 = "Label", labelPlaceholder2 = "URL / Nilai", isSocial }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-bg-card border border-border p-2 rounded-lg group">
            <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary hidden sm:block pl-1 shrink-0">
                <GripVertical size={16} />
            </button>
            <div className="flex-1 flex gap-2 w-full pl-2 sm:pl-0">
                <input
                    value={isSocial ? item.platform : item.label}
                    onChange={e => onUpdate(isSocial ? { ...item, platform: e.target.value } : { ...item, label: e.target.value })}
                    placeholder={labelPlaceholder1}
                    className="w-1/3 px-3 py-1.5 text-sm bg-bg-main border border-border rounded focus:outline-none focus:border-primary/60"
                />
                <input
                    value={item.url}
                    onChange={e => onUpdate({ ...item, url: e.target.value })}
                    placeholder={labelPlaceholder2}
                    className="flex-1 px-3 py-1.5 text-sm bg-bg-main border border-border rounded focus:outline-none focus:border-primary/60"
                />
            </div>
            <button type="button" onClick={onRemove} className="w-8 h-8 flex items-center justify-center shrink-0 rounded text-text-muted hover:bg-error/10 hover:text-error transition-colors sm:opacity-0 group-hover:opacity-100">
                <X size={14} />
            </button>
        </div>
    );
}

function KeyValueEditor({ items, onChange, maxItems = 10, placeholder1, placeholder2, isSocial = false }) {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const tempItems = items.map((s, i) => ({ ...s, _id: s._id || `kv-${Date.now()}-${i}` }));

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIdx = tempItems.findIndex(i => i._id === active.id);
        const newIdx = tempItems.findIndex(i => i._id === over.id);
        const reordered = arrayMove(tempItems, oldIdx, newIdx);
        onChange(cleanTemp(reordered));
    };

    const cleanTemp = (arr) => arr.map(({ _id, ...rest }) => rest);

    const update = (id, newObj) => {
        onChange(cleanTemp(tempItems.map(s => s._id === id ? newObj : s)));
    };

    const remove = (id) => {
        onChange(cleanTemp(tempItems.filter(s => s._id !== id)));
    };

    const add = () => {
        if (tempItems.length >= maxItems) return;
        const base = isSocial ? { platform: '', url: '' } : { label: '', url: '' };
        onChange([...cleanTemp(tempItems), base]);
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tempItems.map(i => i._id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {tempItems.map(item => (
                            <SortablePair key={item._id} id={item._id} item={item} onUpdate={(val) => update(item._id, val)} onRemove={() => remove(item._id)} labelPlaceholder1={placeholder1} labelPlaceholder2={placeholder2} isSocial={isSocial} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {tempItems.length < maxItems && (
                <button type="button" onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors w-max">
                    <Plus size={14} /> Tambah Link
                </button>
            )}
        </div>
    );
}


export default function FooterIndex({ footer }) {
    const flash = usePage().props.flash ?? {};
    const { data, setData, post, processing, errors } = useForm({
        description:    footer.description    || '',
        nav_links:      footer.nav_links      || [],
        social_media:   footer.social_media   || [],
        legal_links:    footer.legal_links    || [],
        copyright_text: footer.copyright_text || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.footer.update'));
    };

    return (
        <AdminLayout>
            <Head title="Footer Settings" />
            <PageHeader
                title="Footer Layout"
                subtitle="Informasi, tautan, dan social media di bagian bawah website"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Footer' },
                ]}
                actions={
                    <button type="submit" form="footer-form" disabled={processing}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-60">
                        {processing ? 'Menyimpan...' : <><Save size={15} /> Simpan Footer</>}
                    </button>
                }
            />

            {flash.success && <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 text-success text-sm max-w-5xl">✓ {flash.success}</div>}

            <form id="footer-form" onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl">

                <div className="space-y-5">
                    {/* Basic Info */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2 pb-3 border-b border-border">
                            <Layers size={15} className="text-primary" /> Informasi Utama
                        </h2>
                        <div className="space-y-5">
                            <Field label="Deskripsi Singkat Footer" error={errors.description}>
                                <textarea
                                    value={data.description} onChange={e => setData('description', e.target.value)} rows={3}
                                    className="w-full px-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60"
                                    placeholder="Jelaskan secara singkat nilai perusahaan Anda di footer..."
                                />
                            </Field>
                            <Field label="Copyright Teks" error={errors.copyright_text}>
                                <input
                                    value={data.copyright_text} onChange={e => setData('copyright_text', e.target.value)}
                                    className="w-full px-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60"
                                    placeholder="© 2026 Altura Sinergi. All rights reserved."
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Sosial Media</h2>
                        <KeyValueEditor
                            items={data.social_media}
                            onChange={val => setData('social_media', val)}
                            placeholder1="Platform (Instagram, LinkedIn)"
                            placeholder2="https://..."
                            maxItems={5}
                            isSocial={true}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Quick Links */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Quick Navigation</h2>
                        <p className="text-xs text-text-muted mb-4">Tautan cepat di kolom navigasi footer.</p>
                        <KeyValueEditor
                            items={data.nav_links}
                            onChange={val => setData('nav_links', val)}
                            placeholder1="Label Link"
                            placeholder2="URL (misal: /tentang-kami)"
                        />
                    </div>

                    {/* Legal Links */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Legal Links</h2>
                        <p className="text-xs text-text-muted mb-4">Kebijakan privasi, syarat dan ketentuan.</p>
                        <KeyValueEditor
                            items={data.legal_links}
                            onChange={val => setData('legal_links', val)}
                            placeholder1="Privacy Policy"
                            placeholder2="/privacy"
                        />
                    </div>
                </div>

            </form>
        </AdminLayout>
    );
}

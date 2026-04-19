import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Save, Building2, Eye, Plus, X, GripVertical } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { RichTextEditor } from '@/Components/cms/RichTextEditor';
import { DynamicList } from '@/Components/cms/DynamicList';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Field({ label, error, children, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">{label} {required && <span className="text-error">*</span>}</label>
            {children}
            {error && <p className="text-xs text-error">⚠ {error}</p>}
        </div>
    );
}

function SortableStat({ id, stat, onUpdate, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-bg-card border border-border p-3 rounded-lg group">
            <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary hidden sm:block shrink-0">
                <GripVertical size={16} />
            </button>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                <input value={stat.value} onChange={e => onUpdate({ ...stat, value: e.target.value })} placeholder="100+" className="w-full px-3 py-1.5 text-sm bg-bg-main border border-border rounded focus:outline-none focus:border-primary/60 transition-colors" />
                <input value={stat.label} onChange={e => onUpdate({ ...stat, label: e.target.value })} placeholder="Klien Nasional" className="w-full px-3 py-1.5 text-sm bg-bg-main border border-border rounded focus:outline-none focus:border-primary/60 transition-colors" />
            </div>
            <button type="button" onClick={onRemove} className="w-8 h-8 flex items-center justify-center shrink-0 rounded text-text-muted hover:bg-error/10 hover:text-error transition-colors sm:opacity-0 group-hover:opacity-100">
                <X size={14} />
            </button>
        </div>
    );
}

function StatsEditor({ stats, onChange }) {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    // assign temp ids
    const items = stats.map((s, i) => ({ ...s, _id: s._id || `stat-${Date.now()}-${i}` }));

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIdx = items.findIndex(i => i._id === active.id);
        const newIdx = items.findIndex(i => i._id === over.id);
        const reordered = arrayMove(items, oldIdx, newIdx);
        onChange(reordered.map(({ label, value }) => ({ label, value }))); // strip _id
    };

    const update = (id, newStat) => {
        const next = items.map(s => s._id === id ? newStat : s);
        onChange(next.map(({ label, value }) => ({ label, value })));
    };

    const remove = (id) => {
        const next = items.filter(s => s._id !== id);
        onChange(next.map(({ label, value }) => ({ label, value })));
    };

    const add = () => {
        if (items.length >= 6) return;
        onChange([...items.map(({ label, value }) => ({ label, value })), { label: '', value: '' }]);
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map(stat => (
                            <SortableStat key={stat._id} id={stat._id} stat={stat} onUpdate={(val) => update(stat._id, val)} onRemove={() => remove(stat._id)} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {items.length < 6 && (
                <button type="button" onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors w-max">
                    <Plus size={14} /> Tambah Angka
                </button>
            )}
        </div>
    );
}

export default function CompanyProfileIndex({ profile }) {
    const flash = usePage().props.flash ?? {};
    const { data, setData, post, processing, errors } = useForm({
        description: profile.description || '',
        vision:      profile.vision || '',
        mission:     profile.mission || [],
        stats:       profile.stats || [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.company-profile.update'));
    };

    return (
        <AdminLayout>
            <Head title="Company Profile" />
            <PageHeader
                title="Company Profile"
                subtitle="Tentang perusahaan, visi, misi, dan angka penting"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Company Profile' },
                ]}
                actions={
                    <button type="submit" form="profile-form" disabled={processing}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-60">
                        {processing ? 'Menyimpan...' : <><Save size={15} /> Simpan Profil</>}
                    </button>
                }
            />

            {flash.success && <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm max-w-5xl">✓ {flash.success}</div>}

            <form id="profile-form" onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
                <div className="lg:col-span-2 space-y-5">
                    {/* Deskripsi */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2 pb-3 border-b border-border">
                            <Building2 size={15} className="text-primary" /> Deskripsi Perusahaan
                        </h2>
                        <Field label="Teks Utama (Tentang Kami)" error={errors.description}>
                            <textarea
                                value={data.description} onChange={e => setData('description', e.target.value)} rows={6}
                                placeholder="Jelaskan secara singkat tentang perusahaan..."
                                className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-y"
                            />
                        </Field>
                    </div>

                    {/* Visi Misi */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">Visi & Misi</h2>
                        <div className="space-y-6">
                            <Field label="Visi Perusahaan (Rich Text)" error={errors.vision}>
                                <RichTextEditor value={data.vision} onChange={val => setData('vision', val)} placeholder="Menjadi pionir penyedia infrastruktur terintegrasi..." />
                            </Field>
                            <Field label="Misi Perusahaan (List)" error={errors.mission}>
                                <DynamicList items={data.mission} onChange={val => setData('mission', val)} placeholder="Tuliskan misi..." maxItems={10} />
                            </Field>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Stats */}
                    <div className="card p-5">
                        <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">Company Numbers</h2>
                        <p className="text-xs text-text-muted mb-4">Angka-angka pencapaian yang tampil di profil / tentang kami.</p>
                        <StatsEditor stats={data.stats} onChange={val => setData('stats', val)} />
                        {errors.stats && <p className="text-xs text-error mt-2">⚠ Format stats tidak valid.</p>}
                    </div>

                    <div className="card bg-bg-hover/50 p-5 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2 text-text-primary">
                            <Eye size={14} className="text-text-muted" /> <span className="font-semibold text-sm">Pratinjau</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pt-1">
                            Data ini akan terhubung langsung dengan komponen <strong>About Us</strong> di halaman depan.
                            Pastikan kalimat yang digunakan persuasif dan menonjolkan keunggulan utama perusahaan.
                        </p>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

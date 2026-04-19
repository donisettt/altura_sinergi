import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus, GripVertical, Edit2, Trash2, Check, Star, ToggleLeft, ToggleRight,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';

const PRESET_ICONS = ['Star', 'Shield', 'Zap', 'Globe', 'TrendingUp', 'CheckCircle', 'Award', 'Target', 'Cpu', 'BarChart2'];

function SortableVP({ item, onEdit, onDelete, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style}
            className="flex items-start gap-3 p-5 rounded-xl border border-border bg-bg-card hover:border-primary/30 transition-colors group"
        >
            <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary shrink-0 mt-1">
                <GripVertical size={16} />
            </button>

            {/* Icon bubble */}
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Star size={16} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                    {item.highlight_text && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/15 text-warning font-semibold">{item.highlight_text}</span>
                    )}
                </div>
                <p className="text-xs text-text-muted line-clamp-2">{item.description}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onToggle(item)}
                    className={`transition-colors ${item.is_active ? 'text-success' : 'text-text-muted'}`}>
                    {item.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button type="button" onClick={() => onEdit(item)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                    <Edit2 size={14} />
                </button>
                <button type="button" onClick={() => onDelete(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

function VPForm({ initial = {}, onSave, onCancel }) {
    const [form, setForm] = useState({
        title:          initial.title          ?? '',
        description:    initial.description    ?? '',
        icon:           initial.icon           ?? '',
        highlight_text: initial.highlight_text ?? '',
        is_active:      initial.is_active      ?? true,
    });

    return (
        <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Solusi Terintegrasi" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Highlight Text (badge)</label>
                    <input value={form.highlight_text} onChange={e => setForm(f => ({ ...f, highlight_text: e.target.value }))}
                        placeholder="Most Popular" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Kami menyediakan solusi infrastruktur yang..."
                    className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 resize-none transition-all" />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Icon (Lucide name)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {PRESET_ICONS.map(ic => (
                        <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${form.icon === ic ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-primary/40'}`}>
                            {ic}
                        </button>
                    ))}
                </div>
                <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="Star" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                    <input type="checkbox" className="sr-only peer" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    <div className="w-9 h-5 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-4 transition-all" />
                </div>
                <span className="text-sm text-text-secondary">Tampilkan di landing page</span>
            </label>

            <div className="flex gap-2">
                <button type="button" disabled={!form.title} onClick={() => onSave(form)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                    <Check size={14} /> Simpan
                </button>
                <button type="button" onClick={onCancel}
                    className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                    Batal
                </button>
            </div>
        </div>
    );
}

export default function ValuePropositionIndex({ items: initial = [] }) {
    const flash = usePage().props.flash ?? {};
    const [items, setItems]   = useState(initial);
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIdx = items.findIndex(i => i.id === active.id);
        const newIdx = items.findIndex(i => i.id === over.id);
        const reordered = arrayMove(items, oldIdx, newIdx);
        setItems(reordered);
        router.post(route('admin.landing-page.value-propositions.reorder'), {
            ids: reordered.map(i => i.id),
        }, { preserveScroll: true, preserveState: true });
    };

    const handleAdd = (form) => {
        router.post(route('admin.landing-page.value-propositions.store'), form, {
            preserveScroll: true,
            onSuccess: () => setAdding(false),
        });
    };

    const handleUpdate = (id, form) => {
        router.put(route('admin.landing-page.value-propositions.update', id), form, {
            preserveScroll: true,
            onSuccess: () => setEditId(null),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus value proposition ini?')) return;
        router.delete(route('admin.landing-page.value-propositions.destroy', id), { preserveScroll: true });
    };

    const handleToggle = (item) => {
        router.put(route('admin.landing-page.value-propositions.update', item.id), {
            ...item, is_active: !item.is_active,
        }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Value Proposition" />
            <PageHeader
                title="Value Proposition"
                subtitle="Keunggulan yang ditampilkan di landing page"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Landing Page' },
                    { label: 'Value Proposition' },
                ]}
                actions={
                    <button type="button" onClick={() => { setAdding(true); setEditId(null); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                        <Plus size={15} /> Tambah
                    </button>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                    ✓ {flash.success}
                </div>
            )}

            <div className="space-y-3">
                {adding && <VPForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

                {items.length === 0 && !adding ? (
                    <div className="card p-12 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Star size={28} className="text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">Belum ada value proposition</p>
                            <p className="text-sm text-text-muted mt-1">Tambahkan keunggulan layanan Anda</p>
                        </div>
                        <button onClick={() => setAdding(true)}
                            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={14} className="inline mr-1" /> Tambah
                        </button>
                    </div>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {items.map(item => (
                                    editId === item.id
                                        ? <VPForm key={item.id} initial={item} onSave={f => handleUpdate(item.id, f)} onCancel={() => setEditId(null)} />
                                        : <SortableVP key={item.id} item={item} onEdit={i => { setEditId(i.id); setAdding(false); }} onDelete={handleDelete} onToggle={handleToggle} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                {items.length > 0 && (
                    <p className="text-xs text-text-muted text-center py-2">
                        <GripVertical size={12} className="inline mr-1" /> Drag untuk mengubah urutan
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}

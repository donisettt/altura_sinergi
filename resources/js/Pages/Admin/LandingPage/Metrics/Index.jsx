import { Head, useForm, router, usePage } from '@inertiajs/react';
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
    Plus, GripVertical, Edit2, Trash2, Check, X, Save, BarChart2,
    ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';

/* ─── Icon Picker (simplified — lucide icon name input) ─── */
const PRESET_ICONS = ['BarChart2', 'Clock', 'Globe', 'Shield', 'Zap', 'Users', 'Star', 'Award', 'TrendingUp', 'CheckCircle'];

function IconBubble({ icon }) {
    return (
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">{icon?.slice(0, 2) ?? '—'}</span>
        </div>
    );
}

/* ─── Sortable Row ─── */
function SortableMetric({ metric, onEdit, onDelete, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: metric.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-card hover:border-primary/30 transition-colors group"
        >
            {/* Drag Handle */}
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab text-text-muted hover:text-text-primary shrink-0"
            >
                <GripVertical size={16} />
            </button>

            <IconBubble icon={metric.icon} />

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text-primary truncate">{metric.title}</p>
                <p className="text-xs text-text-muted truncate">{metric.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* Active toggle */}
                <button
                    type="button"
                    onClick={() => onToggle(metric)}
                    className={`text-sm transition-colors ${metric.is_active ? 'text-success' : 'text-text-muted'}`}
                    title={metric.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                >
                    {metric.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(metric)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                >
                    <Edit2 size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(metric.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

/* ─── Inline Form ─── */
function MetricForm({ initial = {}, onSave, onCancel, processing }) {
    const [form, setForm] = useState({
        title:     initial.title    ?? '',
        subtitle:  initial.subtitle ?? '',
        icon:      initial.icon     ?? '',
        is_active: initial.is_active ?? true,
    });

    return (
        <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Title (angka / teks) *</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="24/7"
                        className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Subtitle</label>
                    <input
                        value={form.subtitle}
                        onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                        placeholder="SLA Monitoring"
                        className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all"
                    />
                </div>
            </div>

            {/* Icon picker */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Icon (nama Lucide)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {PRESET_ICONS.map(ic => (
                        <button
                            key={ic}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, icon: ic }))}
                            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${form.icon === ic ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-primary/40'}`}
                        >
                            {ic}
                        </button>
                    ))}
                </div>
                <input
                    value={form.icon}
                    onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))}
                    placeholder="BarChart2"
                    className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-all"
                />
            </div>

            {/* Toggle active */}
            <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                    <input type="checkbox" className="sr-only peer"
                        checked={form.is_active}
                        onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    />
                    <div className="w-9 h-5 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-4 transition-all" />
                </div>
                <span className="text-sm text-text-secondary">Tampilkan di landing page</span>
            </label>

            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    disabled={processing || !form.title}
                    onClick={() => onSave(form)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                    <Check size={14} /> Simpan
                </button>
                <button type="button" onClick={onCancel}
                    className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                    Batal
                </button>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function MetricsIndex({ metrics: initial = [] }) {
    const flash  = usePage().props.flash ?? {};
    const [items, setItems]       = useState(initial);
    const [adding, setAdding]     = useState(false);
    const [editingId, setEditing] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    /* Drag end → optimistic reorder + persist */
    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIdx = items.findIndex(i => i.id === active.id);
        const newIdx = items.findIndex(i => i.id === over.id);
        const reordered = arrayMove(items, oldIdx, newIdx);
        setItems(reordered);
        router.post(route('admin.landing-page.metrics.reorder'), {
            ids: reordered.map(i => i.id),
        }, { preserveScroll: true, preserveState: true });
    };

    /* Store */
    const handleAdd = (form) => {
        router.post(route('admin.landing-page.metrics.store'), form, {
            preserveScroll: true,
            onSuccess: () => setAdding(false),
        });
    };

    /* Update */
    const handleUpdate = (id, form) => {
        router.put(route('admin.landing-page.metrics.update', id), form, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    /* Delete */
    const handleDelete = (id) => {
        if (!confirm('Hapus metric ini?')) return;
        router.delete(route('admin.landing-page.metrics.destroy', id), { preserveScroll: true });
    };

    /* Toggle active */
    const handleToggle = (metric) => {
        router.put(route('admin.landing-page.metrics.update', metric.id), {
            ...metric,
            is_active: !metric.is_active,
        }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Metrics" />

            <PageHeader
                title="Metrics"
                subtitle="Angka-angka kunci yang ditampilkan di landing page"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Landing Page' },
                    { label: 'Metrics' },
                ]}
                actions={
                    <button
                        type="button"
                        onClick={() => { setAdding(true); setEditing(null); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={15} /> Tambah Metric
                    </button>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
                    ✓ {flash.success}
                </div>
            )}

            <div className="space-y-3">
                {/* Add form */}
                {adding && (
                    <MetricForm
                        onSave={handleAdd}
                        onCancel={() => setAdding(false)}
                    />
                )}

                {/* Sortable list */}
                {items.length === 0 && !adding ? (
                    <div className="card p-12 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <BarChart2 size={28} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-text-primary font-semibold">Belum ada metric</p>
                            <p className="text-sm text-text-muted mt-1">Klik "Tambah Metric" untuk menambahkan angka kunci</p>
                        </div>
                        <button onClick={() => setAdding(true)}
                            className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={14} className="inline mr-1" /> Tambah Metric
                        </button>
                    </div>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {items.map(metric => (
                                    editingId === metric.id
                                        ? <MetricForm
                                            key={metric.id}
                                            initial={metric}
                                            onSave={(form) => handleUpdate(metric.id, form)}
                                            onCancel={() => setEditing(null)}
                                          />
                                        : <SortableMetric
                                            key={metric.id}
                                            metric={metric}
                                            onEdit={(m) => { setEditing(m.id); setAdding(false); }}
                                            onDelete={handleDelete}
                                            onToggle={handleToggle}
                                          />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                {items.length > 0 && (
                    <p className="text-xs text-text-muted text-center py-2">
                        <GripVertical size={12} className="inline mr-1" />
                        Drag untuk mengubah urutan tampil
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}

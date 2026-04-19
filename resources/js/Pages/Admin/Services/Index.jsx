import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, GripVertical, ToggleLeft, ToggleRight, Eye, EyeOff, Search, Filter } from 'lucide-react';
import {
    DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/cms/PageHeader';
import { StatusBadge } from '@/Components/cms/StatusBadge';

const CATEGORY_COLORS = {
    IT:          'text-primary bg-primary/10',
    Electrical:  'text-warning bg-warning/10',
    SPBU:        'text-success bg-success/10',
};

function SortableServiceRow({ service, onDelete, onToggleHome }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-card hover:border-primary/20 transition-colors group"
        >
            <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary shrink-0">
                <GripVertical size={16} />
            </button>

            {/* Image */}
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-bg-hover">
                {service.image
                    ? <img src={`/storage/${service.image}`} alt={service.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Tag size={20} className="text-text-muted" /></div>
                }
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-text-primary truncate">{service.name}</p>
                    {service.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold shrink-0">{service.badge}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[service.category] ?? 'bg-bg-hover text-text-muted'}`}>
                        {service.category}
                    </span>
                    <p className="text-xs text-text-muted truncate">{service.description?.slice(0, 60)}{service.description?.length > 60 ? '...' : ''}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* Toggle homepage */}
                <button type="button" onClick={() => onToggleHome(service)}
                    title={service.show_on_homepage ? 'Tampil di homepage' : 'Tidak tampil di homepage'}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${service.show_on_homepage ? 'text-success bg-success/10' : 'text-text-muted hover:bg-bg-hover'}`}>
                    {service.show_on_homepage ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                <Link href={route('admin.services.edit', service.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                    <Edit2 size={14} />
                </Link>

                <button type="button" onClick={() => onDelete(service.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default function ServicesIndex({ services: initial = [], categories = [] }) {
    const flash = usePage().props.flash ?? {};
    const [items, setItems]  = useState(initial);
    const [search, setSearch] = useState('');

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
        router.post(route('admin.services.reorder'), { ids: reordered.map(i => i.id) }, { preserveScroll: true, preserveState: true });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus layanan ini?')) return;
        router.delete(route('admin.services.destroy', id), { preserveScroll: true });
    };

    const handleToggleHome = (service) => {
        router.put(route('admin.services.update', service.id), {
            ...service,
            features: service.features ?? [],
            show_on_homepage: !service.show_on_homepage,
        }, { preserveScroll: true, preserveState: true });
    };

    const filtered = items.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout>
            <Head title="Services" />
            <PageHeader
                title="Services"
                subtitle="Kelola layanan yang ditampilkan"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Services' },
                ]}
                actions={
                    <Link href={route('admin.services.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                        <Plus size={15} /> Tambah Layanan
                    </Link>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">✓ {flash.success}</div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                {categories.map(cat => {
                    const count = items.filter(s => s.category === cat).length;
                    return (
                        <div key={cat} className="card p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${CATEGORY_COLORS[cat] ?? 'bg-bg-hover text-text-muted'}`}>
                                {cat.slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-text-primary">{count}</p>
                                <p className="text-xs text-text-muted">{cat}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="mb-4 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari layanan..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/60 transition-all"
                />
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="card p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Tag size={28} className="text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">Belum ada layanan</p>
                        <p className="text-sm text-text-muted mt-1">Klik tombol "Tambah Layanan" untuk mulai</p>
                    </div>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filtered.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {filtered.map(service => (
                                <SortableServiceRow
                                    key={service.id}
                                    service={service}
                                    onDelete={handleDelete}
                                    onToggleHome={handleToggleHome}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {items.length > 0 && (
                <p className="text-xs text-text-muted text-center py-3">
                    <GripVertical size={12} className="inline mr-1" /> Drag untuk mengubah urutan · <Eye size={12} className="inline mx-1" /> = tampil di homepage
                </p>
            )}
        </AdminLayout>
    );
}

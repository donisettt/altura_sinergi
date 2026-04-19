import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Building2, ToggleLeft, ToggleRight } from 'lucide-react';
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

function SortableClientRow({ client, onDelete, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-card hover:border-primary/20 transition-colors group"
        >
            <button type="button" {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary shrink-0">
                <GripVertical size={16} />
            </button>

            <div className="w-16 h-12 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                {client.logo
                    ? <img src={`/storage/${client.logo}`} alt={client.name} className="w-full h-full object-contain p-1" />
                    : <Building2 size={24} className="text-gray-300" />
                }
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text-primary truncate">{client.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-bg-hover text-text-secondary">{client.category}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => onToggle(client)}
                    className={`transition-colors ${client.is_active ? 'text-success' : 'text-text-muted'}`}>
                    {client.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <Link href={route('admin.clients.edit', client.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors">
                    <Edit2 size={14} />
                </Link>
                <button type="button" onClick={() => onDelete(client.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default function ClientsIndex({ clients: initial = [] }) {
    const flash = usePage().props.flash ?? {};
    const [items, setItems] = useState(initial);

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
        router.post(route('admin.clients.reorder'), { ids: reordered.map(i => i.id) }, { preserveScroll: true, preserveState: true });
    };

    const handleDelete = (id) => {
        if (!confirm('Hapus client ini?')) return;
        router.delete(route('admin.clients.destroy', id), { preserveScroll: true });
    };

    const handleToggle = (client) => {
        router.put(route('admin.clients.update', client.id), {
            ...client,
            is_active: !client.is_active,
        }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Clients" />

            <PageHeader
                title="Clients & Partners"
                subtitle="Kelola logo klien yang tampil di landing page"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Clients' },
                ]}
                actions={
                    <Link href={route('admin.clients.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                        <Plus size={15} /> Tambah Client
                    </Link>
                }
            />

            {flash.success && (
                <div className="mb-5 px-4 py-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">✓ {flash.success}</div>
            )}

            {items.length === 0 ? (
                <div className="card p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 size={28} className="text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">Belum ada client</p>
                        <p className="text-sm text-text-muted mt-1">Tambahkan logo klien atau partner Anda</p>
                    </div>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {items.map(client => (
                                <SortableClientRow
                                    key={client.id}
                                    client={client}
                                    onDelete={handleDelete}
                                    onToggle={handleToggle}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {items.length > 0 && (
                <p className="text-xs text-text-muted text-center py-4">
                    <GripVertical size={12} className="inline mr-1" /> Drag untuk mengubah urutan tampil
                </p>
            )}
        </AdminLayout>
    );
}

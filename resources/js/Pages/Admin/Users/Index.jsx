import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import {
    Users, UserCheck, UserX, UserPlus,
    Search, Filter, Plus, Edit2, Trash2,
    ChevronLeft, ChevronRight, MoreHorizontal,
    Crown, Shield, Edit3, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

/* Stat card */
function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: color + '20' }}>
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-bold text-text-primary">{Number(value).toLocaleString('id-ID')}</p>
                <p className="text-xs text-text-secondary mt-0.5">{label}</p>
            </div>
        </div>
    );
}

/* Role badge config */
const roleConfig = {
    super_admin: { label: 'Super Admin', color: '#5D87FF', bg: '#5D87FF15', icon: Crown },
    admin:       { label: 'Admin',       color: '#A78BFA', bg: '#A78BFA15', icon: Shield },
    editor:      { label: 'Editor',      color: '#13DEB9', bg: '#13DEB915', icon: Edit3 },
};

function RoleBadge({ role }) {
    const cfg = roleConfig[role] ?? { label: role ?? '—', color: '#7C8FAC', bg: '#7C8FAC15', icon: Shield };
    const Icon = cfg.icon;
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}>
            <Icon size={10} /> {cfg.label}
        </span>
    );
}

/* Delete confirm modal */
function DeleteModal({ user, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative card rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-error/15 flex items-center justify-center mb-4">
                    <Trash2 size={22} className="text-error" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">Hapus Pengguna?</h3>
                <p className="text-sm text-text-secondary mb-5">
                    Akun <span className="font-semibold text-text-primary">{user?.name}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-hover border border-border transition-colors">
                        Batal
                    </button>
                    <button onClick={onConfirm}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-error hover:bg-red-600 transition-colors">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Pagination */
function Pagination({ links, meta }) {
    const safeRoute = (url) => url;
    return (
        <div className="flex items-center justify-between px-1 mt-4">
            <p className="text-xs text-text-muted">
                Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total} pengguna
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    const isPrev = i === 0;
                    const isNext = i === links.length - 1;
                    const isNumber = !isPrev && !isNext;

                    if ((isPrev || isNext) && !link.url) {
                        return (
                            <button key={i} disabled className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted opacity-40">
                                {isPrev ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                            </button>
                        );
                    }
                    if (isPrev || isNext) {
                        return (
                            <Link key={i} href={link.url} preserveScroll
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-hover transition-colors">
                                {isPrev ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                            </Link>
                        );
                    }
                    return (
                        <Link key={i} href={link.url ?? '#'} preserveScroll
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                                ${link.active ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-hover'}`}>
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

/* MAIN PAGE */
export default function UsersIndex({ users, stats, roles, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [roleFilter, setRoleFilter] = useState(filters?.role ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(route('admin.users.index'), {
            search: overrides.search ?? search,
            role:   overrides.role   ?? roleFilter,
            status: overrides.status ?? statusFilter,
        }, { preserveState: true, replace: true });
    }, [search, roleFilter, statusFilter]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (val.length === 0 || val.length >= 2) {
            setTimeout(() => applyFilters({ search: val }), 400);
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('admin.users.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const userList = users?.data ?? [];

    return (
        <AdminLayout>
            <Head title="Users" />

            {deleteTarget && (
                <DeleteModal
                    user={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Users Management</h1>
                    <p className="text-xs text-text-muted mt-0.5">
                        <Link href={route('admin.dashboard')} className="hover:text-primary transition-colors">Dashboard</Link>
                        <span className="mx-1.5">/</span>
                        <span>Users</span>
                    </p>
                </div>
                <Link href={route('admin.users.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-brand-blue-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20">
                    <Plus size={15} /> Add User
                </Link>
            </div>

            {/* Flash message */}
            {flash?.success && (
                <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-success bg-success/10 border border-success/20">
                    <CheckCircle2 size={15} /> {flash.success}
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Users"    value={stats.total}    icon={Users}      color="#5D87FF" />
                <StatCard label="Active"         value={stats.active}   icon={UserCheck}  color="#13DEB9" />
                <StatCard label="Inactive"       value={stats.inactive} icon={UserX}      color="#FA896B" />
                <StatCard label="New This Month" value={stats.new_month} icon={UserPlus}  color="#FFAE1F" />
            </div>

            {/* Table Card */}
            <div className="card">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); applyFilters({ role: e.target.value }); }}
                        className="px-3 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                    >
                        <option value="">All Roles</option>
                        {Object.keys(roles ?? {}).map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                        className="px-3 py-2 text-sm bg-bg-main border border-border rounded-lg text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                    >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['Profile', 'Role', 'Status', 'Last Login', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userList.length > 0 ? userList.map((u) => (
                                <tr key={u.id}
                                    className="hover:bg-bg-hover transition-colors group"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

                                    {/* Profile */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=5D87FF&color=fff&bold=true&size=64`}
                                                className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
                                                alt={u.name}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                                                <p className="text-xs text-text-muted truncate">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className="px-5 py-3.5">
                                        <RoleBadge role={u.roles?.[0]?.name} />
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-3.5">
                                        {u.is_active
                                            ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                                                <CheckCircle2 size={10} /> Active
                                              </span>
                                            : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                                                <XCircle size={10} /> Inactive
                                              </span>
                                        }
                                    </td>

                                    {/* Last Login */}
                                    <td className="px-5 py-3.5">
                                        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                                            <Clock size={11} className="text-text-muted shrink-0" />
                                            {u.last_login_at ? formatDate(u.last_login_at) : <span className="italic text-text-muted">Never</span>}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-5 py-3.5 text-xs text-text-secondary">
                                        {formatDate(u.created_at)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={route('admin.users.edit', u.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteTarget(u)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="text-text-muted opacity-40" />
                                            <p className="text-sm text-text-muted">No users found</p>
                                            {(search || roleFilter || statusFilter) && (
                                                <button
                                                    onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); applyFilters({ search: '', role: '', status: '' }); }}
                                                    className="text-xs text-primary hover:underline mt-1"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users?.links && users?.meta && (
                    <div className="p-4 border-t border-border">
                        <Pagination links={users.links} meta={users.meta} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Lock, Shield, Eye, EyeOff, Save, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

function FormField({ label, error, children, required }) {
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

function TextInput({ icon: Icon, type = 'text', placeholder, value, onChange, error, ...props }) {
    const [show, setShow] = useState(false);
    const isPass = type === 'password';
    return (
        <div className="relative">
            {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />}
            <input
                type={isPass ? (show ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value ?? ''}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-9' : 'pl-4'} ${isPass ? 'pr-10' : 'pr-4'} py-2.5 text-sm
                    bg-bg-main border ${error ? 'border-error/50' : 'border-border'} rounded-lg
                    text-text-primary placeholder-text-muted
                    focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10
                    transition-all duration-150`}
                {...props}
            />
            {isPass && (
                <button type="button" onClick={() => setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            )}
        </div>
    );
}

export default function UsersEdit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name:                  user.name  ?? '',
        email:                 user.email ?? '',
        password:              '',
        password_confirmation: '',
        role:                  user.role  ?? '',
        is_active:             user.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    const roleList = Object.entries(roles ?? {});

    return (
        <AdminLayout>
            <Head title={`Edit — ${user.name}`} />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-text-primary">Edit User</h1>
                    <p className="text-xs text-text-muted mt-0.5">
                        <Link href={route('admin.dashboard')} className="hover:text-primary transition-colors">Dashboard</Link>
                        <span className="mx-1.5">/</span>
                        <Link href={route('admin.users.index')} className="hover:text-primary transition-colors">Users</Link>
                        <span className="mx-1.5">/</span>
                        <span>Edit</span>
                    </p>
                </div>
                <Link href={route('admin.users.index')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border hover:border-primary/40 rounded-lg transition-colors">
                    <ArrowLeft size={14} /> Back
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Account Info */}
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-5 pb-3 border-b border-border">
                                Account Information
                            </h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <FormField label="Full Name" error={errors.name} required>
                                        <TextInput icon={User} placeholder="Full name" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                                    </FormField>
                                    <FormField label="Email Address" error={errors.email} required>
                                        <TextInput icon={Mail} type="email" placeholder="Email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="card p-6">
                            <h2 className="text-sm font-semibold text-text-primary mb-1 pb-2 border-b border-border">
                                Change Password
                            </h2>
                            <p className="text-xs text-text-muted mb-5">Leave blank to keep current password</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormField label="New Password" error={errors.password}>
                                    <TextInput icon={Lock} type="password" placeholder="Min. 8 characters" value={data.password} onChange={e => setData('password', e.target.value)} error={errors.password} />
                                </FormField>
                                <FormField label="Confirm Password" error={errors.password_confirmation}>
                                    <TextInput icon={Lock} type="password" placeholder="Repeat new password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} error={errors.password_confirmation} />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Avatar Preview */}
                        <div className="card p-5 flex flex-col items-center text-center gap-3">
                            <img
                                src={user.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5D87FF&color=fff&bold=true&size=128`}
                                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                                alt={user.name}
                            />
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                                <p className="text-xs text-text-muted">{user.email}</p>
                            </div>
                            <div className="w-full pt-3 border-t border-border space-y-2 text-left">
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <Calendar size={12} className="text-text-muted shrink-0" />
                                    <span>Joined: {formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <Clock size={12} className="text-text-muted shrink-0" />
                                    <span>Last login: {formatDate(user.last_login_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Role & Status */}
                        <div className="card p-5">
                            <h2 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border">Role & Status</h2>
                            <div className="space-y-4">
                                <FormField label="Assign Role" error={errors.role} required>
                                    <div className="relative">
                                        <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-bg-main border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/60 transition-colors appearance-none"
                                        >
                                            {roleList.map(([k]) => (
                                                <option key={k} value={k}>{k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                                            ))}
                                        </select>
                                    </div>
                                </FormField>

                                <FormField label="Account Status">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only peer"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 rounded-full bg-bg-main border border-border peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all" />
                                        </div>
                                        <span className="text-sm text-text-secondary">{data.is_active ? 'Active' : 'Inactive'}</span>
                                    </label>
                                </FormField>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="card p-5 flex flex-col gap-3">
                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-brand-blue-dark text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20">
                                {processing
                                    ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Saving...</>
                                    : <><Save size={15} /> Save Changes</>
                                }
                            </button>
                            <Link href={route('admin.users.index')}
                                className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-text-secondary border border-border hover:border-primary/30 rounded-lg transition-colors">
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

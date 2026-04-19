import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Users, UserCheck, LogIn,
    TrendingUp, TrendingDown, Minus,
    ArrowRight, Clock, CheckCircle2, XCircle,
    FileText, Image as ImageIcon, Activity, Briefcase, PhoneCall, Layers
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AdminLayout from '@/Layouts/AdminLayout';

/* Animated Counter */
function Counter({ target, duration = 1200 }) {
    const [count, setCount] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        if (target === undefined || target === null) return;
        const start = performance.now();
        const animate = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(target * e));
            if (p < 1) raf.current = requestAnimationFrame(animate);
        };
        raf.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf.current);
    }, [target, duration]);
    return <>{count.toLocaleString('id-ID')}</>;
}

/* Stat Card */
function StatCard({ label, value, icon: Icon, bg, change, changeTrend = 'up' }) {
    const TrendIcon = changeTrend === 'up' ? TrendingUp : changeTrend === 'down' ? TrendingDown : Minus;
    const trendColor = changeTrend === 'up' ? '#13DEB9' : changeTrend === 'down' ? '#FA896B' : '#7C8FAC';
    return (
        <div
            className="rounded-xl p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden"
            style={{ background: bg }}
        >
            <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon size={20} className="text-white" />
                </div>
                {change && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-full">
                        <TrendIcon size={11} style={{ color: trendColor }} />
                        {change}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-white">
                    <Counter target={value} />
                </p>
                <p className="text-sm text-white/75 mt-0.5">{label}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-white/10" />
        </div>
    );
}

function DonutTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-3 py-2 text-xs shadow-xl">
            <p style={{ color: payload[0].payload.fill }} className="font-semibold">{payload[0].name}</p>
            <p className="text-text-primary">{payload[0].value.toLocaleString('id-ID')}</p>
        </div>
    );
}

function BarTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-3 py-2 text-xs shadow-xl space-y-1">
            <p className="text-text-secondary font-medium">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ color: p.fill }}>
                    {p.name}: <span className="font-semibold text-text-primary">{p.value}</span>
                </p>
            ))}
        </div>
    );
}

/* MAIN PAGE */
export default function DashboardIndex({ stats, chartData, leadStatusStats, recentUsers, recentLeads }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const DONUT_COLORS = ['#5D87FF', '#13DEB9', '#FFAE1F', '#FA896B', '#8C52FF'];
    const statusMap = {
        new: 'New', contacted: 'Contacted', deal: 'Deal Won', rejected: 'Rejected'
    };

    const donutData = leadStatusStats?.length
        ? leadStatusStats.map((r, i) => ({
            name: statusMap[r.status] || r.status.toUpperCase(),
            value: Number(r.total),
            fill: DONUT_COLORS[i % DONUT_COLORS.length],
          }))
        : [{ name: 'No Data', value: 1, fill: '#243352' }];

    const donutTotal = leadStatusStats?.length ? donutData.reduce((a, b) => a + b.value, 0) : 0;

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
                {/* Welcome Banner */}
                <div
                    className="lg:col-span-2 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1565C0 0%,#0D47A1 60%,#1a237e 100%)', minHeight: 150 }}
                >
                    <div className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '28px 28px' }}
                    />
                    <div className="absolute right-16 top-0 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute right-4 top-8 w-16 h-16 rounded-full bg-white/10" />
                    <div className="absolute right-8 bottom-0 w-20 h-20 rounded-full bg-white/5" />

                    <div className="relative z-10">
                        <p className="text-sm text-white/70 mb-1">
                            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
                        </p>
                        <h1 className="text-xl font-bold text-white mb-1">
                            Welcome to Altura CMS!
                        </h1>
                        <p className="text-sm text-white/60 mb-5 max-w-xs">
                            Manage your CRM leads and web portfolio from one powerful dashboard.
                        </p>
                        <Link href={route('admin.leads.index')} className="px-5 py-2 inline-flex bg-white text-primary text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">
                            Manage Leads
                        </Link>
                    </div>
                </div>

                <StatCard
                    label="Total Leads"
                    value={stats.total_leads}
                    icon={PhoneCall}
                    bg="linear-gradient(135deg,#1565C0,#2196F3)"
                    change={stats.new_leads_month > 0 ? `+${stats.new_leads_month} this month` : null}
                    changeTrend="up"
                />
                <StatCard
                    label="Case Studies"
                    value={stats.total_case_studies}
                    icon={Briefcase}
                    bg="linear-gradient(135deg,#00897B,#26A69A)"
                />
                <StatCard
                    label="Total Services"
                    value={stats.total_services}
                    icon={Layers}
                    bg="linear-gradient(135deg,#EF6C00,#FFA726)"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
                {/* Bar Chart — Leads Acquisition */}
                <div className="lg:col-span-3 card p-5">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">Lead Acquisition</h2>
                            <p className="text-xs text-text-secondary mt-0.5">Monthly new inquiries & deals closed</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-8 mb-4 mt-3">
                        <div>
                            <p className="text-xs text-text-secondary">Total Leads</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5"><Counter target={stats.total_leads} /></p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Deals Closed Today</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5"><Counter target={stats.leads_deals_today} /></p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">New Today</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5"><Counter target={stats.new_leads_today} /></p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData.monthly_leads} barCategoryGap="30%" barGap={4}>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(93,135,255,0.05)' }} />
                            <Bar dataKey="total" name="Total Inquiries" radius={[6,6,0,0]} fill="url(#barGrad1)" />
                            <Bar dataKey="deals" name="Deals Closed" radius={[6,6,0,0]} fill="url(#barGrad2)" />
                            <defs>
                                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5D87FF" />
                                    <stop offset="100%" stopColor="#5D87FF80" />
                                </linearGradient>
                                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#13DEB9" />
                                    <stop offset="100%" stopColor="#13DEB960" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Inquiries</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success inline-block" /> Deals</span>
                        </div>
                        <Link href={route('admin.leads.index')} className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-brand-blue-dark rounded-lg transition-colors">
                            View All Leads
                        </Link>
                    </div>
                </div>

                {/* Line Chart — Platform Growth */}
                <div className="lg:col-span-2 card p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">CRM Growth</h2>
                            <p className="text-xs text-text-secondary mt-0.5">Cumulative Lead Acquisition</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData.yearly_growth} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="year" tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#182035', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 12 }}
                                labelStyle={{ color: '#7C8FAC' }}
                                itemStyle={{ color: '#5D87FF' }}
                            />
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5D87FF" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#5D87FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Line
                                type="monotone"
                                dataKey="total"
                                name="Total Leads"
                                stroke="#5D87FF"
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: '#5D87FF', strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#5D87FF' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl" style={{ background: '#0D1117' }}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users size={18} className="text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-bold text-text-primary">{stats.total_users}</span>
                            </div>
                            <p className="text-xs text-text-secondary">System Users & Admins</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="space-y-4">
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-text-primary">User Activity (Today)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Valid Logins', value: stats.today_logins, color: '#5D87FF', icon: LogIn },
                                { label: 'Active Users', value: stats.active_users, color: '#13DEB9', icon: Activity },
                            ].map(({ label, value, color, icon: Icon }) => (
                                <div key={label} className="p-3 rounded-lg" style={{ background: '#0D1117' }}>
                                    <Icon size={16} style={{ color }} className="mb-1.5" />
                                    <p className="text-lg font-bold text-text-primary"><Counter target={value} /></p>
                                    <p className="text-[11px] text-text-muted">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5 flex items-center gap-4">
                        <img
                            src={user?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Admin')}&background=5D87FF&color=fff&bold=true`}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary/20 shrink-0"
                            alt="Admin"
                        />
                        <div className="min-w-0">
                            <p className="text-xs text-primary font-semibold mb-0.5">Administrator</p>
                            <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">Leads Status</h2>
                            <p className="text-xs text-text-secondary mt-0.5">Pipeline distribution</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <ResponsiveContainer width={200} height={200}>
                                <PieChart>
                                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                        {donutData.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="transparent" />)}
                                    </Pie>
                                    <Tooltip content={<DonutTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-2xl font-bold text-text-primary">{donutTotal}</p>
                                <p className="text-xs text-text-muted">Total</p>
                            </div>
                        </div>

                        <div className="mt-4 w-full space-y-2.5">
                            {donutData.map(d => (
                                <div key={d.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                                        <span className="text-xs text-text-secondary">{d.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-20 h-1.5 rounded-full" style={{ background: '#243352' }}>
                                            <div className="h-full rounded-full" style={{ width: `${donutTotal ? Math.round((d.value / donutTotal) * 100) : 0}%`, background: d.fill }} />
                                        </div>
                                        <span className="text-xs font-semibold text-text-primary w-4 text-right">{d.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card overflow-hidden flex flex-col">
                    <div className="h-40 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1A237E 0%,#0D47A1 50%,#01579B 100%)' }}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute bottom-4 left-5">
                            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Quick Guide</span>
                        </div>
                        <div className="absolute top-6 right-6 flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm"><FileText size={16} className="text-white" /></div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm"><ImageIcon size={16} className="text-white" /></div>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-text-primary mb-1">CMS Tips &amp; Tricks</h3>
                        <p className="text-xs text-text-secondary leading-relaxed flex-1">
                            Use the Sidebar sections to manage landing pages, update services, and handle new CRM leads. Your changes reflect immediately on the site.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="card p-0 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <h2 className="text-base font-semibold text-text-primary">Recent Inquiries</h2>
                        <Link href={route('admin.leads.index')} className="text-xs text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={11} />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-x-auto divide-y divide-border">
                        {recentLeads?.length > 0 ? recentLeads.map((lead) => (
                            <Link href={route('admin.leads.show', lead.id)} key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-bg-hover transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Briefcase size={16} className="text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
                                        <p className="text-xs text-text-secondary truncate">{lead.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <span className="text-[11px] text-text-muted">{formatDate(lead.created_at)}</span>
                                    {lead.status === 'new' && <Badge variant="blue" className="w-[84px] text-center justify-center">New Lead</Badge>}
                                    {lead.status === 'contacted' && <Badge variant="purple" className="w-[84px] text-center justify-center">Contacted</Badge>}
                                    {lead.status === 'deal' && <Badge variant="green" className="w-[84px] text-center justify-center">Deal Won</Badge>}
                                    {lead.status === 'rejected' && <Badge variant="red" className="w-[84px] text-center justify-center">Rejected</Badge>}
                                </div>
                            </Link>
                        )) : (
                            <div className="p-10 text-center text-sm text-text-muted">No recent inquiries</div>
                        )}
                    </div>
                </div>

                <div className="card p-0 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <h2 className="text-base font-semibold text-text-primary">Recent Users Login</h2>
                        <Link href={route('admin.users.index')} className="text-xs text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={11} />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase">User</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase">Status</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-text-muted uppercase">Last Login</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recentUsers?.length > 0 ? recentUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-bg-hover transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={u.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=5D87FF&color=fff&size=40`} className="w-8 h-8 rounded-full" alt="avatar" />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-text-primary truncate">{u.name}</p>
                                                    <p className="text-[11px] text-text-secondary truncate">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            {u.is_active ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success"><CheckCircle2 size={12} /> Active</span> : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-error"><XCircle size={12} /> Inactive</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="text-[11px] text-text-secondary">
                                                {u.last_login_at ? (<><p className="text-text-primary font-medium">{formatDate(u.last_login_at)}</p><p>{formatTime(u.last_login_at)}</p></>) : 'Never'}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="p-10 text-center text-text-muted">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

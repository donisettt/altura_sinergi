import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Users, UserCheck, UserPlus, LogIn,
    TrendingUp, TrendingDown, Minus,
    ArrowRight, Clock, CheckCircle2, XCircle,
    Crown, Shield, Edit3, MoreHorizontal,
    Eye, FileText, Image, Activity,
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend,
} from 'recharts';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/Badge';

/* Animated Counter */
function Counter({ target, duration = 1200 }) {
    const [count, setCount] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        if (!target) return;
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

/* Stat Card (top colored cards like mockup) */
function StatCard({ label, value, icon: Icon, bg, change, changeTrend = 'up' }) {
    const TrendIcon = changeTrend === 'up' ? TrendingUp : changeTrend === 'down' ? TrendingDown : Minus;
    const trendColor = changeTrend === 'up' ? '#13DEB9' : changeTrend === 'down' ? '#FA896B' : '#7C8FAC';
    return (
        <div
            className="rounded-xl p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden"
            style={{ background: bg }}
        >
            {/* top row */}
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
            {/* bottom row */}
            <div>
                <p className="text-3xl font-bold text-white">
                    <Counter target={value} />
                </p>
                <p className="text-sm text-white/75 mt-0.5">{label}</p>
            </div>
            {/* decorative circle */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-white/10" />
        </div>
    );
}

/* Donut chart tooltip */
function DonutTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-3 py-2 text-xs shadow-xl">
            <p style={{ color: payload[0].payload.fill }} className="font-semibold">{payload[0].name}</p>
            <p className="text-text-primary">{payload[0].value.toLocaleString('id-ID')}</p>
        </div>
    );
}

/* Custom Bar tooltip */
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
export default function DashboardIndex({ stats, recentUsers, roleStats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    /* dummy monthly data for bar chart */
    const monthlyData = [
        { month: 'Aug', users: 12, active: 8  },
        { month: 'Sep', users: 19, active: 14 },
        { month: 'Oct', users: 15, active: 11 },
        { month: 'Nov', users: 28, active: 22 },
        { month: 'Dec', users: 22, active: 18 },
        { month: 'Jan', users: 31, active: 25 },
        { month: 'Feb', users: 27, active: 21 },
        { month: 'Mar', users: stats.total_users, active: stats.active_users },
    ];

    /* dummy line chart data */
    const growthData = [
        { year: '2019', total: 0   },
        { year: '2020', total: 5   },
        { year: '2021', total: 18  },
        { year: '2022', total: 35  },
        { year: '2023', total: 72  },
        { year: '2024', total: 130 },
        { year: '2025', total: stats.total_users },
    ];

    /* donut chart: role distribution */
    const DONUT_COLORS = ['#5D87FF', '#13DEB9', '#FFAE1F', '#FA896B'];
    const donutData = roleStats?.length
        ? roleStats.map((r, i) => ({
            name: r.role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
            value: Number(r.total),
            fill: DONUT_COLORS[i % DONUT_COLORS.length],
          }))
        : [{ name: 'No Data', value: 1, fill: '#243352' }];

    const donutTotal = donutData.reduce((a, b) => a + b.value, 0);

    /* schedule / quick tasks (static for now) */
    const schedules = [
        { time: '09:00', label: 'Publish Blog Post',   tag: 'Content',  color: '#5D87FF' },
        { time: '11:00', label: 'Review Media Gallery', tag: 'Media',    color: '#13DEB9' },
        { time: '14:00', label: 'Update Service Pages', tag: 'Pages',    color: '#FFAE1F' },
        { time: '16:30', label: 'User Role Review',     tag: 'Security', color: '#FA896B' },
    ];

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const roleBadge = (r) => {
        const m = { super_admin: 'blue', admin: 'purple', editor: 'green' };
        return m[r] ?? 'default';
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            {/* ROW 1: Welcome Banner + Stat Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
                {/* Welcome Banner */}
                <div
                    className="lg:col-span-2 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1565C0 0%,#0D47A1 60%,#1a237e 100%)', minHeight: 150 }}
                >
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '28px 28px' }}
                    />
                    {/* Decorative circles */}
                    <div className="absolute right-16 top-0 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute right-4 top-8 w-16 h-16 rounded-full bg-white/10" />
                    <div className="absolute right-8 bottom-0 w-20 h-20 rounded-full bg-white/5" />

                    <div className="relative z-10">
                        {/* Greeting */}
                        <p className="text-sm text-white/70 mb-1">
                            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
                        </p>
                        <h1 className="text-xl font-bold text-white mb-1">
                            Welcome to Altura CMS!
                        </h1>
                        <p className="text-sm text-white/60 mb-5 max-w-xs">
                            Manage your company content, users, and system from one powerful dashboard.
                        </p>
                        <button className="px-5 py-2 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">
                            Visit Site
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <StatCard
                    label="Total Users"
                    value={stats.total_users}
                    icon={Users}
                    bg="linear-gradient(135deg,#1565C0,#2196F3)"
                    change="+12%"
                    changeTrend="up"
                />
                <StatCard
                    label="Active Users"
                    value={stats.active_users}
                    icon={UserCheck}
                    bg="linear-gradient(135deg,#00897B,#26A69A)"
                    change="+8%"
                    changeTrend="up"
                />
                <StatCard
                    label="New This Month"
                    value={stats.new_users_month}
                    icon={UserPlus}
                    bg="linear-gradient(135deg,#EF6C00,#FFA726)"
                    change={stats.new_users_month > 0 ? '+' + stats.new_users_month : '—'}
                    changeTrend={stats.new_users_month > 0 ? 'up' : 'flat'}
                />
            </div>

            {/* ROW 2: Bar Chart + Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
                {/* Bar Chart — User Registrations */}
                <div className="lg:col-span-3 card p-5">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">User Registrations</h2>
                            <p className="text-xs text-text-secondary mt-0.5">Monthly new &amp; active users</p>
                        </div>
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    {/* Summary row */}
                    <div className="flex items-start gap-8 mb-4 mt-3">
                        <div>
                            <p className="text-xs text-text-secondary">Total Users</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5">
                                <Counter target={stats.total_users} />
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                                <span className="text-xs text-success flex items-center gap-0.5">
                                    <TrendingUp size={10} /> +23%
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Active Users</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5">
                                <Counter target={stats.active_users} />
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
                                <span className="text-xs text-success flex items-center gap-0.5">
                                    <TrendingUp size={10} /> +8%
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary">Today Logins</p>
                            <p className="text-2xl font-bold text-text-primary mt-0.5">
                                <Counter target={stats.today_logins} />
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
                                <span className="text-xs text-text-secondary text-xs">Sessions</span>
                            </div>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#7C8FAC', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(93,135,255,0.05)' }} />
                            <Bar dataKey="users"  name="Total"  radius={[6,6,0,0]} fill="url(#barGrad1)" />
                            <Bar dataKey="active" name="Active" radius={[6,6,0,0]} fill="url(#barGrad2)" />
                            <defs>
                                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5D87FF" />
                                    <stop offset="100%" stopColor="#5D87FF80" />
                                </linearGradient>
                                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#49BEFF" />
                                    <stop offset="100%" stopColor="#49BEFF60" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Total</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-secondary inline-block" /> Active</span>
                        </div>
                        <button className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-brand-blue-dark rounded-lg transition-colors">
                            View Full Report
                        </button>
                    </div>
                </div>

                {/* Line Chart — Platform Growth */}
                <div className="lg:col-span-2 card p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">Platform Growth</h2>
                            <p className="text-xs text-text-secondary mt-0.5">Cumulative user growth</p>
                        </div>
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={growthData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
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
                                <span className="text-xs text-success font-medium bg-success/10 px-1.5 py-0.5 rounded-full">+12%</span>
                            </div>
                            <p className="text-xs text-text-secondary">Total Registered Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 3: Goals + Distribution + Blog Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Left: Quick Stats + Profile Highlight */}
                <div className="space-y-4">
                    {/* Today's Activity */}
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-text-primary">Today's Activity</h3>
                            <span className="text-xs text-success font-semibold">
                                {Math.round((stats.active_users / Math.max(stats.total_users, 1)) * 100)}%
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-2 rounded-full mb-3" style={{ background: '#243352' }}>
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${Math.round((stats.active_users / Math.max(stats.total_users, 1)) * 100)}%`,
                                    background: 'linear-gradient(90deg,#5D87FF,#49BEFF)',
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Today Logins',  value: stats.today_logins,    color: '#5D87FF', icon: LogIn },
                                { label: 'Active Now',    value: stats.active_users,     color: '#13DEB9', icon: Activity },
                            ].map(({ label, value, color, icon: Icon }) => (
                                <div key={label} className="p-3 rounded-lg" style={{ background: '#0D1117' }}>
                                    <Icon size={16} style={{ color }} className="mb-1.5" />
                                    <p className="text-lg font-bold text-text-primary">{value}</p>
                                    <p className="text-[11px] text-text-muted">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Admin card */}
                    <div className="card p-5 flex items-center gap-4">
                        <img
                            src={user?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'SA')}&background=5D87FF&color=fff&bold=true&size=80`}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary/20 shrink-0"
                            alt="Admin"
                        />
                        <div className="min-w-0">
                            <p className="text-xs text-primary font-semibold mb-0.5">#1 Super Admin</p>
                            <p className="text-sm font-bold text-text-primary truncate">{user?.name ?? 'Administrator'}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Middle: Donut Chart — Role Distribution */}
                <div className="card p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-text-primary">Role Distribution</h2>
                            <p className="text-xs text-text-secondary mt-0.5">User roles breakdown</p>
                        </div>
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <ResponsiveContainer width={200} height={200}>
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {donutData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DonutTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-2xl font-bold text-text-primary">{donutTotal}</p>
                                <p className="text-xs text-text-muted">Total Users</p>
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
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${Math.round((d.value / donutTotal) * 100)}%`, background: d.fill }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-text-primary w-4 text-right">{d.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Quick Tips / Blog Card */}
                <div className="card overflow-hidden flex flex-col">
                    {/* Hero image-like gradient area */}
                    <div className="h-40 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg,#1A237E 0%,#0D47A1 50%,#01579B 100%)' }}>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute bottom-4 left-5">
                            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Quick Guide</span>
                        </div>
                        {/* Decorative icons */}
                        <div className="absolute top-6 right-6 flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <FileText size={16} className="text-white" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Image size={16} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-text-primary mb-1">CMS Tips &amp; Tricks</h3>
                        <p className="text-xs text-text-secondary leading-relaxed flex-1">
                            Learn how to manage content, configure roles, and publish pages efficiently with the Altura CMS admin panel.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {['S','A','E'].map((l, i) => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-white"
                                        style={{ background: DONUT_COLORS[i] }}>
                                        {l}
                                    </div>
                                ))}
                                <div className="w-7 h-7 rounded-full border-2 border-bg-card bg-bg-hover flex items-center justify-center text-[9px] text-text-muted">
                                    +2
                                </div>
                            </div>
                            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                Read More <ArrowRight size={11} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 4: Upcoming Tasks + Recent Users Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Upcoming Tasks */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-text-primary">Upcoming Schedule</h2>
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    {/* Tab-like pills */}
                    <div className="flex gap-2 mb-4">
                        {['Today', 'This Week', 'This Month'].map((t, i) => (
                            <button
                                key={t}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    i === 0
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {schedules.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover transition-colors group cursor-pointer">
                                <div className="w-1 h-10 rounded-full shrink-0" style={{ background: s.color }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{s.label}</p>
                                    <p className="text-xs text-text-muted">{s.time} · {s.tag}</p>
                                </div>
                                <ArrowRight size={14} className="text-text-muted group-hover:text-primary transition-colors shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-text-primary">Recent Users</h2>
                        <a href="#" className="text-xs text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={11} />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Profile', 'Status', 'Last Login', 'Joined'].map(h => (
                                        <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers?.length > 0 ? recentUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-bg-hover transition-colors group cursor-pointer"
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td className="py-3 pr-3">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={u.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=5D87FF&color=fff&bold=true&size=64`}
                                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border shrink-0"
                                                    alt={u.name}
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-text-primary truncate">{u.name}</p>
                                                    <p className="text-[11px] text-text-muted truncate">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-3">
                                            {u.is_active
                                                ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full"><CheckCircle2 size={9} />Active</span>
                                                : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-error bg-error/10 px-2 py-0.5 rounded-full"><XCircle size={9} />Inactive</span>
                                            }
                                        </td>
                                        <td className="py-3 pr-3">
                                            <span className="text-xs text-text-secondary flex items-center gap-1">
                                                <Clock size={10} className="text-text-muted" />
                                                {u.last_login_at ? formatDate(u.last_login_at) : <span className="italic text-text-muted">Never</span>}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="text-xs text-text-secondary">{formatDate(u.created_at)}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-sm text-text-muted">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

/* expose DONUT_COLORS for the tips card */
const DONUT_COLORS = ['#5D87FF', '#13DEB9', '#FFAE1F', '#FA896B'];

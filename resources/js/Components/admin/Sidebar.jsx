import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, FileText, Image, BarChart2,
    Settings, ChevronDown, Zap, HelpCircle, Globe,
    BookOpen, Tag, Building2, Briefcase, Star, UserRoundCog,
    Layout, BarChart, Search, Layers, PhoneCall,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navGroups = [
    {
        label: 'HOME',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, route: 'admin.dashboard' },
        ],
    },
    {
        label: 'LANDING PAGE',
        items: [
            {
                label: 'Landing Page',
                icon: Layout,
                route: 'admin.landing-page.hero.show',
                children: [
                    { label: 'Hero Section',       route: 'admin.landing-page.hero.show' },
                    { label: 'Metrics',            route: 'admin.landing-page.metrics.index' },
                    { label: 'Value Proposition',  route: 'admin.landing-page.value-propositions.index' },
                ],
            },
            { label: 'Services',       icon: Tag,          route: 'admin.services.index' },
            { label: 'Case Studies',   icon: BarChart,     route: 'admin.case-studies.index' },
            { label: 'Clients',        icon: Star,         route: 'admin.clients.index' },
        ],
    },
    {
        label: 'COMPANY',
        items: [
            { label: 'Company Profile', icon: Building2,    route: 'admin.company-profile.show' },
            { label: 'Leads (CRM)',     icon: PhoneCall,    route: 'admin.leads.index' },
            { label: 'Footer',          icon: Layers,       route: 'admin.footer.show' },
        ],
    },
    {
        label: 'SYSTEM',
        items: [
            { label: 'Blogs',        icon: BookOpen,       route: 'admin.users.index', soon: true },
            { label: 'SEO Settings', icon: Search,         route: 'admin.seo.index' },
            { label: 'Users',        icon: Users,          route: 'admin.users.index' },
            { label: 'Settings',     icon: Settings,       route: 'admin.settings.index' },
        ],
    },
];


function NavItem({ item, collapsed }) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    const safeRoute = (r) => {
        try {
            return route(r);
        } catch (e) {
            console.error('Routing error for', r, e);
            return '#';
        }
    };

    const isActive = (r) => {
        try {
            const p = route(r).replace(window.location.origin, '');
            return url === p || url.startsWith(p + '/');
        } catch { return false; }
    };

    const active = isActive(item.route);
    const Icon = item.icon;
    const hasChildren = item.children?.length > 0;

    return (
        <li>
            {hasChildren ? (
                <>
                    <button
                        onClick={() => !collapsed && setOpen(v => !v)}
                        className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg',
                            'transition-colors duration-150 group/item',
                            collapsed && 'justify-center px-2',
                            active
                                ? 'bg-primary/15 text-primary'
                                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
                            item.soon && 'opacity-50',
                        )}
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                        {!collapsed && !item.soon && (
                            <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
                        )}
                        {!collapsed && item.soon && (
                            <span className="text-[9px] bg-warning/15 text-warning px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">Soon</span>
                        )}
                        {collapsed && (
                            <span className="absolute left-full ml-3 px-2.5 py-1.5 text-xs bg-bg-card text-text-primary rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-xl border border-border z-50">
                                {item.label}
                            </span>
                        )}
                    </button>
                    {open && !collapsed && (
                        <ul className="mt-0.5 ml-7 space-y-0.5 border-l border-border pl-3">
                            {item.children.map(child => (
                                <li key={child.label}>
                                    <Link
                                        href={safeRoute(child.route)}
                                        className="block py-2 px-2 text-xs text-text-secondary hover:text-primary transition-colors rounded"
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <div className="relative group/item">
                    <Link
                        href={item.soon ? '#' : safeRoute(item.route)}
                        className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg',
                            'transition-colors duration-150',
                            collapsed && 'justify-center px-2',
                            active
                                ? 'bg-primary/15 text-primary'
                                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
                            item.soon && 'opacity-50 cursor-default pointer-events-none',
                        )}
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="flex-1">{item.label}</span>}
                        {!collapsed && item.soon && (
                            <span className="text-[9px] bg-warning/15 text-warning px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">Soon</span>
                        )}
                    </Link>
                    {collapsed && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 text-xs bg-bg-card text-text-primary rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-xl border border-border z-50">
                            {item.label}
                            {item.soon && ' (Soon)'}
                        </span>
                    )}
                </div>
            )}
        </li>
    );
}

export function Sidebar({ collapsed, onToggle }) {
    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-full z-40 flex flex-col sidebar-transition',
                'border-r border-border',
                collapsed ? 'w-[70px]' : 'w-[270px]',
            )}
            style={{ background: '#182035' }}
        >
            {/* Logo */}
            <div className={cn(
                'flex items-center h-[70px] border-b border-border shrink-0 px-5',
                collapsed && 'justify-center px-3',
            )}>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-blue">
                        <Zap size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-[15px] font-bold text-white truncate leading-tight">Altura Sinergi</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest">CMS Admin</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {navGroups.map(group => (
                    <div key={group.label}>
                        {!collapsed && (
                            <p className="px-4 mb-2 text-[10px] font-semibold tracking-widest text-text-muted">
                                {group.label}
                            </p>
                        )}
                        {collapsed && <div className="border-b border-border mb-2 mx-1" />}
                        <ul className="space-y-0.5">
                            {group.items.map(item => (
                                <NavItem key={item.label} item={item} collapsed={collapsed} />
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="shrink-0 px-5 py-3 border-t border-border">
                <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
                    <span className="w-2 h-2 rounded-full bg-success pulse-dot shrink-0" />
                    {!collapsed && <span className="text-xs text-text-muted">System Online</span>}
                </div>
            </div>
        </aside>
    );
}

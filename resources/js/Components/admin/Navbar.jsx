import { Link, usePage, router } from '@inertiajs/react';
import { Bell, Sun, Moon, ChevronDown, LogOut, User, Settings, Search, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export function Navbar({ sidebarCollapsed, onMenuToggle }) {
    const { auth } = usePage().props;
    const { isDark, toggle } = useTheme();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handle = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const handleLogout = () => {
        try { router.post(route('admin.logout')); }
        catch { router.post('/admin/logout'); }
    };

    const user = auth?.user;

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-[70px] z-30 flex items-center px-5 gap-4',
                'border-b border-border transition-all duration-300',
            )}
            style={{
                left: sidebarCollapsed ? '70px' : '270px',
                background: '#182035',
            }}
        >
            {/* Hamburger */}
            <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors shrink-0"
            >
                <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs hidden md:block">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Try to searching..."
                        className={cn(
                            'w-full pl-9 pr-4 py-2 text-sm rounded-lg',
                            'bg-bg-main border border-border',
                            'text-text-primary placeholder-text-muted',
                            'focus:outline-none focus:border-primary/50',
                            'transition-colors duration-150',
                        )}
                    />
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right Actions */}
            <div className="flex items-center gap-1 shrink-0">

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setUserMenuOpen(v => !v)}
                        className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg hover:bg-bg-hover transition-colors"
                    >
                        <img
                            src={user?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'A')}&background=5D87FF&color=fff&bold=true`}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div className="hidden sm:block text-left">
                            <p className="text-[13px] font-semibold text-text-primary leading-tight">{user?.name ?? 'Admin'}</p>
                            <p className="text-[11px] text-text-muted leading-tight capitalize">
                                {user?.roles?.[0]?.name?.replace('_', ' ') ?? 'Admin'}
                            </p>
                        </div>
                        <ChevronDown size={13} className={cn('text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 card rounded-xl shadow-2xl py-1 z-50">
                            <div className="px-4 py-3 border-b border-border">
                                <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                                <p className="text-xs text-text-muted truncate">{user?.email}</p>
                            </div>
                            <div className="p-1.5 space-y-0.5">
                                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors">
                                    <User size={14} /> Profile
                                </Link>
                                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors">
                                    <Settings size={14} /> Settings
                                </Link>
                                <div className="border-t border-border my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

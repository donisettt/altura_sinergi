import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/Components/admin/Sidebar';
import { Navbar } from '@/Components/admin/Navbar';
import { useTheme } from '@/hooks/useTheme';

export default function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { theme } = useTheme();

    const bgMain = theme === 'light' ? '#EEF2F8' : '#0D1117';

    return (
        <div className="min-h-screen" style={{ background: bgMain, color: theme === 'light' ? '#263238' : '#E8EAED' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
            <Navbar sidebarCollapsed={collapsed} onMenuToggle={() => setCollapsed(v => !v)} />

            <main
                className={cn('transition-all duration-300 pt-[70px] min-h-screen')}
                style={{ paddingLeft: collapsed ? '70px' : '270px' }}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

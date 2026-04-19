import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

/**
 * Reusable page header with breadcrumb, title, subtitle, and optional action slot.
 *
 * Props:
 *   title       - string
 *   subtitle    - string (optional)
 *   breadcrumbs - [{label, href}] array
 *   actions     - ReactNode (optional, renders on the right)
 */
export function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-xl font-bold text-text-primary">{title}</h1>
                {subtitle && (
                    <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
                )}
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1">
                                {i > 0 && <ChevronRight size={10} className="text-text-muted/60" />}
                                {crumb.href && i < breadcrumbs.length - 1
                                    ? <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                                    : <span className={i === breadcrumbs.length - 1 ? 'text-text-secondary' : ''}>{crumb.label}</span>
                                }
                            </span>
                        ))}
                    </nav>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}

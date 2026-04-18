import { cn } from '@/lib/utils';

const variants = {
    default: 'bg-surface-700 text-gray-300',
    blue:    'bg-brand-blue/15 text-brand-blue border border-brand-blue/20',
    green:   'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    yellow:  'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    red:     'bg-red-500/15 text-red-400 border border-red-500/20',
    purple:  'bg-purple-500/15 text-purple-400 border border-purple-500/20',
};

export function Badge({ children, variant = 'default', className }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}

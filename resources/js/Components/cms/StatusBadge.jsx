import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
    new:       { label: 'New Lead',    bg: 'bg-primary/10',  text: 'text-primary',  dot: 'bg-primary' },
    contacted: { label: 'Contacted',   bg: 'bg-warning/10',  text: 'text-warning',  dot: 'bg-warning' },
    deal:      { label: 'Deal Closed', bg: 'bg-success/10',  text: 'text-success',  dot: 'bg-success' },
    rejected:  { label: 'Rejected',    bg: 'bg-error/10',    text: 'text-error',    dot: 'bg-error' },
    active:    { label: 'Active',      bg: 'bg-success/10',  text: 'text-success',  dot: 'bg-success' },
    inactive:  { label: 'Inactive',    bg: 'bg-error/10',    text: 'text-error',    dot: 'bg-error' },
};

export function StatusBadge({ status, className }) {
    const cfg = STATUS_CONFIG[status] ?? {
        label: status,
        bg: 'bg-bg-hover',
        text: 'text-text-secondary',
        dot: 'bg-text-muted',
    };

    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full',
            cfg.bg, cfg.text, className,
        )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
        </span>
    );
}

import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false, ...props }) {
    return (
        <div
            className={cn(
                'glass rounded-xl p-6',
                hover && 'card-lift cursor-pointer glass-hover',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return (
        <div className={cn('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }) {
    return (
        <h3 className={cn('text-sm font-semibold text-gray-400 uppercase tracking-wider', className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }) {
    return <div className={cn('', className)}>{children}</div>;
}

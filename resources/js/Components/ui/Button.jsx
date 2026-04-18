import { cn } from '@/lib/utils';

const variants = {
    primary:   'bg-brand-blue hover:bg-brand-blue-dark text-white shadow-lg shadow-brand-blue/20',
    secondary: 'bg-surface-700 hover:bg-surface-600 text-gray-200 border border-surface-600',
    danger:    'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20',
    ghost:     'hover:bg-surface-700 text-gray-400 hover:text-gray-200',
    outline:   'border border-brand-blue/40 text-brand-blue hover:bg-brand-blue/10',
};

const sizes = {
    sm:  'px-3 py-1.5 text-xs',
    md:  'px-4 py-2 text-sm',
    lg:  'px-6 py-2.5 text-base',
    xl:  'px-8 py-3 text-lg',
    icon: 'p-2',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    loading = false,
    disabled,
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
                'transition-all duration-200 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-brand-blue/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}

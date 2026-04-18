import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
    { label, error, type = 'text', className, containerClass, ...props },
    ref,
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={cn('flex flex-col gap-1.5', containerClass)}>
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    className={cn(
                        'w-full bg-surface-800 border border-surface-600 rounded-lg px-4 py-2.5',
                        'text-sm text-gray-100 placeholder-gray-500',
                        'input-focus transition-all duration-200',
                        isPassword && 'pr-11',
                        error && 'border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
                        className,
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
});

export { Input };

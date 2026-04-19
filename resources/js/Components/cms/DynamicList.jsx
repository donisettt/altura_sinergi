import { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DynamicList component — add/remove/edit list of string items
 *
 * Props:
 *   items      - string[]
 *   onChange   - callback(string[])
 *   placeholder - string
 *   label       - string
 *   maxItems    - number (optional, default: 20)
 */
export function DynamicList({ items = [], onChange, placeholder = 'Tambah item...', label, maxItems = 20 }) {
    const [draft, setDraft] = useState('');

    const add = () => {
        const v = draft.trim();
        if (!v || items.length >= maxItems) return;
        onChange?.([...items, v]);
        setDraft('');
    };

    const remove = (idx) => {
        onChange?.(items.filter((_, i) => i !== idx));
    };

    const update = (idx, val) => {
        const next = [...items];
        next[idx] = val;
        onChange?.(next);
    };

    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium text-text-secondary">{label}</p>}

            <div className="space-y-1.5">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                        <GripVertical size={14} className="text-text-muted shrink-0 cursor-grab" />
                        <input
                            value={item}
                            onChange={(e) => update(idx, e.target.value)}
                            className={cn(
                                'flex-1 px-3 py-2 text-sm bg-bg-main border border-border rounded-lg',
                                'text-text-primary placeholder-text-muted',
                                'focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10',
                                'transition-all',
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <X size={13} />
                        </button>
                    </div>
                ))}
            </div>

            {items.length < maxItems && (
                <div className="flex items-center gap-2">
                    <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
                        placeholder={placeholder}
                        className={cn(
                            'flex-1 px-3 py-2 text-sm bg-bg-main border border-dashed border-border rounded-lg',
                            'text-text-primary placeholder-text-muted',
                            'focus:outline-none focus:border-primary/60 transition-all',
                        )}
                    />
                    <button
                        type="button"
                        onClick={add}
                        className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}

            <p className="text-xs text-text-muted">{items.length}/{maxItems} items</p>
        </div>
    );
}

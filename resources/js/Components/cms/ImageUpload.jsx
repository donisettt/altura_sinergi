import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ImageUpload component
 *
 * Props:
 *   value        - current image URL (existing from DB)
 *   onChange     - callback(File | null)
 *   label        - string
 *   accept       - string (default: 'image/*')
 *   maxMB        - number (default: 3)
 *   className    - string
 */
export function ImageUpload({ value, onChange, label = 'Upload Image', accept = 'image/*', maxMB = 3, className }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [error, setError]    = useState(null);

    const handleFile = (file) => {
        if (!file) return;
        if (file.size > maxMB * 1024 * 1024) {
            setError(`File terlalu besar. Maksimum ${maxMB}MB.`);
            return;
        }
        setError(null);
        setPreview(URL.createObjectURL(file));
        onChange?.(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const displayed = preview ?? (value ? `/storage/${value}` : null);

    return (
        <div className={cn('space-y-2', className)}>
            {displayed ? (
                <div className="relative group rounded-xl overflow-hidden border border-border" style={{ maxHeight: 200 }}>
                    <img src={displayed} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/80"
                    >
                        <X size={14} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-2 px-3">
                        <p className="text-xs text-white/70">Klik × untuk ganti gambar</p>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                    <div className="w-12 h-12 rounded-full bg-bg-hover flex items-center justify-center">
                        <ImageIcon size={22} className="text-text-muted" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-text-secondary">{label}</p>
                        <p className="text-xs text-text-muted mt-0.5">Drag & drop atau klik untuk pilih • Max {maxMB}MB</p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
            />

            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

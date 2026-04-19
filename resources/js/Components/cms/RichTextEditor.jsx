import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, UnderlineIcon, Strikethrough,
    Highlighter, List, ListOrdered, Undo2, Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HIGHLIGHT_COLORS = [
    { label: 'Yellow',  color: '#FFC107' },
    { label: 'Blue',    color: '#5D87FF' },
    { label: 'Green',   color: '#13DEB9' },
    { label: 'Orange',  color: '#FF6B35' },
    { label: 'Pink',    color: '#FF4F81' },
];

function ToolbarButton({ active, onClick, children, title }) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className={cn(
                'w-8 h-8 flex items-center justify-center rounded text-sm transition-colors',
                active
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
            )}
        >
            {children}
        </button>
    );
}

export function RichTextEditor({ value, onChange, placeholder = 'Write here...', className }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[120px] px-4 py-3 text-sm text-text-primary focus:outline-none',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className={cn('border border-border rounded-lg overflow-hidden bg-bg-main', className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border flex-wrap">
                <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                    <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                    <Italic size={14} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                    <UnderlineIcon size={14} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                    <Strikethrough size={14} />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Highlight colors */}
                <div className="flex items-center gap-0.5">
                    {HIGHLIGHT_COLORS.map(({ label, color }) => (
                        <button
                            key={color}
                            type="button"
                            title={`Highlight ${label}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                editor.chain().focus().toggleHighlight({ color }).run();
                            }}
                            className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110"
                            style={{ background: color }}
                        />
                    ))}
                </div>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                    <List size={14} />
                </ToolbarButton>
                <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
                    <ListOrdered size={14} />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolbarButton active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo2 size={14} />
                </ToolbarButton>
                <ToolbarButton active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo2 size={14} />
                </ToolbarButton>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}

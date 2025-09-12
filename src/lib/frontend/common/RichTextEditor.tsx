'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Text,
} from 'lucide-react';
import { useToast } from '@/lib/frontend/common/ToastProvider';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disable?: boolean;
};

const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  className = '',
  disable = false,
}: Props) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2] }),
      Image,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
        showOnlyCurrent: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `min-h-[200px] p-3 outline-none focus:outline-none ${className}`,
        spellcheck: 'true',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(!disable);
  }, [disable, editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const insertImage = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    onChange(editor?.getHTML() ?? '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Only images are allowed', 'error');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast('Image is too large (max 1.5 MB)', 'error');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Image upload failed');
      const json = await res.json();
      const url = json?.data?.url ?? json?.url ?? '';
      if (!url) throw new Error('No URL returned');
      insertImage(url);
      showToast('Image uploaded', 'success');
    } catch (err: any) {
      console.error('rt image upload error', err);
      showToast(err?.message || 'Failed to upload image', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!editor) return null;

  return (
    <div
      className={`border rounded-md ${disable ? 'bg-gray-100 opacity-70 cursor-not-allowed' : 'bg-white'
        }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b p-2 items-center">
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 px-2 rounded ${editor.isActive('bold') ? 'bg-blue-100' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 px-2 rounded ${editor.isActive('italic') ? 'bg-blue-100' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 px-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100' : ''}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 px-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100' : ''}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 px-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100' : ''}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 px-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100' : ''}`}
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1 px-2 rounded ${editor.isActive('paragraph') ? 'bg-blue-100' : ''}`}
        >
          <Text size={16} />
        </button>

        <button
          type="button"
          title="Upload Image"
          onClick={() => fileInputRef.current?.click()}
          className="p-1 px-2 rounded"
        >
          <ImageIcon size={16} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <button onClick={() => editor.chain().focus().undo().run()} className="p-1 px-2 rounded" title="Undo">
          <Undo2 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-1 px-2 rounded" title="Redo">
          <Redo2 size={16} />
        </button>
      </div>

      <div className="prose prose-sm max-w-none p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

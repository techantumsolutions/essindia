'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  RemoveFormatting,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { humanLabel } from './field-utils';

interface RichTextFieldProps {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded-lg transition-colors',
        active
          ? 'bg-[#4B2A63] text-white'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      )}
    >
      {children}
    </button>
  );
}

export function RichTextField({ fieldKey, label, value, onChange, placeholder }: RichTextFieldProps) {
  const isHtml = value.includes('<') && value.includes('>');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#4B2A63] underline' },
      }),
      Placeholder.configure({
        placeholder: placeholder || `Enter ${humanLabel(fieldKey).toLowerCase()}...`,
      }),
    ],
    content: isHtml ? value : `<p>${value || ''}</p>`,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      if (html === '<p></p>') {
        onChange('');
      } else if (isHtml || html.includes('<strong>') || html.includes('<em>') || html.includes('<h')) {
        onChange(html);
      } else {
        onChange(ed.getText());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{label || humanLabel(fieldKey)}</label>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#4B2A63]/10 focus-within:border-[#4B2A63]/20">
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50/50 flex-wrap">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            active={editor.isActive('link')}
            onClick={addLink}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

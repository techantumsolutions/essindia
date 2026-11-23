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
import { LineHeight } from './line-height-extension';

const LINE_SPACING_OPTIONS = [
  { value: '', label: 'Line spacing' },
  { value: '1', label: '1.0' },
  { value: '1.15', label: '1.15' },
  { value: '1.5', label: '1.5' },
  { value: '1.8', label: '1.8' },
  { value: '2', label: '2.0' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3.0' },
];

interface RichTextFieldProps {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  enableLineSpacing?: boolean;
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

export function RichTextField({ fieldKey, label, value, onChange, placeholder, maxLength, enableLineSpacing = false }: RichTextFieldProps) {
  const isHtml = value.includes('<') && value.includes('>');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#4B2A63] underline' },
      }),
      Placeholder.configure({
        placeholder: placeholder || `Enter ${humanLabel(fieldKey).toLowerCase()}...`,
      }),
      ...(enableLineSpacing ? [LineHeight] : []),
    ],
    content: isHtml ? value : `<p>${value || ''}</p>`,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      if (html === '<p></p>' || html === '') {
        onChange('');
      } else {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-4 py-3',
      },
    },
  });

  // Sync editor content with parent value prop changes
  React.useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const currentText = editor.getText();

    if (value !== currentHtml && value !== currentText) {
      const isValHtml = value.includes('<') && value.includes('>');
      const newContent = isValHtml ? value : `<p>${value || ''}</p>`;
      editor.commands.setContent(newContent, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500">{label || humanLabel(fieldKey)}</label>
        {maxLength && (
          <span className={cn(
            "text-[10px] font-medium",
            (value?.replace(/<[^>]*>/g, '')?.length || 0) > maxLength ? "text-red-500 font-bold" : "text-slate-400"
          )}>
            {(value?.replace(/<[^>]*>/g, '')?.length || 0)}/{maxLength} characters (Recommended)
          </span>
        )}
      </div>
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

          {enableLineSpacing && (
            <>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <select
                title="Line spacing"
                aria-label="Line spacing"
                className="h-7 max-w-[118px] text-[11px] rounded-md border border-slate-200 bg-white px-1.5 text-slate-600 cursor-pointer"
                value={
                  editor.getAttributes('paragraph').lineHeight ||
                  editor.getAttributes('heading').lineHeight ||
                  ''
                }
                onChange={(e) => {
                  const next = e.target.value;
                  if (!next) {
                    editor.chain().focus().unsetLineHeight().run();
                  } else {
                    editor.chain().focus().setLineHeight(next).run();
                  }
                }}
              >
                {LINE_SPACING_OPTIONS.map((opt) => (
                  <option key={opt.value || 'default'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

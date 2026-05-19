'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';

type TemplateSection = {
  id?: string;
  type: string;
  variant?: string | null;
  orderIndex: number;
  contentJson?: Record<string, unknown>;
};

type TemplateDetail = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  previewThumbnail: string | null;
  templateSections: TemplateSection[];
};

export default function TemplateEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [template, setTemplate] = React.useState<TemplateDetail | null>(null);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [sections, setSections] = React.useState<TemplateSection[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/templates/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load template');
        setTemplate(data);
        setName(data.name);
        setDescription(data.description || '');
        setThumbnail(data.previewThumbnail || '');
        setSections(
          (data.templateSections || []).map(
            (s: TemplateSection, i: number) => ({
              ...s,
              orderIndex: s.orderIndex ?? i,
            })
          )
        );
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Load failed');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next.map((s, i) => ({ ...s, orderIndex: i })));
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, orderIndex: i })));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { type: 'hero', variant: 'default', orderIndex: prev.length, contentJson: {} },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Template name is required');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          previewThumbnail: thumbnail.trim() || null,
          sections: sections.map((s, i) => ({
            id: s.id,
            type: s.type,
            variant: s.variant || 'default',
            contentJson: s.contentJson || {},
            orderIndex: i,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success('Template saved');
      router.push('/admin/templates');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-16 text-center text-slate-400">Loading template...</div>;
  }

  if (!template) {
    return <div className="p-16 text-center text-slate-400">Template not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <Link
        href="/admin/templates"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#4B2A63]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to templates
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Edit Template</h1>
        <p className="text-slate-500 font-medium">Update name, thumbnail, and section structure.</p>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-100 p-8 space-y-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
          className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-medium outline-none min-h-[80px] focus:ring-4 focus:ring-[#4B2A63]/10"
        />
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Preview thumbnail URL"
          className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-medium outline-none focus:ring-4 focus:ring-[#4B2A63]/10"
        />
      </div>

      <div className="bg-white rounded-[28px] border border-slate-100 p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Sections</h2>
          <Button variant="outline" onClick={addSection} className="rounded-full font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Add section
          </Button>
        </div>

        {sections.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">No sections in this template.</p>
        ) : (
          <div className="space-y-2">
            {sections.map((section, index) => (
              <motion.div
                key={`${section.id || section.type}-${index}`}
                layout
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                <select
                  value={section.type}
                  onChange={(e) => {
                    const next = [...sections];
                    next[index] = { ...next[index], type: e.target.value };
                    setSections(next);
                  }}
                  className="flex-1 bg-white rounded-xl px-4 py-2 font-bold text-sm outline-none"
                >
                  {SECTION_REGISTRY.map((s) => (
                    <option key={s.type} value={s.type}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-rose-400"
                    onClick={() => removeSection(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => router.push('/admin/templates')} className="rounded-full">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#4B2A63] text-white rounded-full px-10 h-12 font-bold"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </motion.div>
  );
}

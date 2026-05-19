'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Globe,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { SECTION_REGISTRY, getSectionDefinition } from '@/lib/cms/section-registry';

interface PageSection {
  id: string;
  type: string;
  variant: string | null;
  name: string | null;
  content: Record<string, unknown>;
  orderIndex: number;
  isActive: boolean;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
  } | null;
  sections: PageSection[];
}

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = React.useState<PageData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [seoForm, setSeoForm] = React.useState({
    title: '',
    description: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
  });

  const fetchPage = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPage(data);
      setSeoForm({
        title: data.seo?.title || '',
        description: data.seo?.description || '',
        ogImage: data.seo?.ogImage || '',
        canonicalUrl: data.seo?.canonicalUrl || '',
        noIndex: data.seo?.noIndex || false,
      });
    } catch {
      toast.error('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  React.useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const savePageMeta = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          status: page.status,
          seo: seoForm,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Page saved');
      fetchPage();
    } catch {
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSection = async (section: PageSection) => {
    const res = await fetch(`/api/admin/pages/${pageId}/sections/${section.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: section.content }),
    });
    if (res.ok) toast.success('Section saved');
    else toast.error('Failed to save section');
  };

  const addSection = async (type: string, afterIndex?: number) => {
    const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        orderIndex: afterIndex !== undefined ? afterIndex + 1 : undefined,
      }),
    });
    if (res.ok) {
      toast.success('Section added');
      setShowAddSection(false);
      fetchPage();
    } else {
      toast.error('Failed to add section');
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Remove this section?')) return;
    const res = await fetch(`/api/admin/pages/${pageId}/sections/${sectionId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Section removed');
      fetchPage();
    }
  };

  const reorderSections = async (newOrder: PageSection[]) => {
    setPage((p) => (p ? { ...p, sections: newOrder } : p));
    await fetch(`/api/admin/pages/${pageId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reorder: true, sectionIds: newOrder.map((s) => s.id) }),
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!page) return;
    const sections = [...page.sections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    reorderSections(sections);
  };

  if (isLoading) {
    return <div className="py-24 text-center text-slate-400 font-medium">Loading editor...</div>;
  }

  if (!page) {
    return <motion.div className="py-24 text-center">Page not found</motion.div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4 sticky top-20 z-30 bg-[#F8F9FA]/90 backdrop-blur-md py-4 -mx-2 px-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/pages')} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Pages
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{page.title}</h1>
            <p className="text-sm text-slate-400 font-mono">{page.fullPath}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={page.fullPath} target="_blank">
            <Button variant="outline" className="rounded-full gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </Link>
          <Button
            onClick={savePageMeta}
            disabled={isSaving}
            className="bg-[#4B2A63] text-white rounded-full px-6 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-slate-900">Page Settings</h2>
            <input
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none"
              placeholder="Page title"
            />
            <div className="flex gap-4">
              <input
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                className="flex-1 bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm outline-none"
                placeholder="slug"
              />
              <select
                value={page.status}
                onChange={(e) => setPage({ ...page, status: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg">Sections</h2>
            <Button
              onClick={() => setShowAddSection(!showAddSection)}
              variant="outline"
              className="rounded-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </Button>
          </div>

          <AnimatePresence>
            {showAddSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-[20px] border border-[#4B2A63]/20 p-4 grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {SECTION_REGISTRY.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => addSection(s.type)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-[#4B2A63]/5 text-left text-sm font-bold text-slate-700 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Reorder.Group
            axis="y"
            values={page.sections}
            onReorder={reorderSections}
            className="space-y-3"
          >
            {page.sections.map((section, index) => {
              const meta = getSectionDefinition(section.type);
              const isExpanded = expandedSection === section.id;
              return (
                <Reorder.Item key={section.id} value={section}>
                  <motion.div
                    layout
                    className="bg-white rounded-[24px] border border-slate-100 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 text-slate-300" />
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <span className={cn('text-xs font-black uppercase px-2 py-1 rounded', meta?.color)}>
                          {meta?.label || section.type}
                        </span>
                        <span className="font-bold text-slate-900">{section.name || section.type}</span>
                      </button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === page.sections.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)} className="text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-50 p-4 space-y-3"
                        >
                          <textarea
                            value={JSON.stringify(section.content, null, 2)}
                            onChange={(e) => {
                              try {
                                const content = JSON.parse(e.target.value);
                                setPage((p) =>
                                  p
                                    ? {
                                        ...p,
                                        sections: p.sections.map((s) =>
                                          s.id === section.id ? { ...s, content } : s
                                        ),
                                      }
                                    : p
                                );
                              } catch {
                                /* invalid json while typing */
                              }
                            }}
                            className="w-full min-h-[200px] bg-slate-50 rounded-xl p-4 font-mono text-xs outline-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveSection(section)}
                              className="bg-[#4B2A63] text-white rounded-full"
                            >
                              Save Section
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addSection(section.type, index)}
                              className="rounded-full"
                            >
                              Add Below
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4 sticky top-36">
            <div className="flex items-center gap-2 text-[#4B2A63]">
              <Globe className="w-5 h-5" />
              <h2 className="font-bold">SEO</h2>
            </div>
            <input
              placeholder="Meta title"
              value={seoForm.title}
              onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none"
            />
            <textarea
              placeholder="Meta description"
              value={seoForm.description}
              onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none min-h-[100px]"
            />
            <input
              placeholder="OG Image URL"
              value={seoForm.ogImage}
              onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none"
            />
            <input
              placeholder="Canonical URL"
              value={seoForm.canonicalUrl}
              onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={seoForm.noIndex}
                onChange={(e) => setSeoForm({ ...seoForm, noIndex: e.target.checked })}
              />
              No index (hide from search engines)
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

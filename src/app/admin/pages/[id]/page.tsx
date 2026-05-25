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
  Upload,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';
import {
  SectionEditorCard,
  setNestedValue,
} from '@/components/admin/page-editor';
import type { PageSection, JsonValue } from '@/components/admin/page-editor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TemplateSectionSchema {
  id: string;
  type: string;
  variant: string | null;
  contentJson: Record<string, unknown>;
  orderIndex: number;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  pageType: string | null;
  templateId: string | null;
  template: {
    id: string;
    name: string;
    templateSections?: TemplateSectionSchema[];
  } | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
  } | null;
  sections: PageSection[];
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useBeforeUnload(dirty: boolean) {
  React.useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

// ---------------------------------------------------------------------------
// Schema resolution: find matching template section for a page section
// ---------------------------------------------------------------------------

function findSchemaForSection(
  section: PageSection,
  templateSections?: TemplateSectionSchema[]
): Record<string, unknown> | null {
  if (!templateSections?.length) return null;

  const match = templateSections.find(
    (ts) => ts.type === section.type && (ts.variant || 'default') === (section.variant || 'default')
  );
  if (match?.contentJson && typeof match.contentJson === 'object') {
    return match.contentJson as Record<string, unknown>;
  }

  const typeMatch = templateSections.find((ts) => ts.type === section.type);
  if (typeMatch?.contentJson && typeof typeMatch.contentJson === 'object') {
    return typeMatch.contentJson as Record<string, unknown>;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Skeleton Loader
// ---------------------------------------------------------------------------

function EditorSkeleton() {
  return (
    <div className="space-y-6 pb-24 animate-pulse">
      <div className="sticky top-20 z-30 bg-[#F8F9FA]/95 backdrop-blur-lg py-4 -mx-2 px-2 border-b border-slate-100/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-10 bg-slate-200 rounded-xl" />
            <div>
              <div className="w-48 h-6 bg-slate-200 rounded-lg" />
              <div className="w-32 h-4 bg-slate-100 rounded mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-28 h-10 bg-slate-200 rounded-full" />
            <div className="w-32 h-10 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div className="w-32 h-5 bg-slate-200 rounded" />
            <div className="w-full h-12 bg-slate-100 rounded-xl" />
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-slate-100 rounded-xl" />
              <div className="w-32 h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 h-16" />
          ))}
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 h-80" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Editor
// ---------------------------------------------------------------------------

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = React.useState<PageData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [seoForm, setSeoForm] = React.useState({
    title: '',
    description: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
  });
  const [savedSeoSnapshot, setSavedSeoSnapshot] = React.useState('');
  const [dirtySections, setDirtySections] = React.useState<Set<string>>(new Set());

  const isDirty = React.useMemo(() => {
    if (!page) return false;
    const current = JSON.stringify({
      title: page.title,
      slug: page.slug,
      sections: page.sections,
    });
    const seoChanged = JSON.stringify(seoForm) !== savedSeoSnapshot;
    return current !== savedSnapshot || seoChanged || dirtySections.size > 0;
  }, [page, savedSnapshot, seoForm, savedSeoSnapshot, dirtySections]);

  useBeforeUnload(isDirty);

  const takeSnapshot = React.useCallback((p: PageData) => {
    setSavedSnapshot(
      JSON.stringify({
        title: p.title,
        slug: p.slug,
        sections: p.sections,
      })
    );
  }, []);

  const fetchPage = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPage(data);
      takeSnapshot(data);
      const seo = {
        title: data.seo?.title || '',
        description: data.seo?.description || '',
        ogImage: data.seo?.ogImage || '',
        canonicalUrl: data.seo?.canonicalUrl || '',
        noIndex: data.seo?.noIndex || false,
      };
      setSeoForm(seo);
      setSavedSeoSnapshot(JSON.stringify(seo));
      setDirtySections(new Set());
      if (data.sections?.length === 1) {
        setExpandedSections(new Set([data.sections[0].id]));
      }
    } catch {
      toast.error('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  }, [pageId, takeSnapshot]);

  React.useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // ---- Save All ----
  const handleSaveAll = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const metaRes = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: page.title, slug: page.slug }),
      });
      if (!metaRes.ok) throw new Error('Failed to save page settings');

      const seoRes = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: seoForm }),
      });
      if (!seoRes.ok) throw new Error('Failed to save SEO');

      const sectionPromises = page.sections.map((s) =>
        fetch(`/api/admin/pages/${pageId}/sections/${s.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: s.content }),
        })
      );
      const results = await Promise.all(sectionPromises);
      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) throw new Error(`${failed.length} section(s) failed to save`);

      toast.success('All changes saved');
      await fetchPage();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Publish / Unpublish ----
  const handlePublish = async () => {
    if (!page) return;
    if (isDirty) {
      toast.error('Save your changes before publishing');
      return;
    }
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });
      if (!res.ok) throw new Error('Failed to publish');
      toast.success('Page published successfully');
      await fetchPage();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!page) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish' }),
      });
      if (!res.ok) throw new Error('Failed to unpublish');
      toast.success('Page reverted to draft');
      await fetchPage();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unpublish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  // ---- Section operations ----
  const handleSaveSection = async (section: PageSection) => {
    const res = await fetch(`/api/admin/pages/${pageId}/sections/${section.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: section.content }),
    });
    if (res.ok) {
      toast.success('Section saved');
      setDirtySections((prev) => {
        const next = new Set(prev);
        next.delete(section.id);
        return next;
      });
    } else {
      toast.error('Failed to save section');
    }
  };

  const handleSectionContentChange = (sectionId: string, keyPath: string, value: JsonValue) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return { ...s, content: setNestedValue(s.content, keyPath, value) };
        }),
      };
    });
    setDirtySections((prev) => new Set(prev).add(sectionId));
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
      await fetchPage();
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
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
      await fetchPage();
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

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  // ---- Loading / Error states ----
  if (isLoading) return <EditorSkeleton />;

  if (!page) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-slate-500 font-medium">Page not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/pages')}
          className="rounded-full"
        >
          Back to Pages
        </Button>
      </div>
    );
  }

  const templateSchemas = page.template?.templateSections;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-24"
    >
      {/* ===== Sticky action bar ===== */}
      <div className="sticky top-20 z-30 bg-[#F8F9FA]/95 backdrop-blur-lg py-4 -mx-2 px-2 border-b border-slate-100/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              onClick={() => {
                if (isDirty && !confirm('You have unsaved changes. Leave anyway?'))
                  return;
                router.push('/admin/pages');
              }}
              className="rounded-xl shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Pages
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 truncate">
                  {page.title}
                </h1>
                <span
                  className={cn(
                    'text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0',
                    page.status === 'published'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  )}
                >
                  {page.status}
                </span>
                {isDirty && (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 border border-amber-200">
                    Unsaved changes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">
                {page.fullPath}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={page.fullPath} target="_blank">
              <Button variant="outline" className="rounded-full gap-2 h-10">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </Link>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving || !isDirty}
              className="bg-[#4B2A63] text-white rounded-full px-6 gap-2 h-10"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving…' : 'Save All'}
            </Button>
            {page.status === 'draft' ? (
              <Button
                onClick={handlePublish}
                disabled={isPublishing || isDirty}
                variant="outline"
                className="rounded-full px-6 gap-2 h-10 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                {isPublishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Publish
              </Button>
            ) : page.status === 'published' ? (
              <Button
                onClick={handleUnpublish}
                disabled={isPublishing}
                variant="outline"
                className="rounded-full px-5 gap-2 h-10 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                Unpublish
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Main content ===== */}
        <div className="lg:col-span-2 space-y-5">
          {/* Page Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              Page Settings
              {page.template && (
                <span className="text-[10px] font-bold text-[#4B2A63] bg-[#4B2A63]/5 px-2 py-0.5 rounded-md">
                  Template: {page.template.name}
                </span>
              )}
            </h2>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                Page Title
              </label>
              <input
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-base font-bold outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
                placeholder="Page title"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">
                  URL Slug
                </label>
                <input
                  value={page.slug}
                  onChange={(e) => setPage({ ...page, slug: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
                  placeholder="slug"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">
                  Status
                </label>
                <div
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-bold',
                    page.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  )}
                >
                  {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Sections Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#4B2A63]" />
              Sections
              <span className="text-sm font-normal text-slate-400">
                ({page.sections.length})
              </span>
            </h2>
            <div className="flex gap-2">
              {expandedSections.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setExpandedSections(new Set())}
                >
                  Collapse All
                </Button>
              )}
              <Button
                onClick={() => setShowAddSection(!showAddSection)}
                variant="outline"
                className="rounded-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </Button>
            </div>
          </div>

          {/* Add Section Palette */}
          <AnimatePresence>
            {showAddSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl border-2 border-dashed border-[#4B2A63]/20 p-4 grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {SECTION_REGISTRY.filter(
                  (s) => !s.label.includes('Legacy')
                ).map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => addSection(s.type)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-[#4B2A63]/5 text-left transition-colors group"
                  >
                    <p className="text-sm font-bold text-slate-700 group-hover:text-[#4B2A63]">
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {s.description}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section List */}
          {page.sections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No sections yet.</p>
              <p className="text-sm text-slate-300 mt-1">
                Click &ldquo;Add Section&rdquo; to start building your page.
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={page.sections}
              onReorder={reorderSections}
              className="space-y-3"
            >
              {page.sections.map((section, index) => (
                <Reorder.Item key={section.id} value={section}>
                  <SectionEditorCard
                    section={section}
                    schema={findSchemaForSection(section, templateSchemas)}
                    index={index}
                    total={page.sections.length}
                    isExpanded={expandedSections.has(section.id)}
                    onToggleExpand={() => toggleSectionExpand(section.id)}
                    onContentChange={handleSectionContentChange}
                    onSave={handleSaveSection}
                    onDelete={deleteSection}
                    onMove={moveSection}
                    isSectionDirty={dirtySections.has(section.id)}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* ===== Sidebar ===== */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 sticky top-36 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B2A63]">
              <Globe className="w-5 h-5" />
              <h2 className="font-bold">SEO Settings</h2>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                Meta Title
              </label>
              <input
                placeholder="Meta title"
                value={seoForm.title}
                onChange={(e) =>
                  setSeoForm({ ...seoForm, title: e.target.value })
                }
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
              {seoForm.title && (
                <p
                  className={cn(
                    'text-[10px]',
                    seoForm.title.length > 60
                      ? 'text-rose-500'
                      : 'text-slate-400'
                  )}
                >
                  {seoForm.title.length}/60 characters
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                Meta Description
              </label>
              <textarea
                placeholder="Meta description"
                value={seoForm.description}
                onChange={(e) =>
                  setSeoForm({ ...seoForm, description: e.target.value })
                }
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none min-h-[100px] focus:ring-2 focus:ring-[#4B2A63]/10 resize-y border border-transparent focus:border-[#4B2A63]/20"
              />
              {seoForm.description && (
                <p
                  className={cn(
                    'text-[10px]',
                    seoForm.description.length > 160
                      ? 'text-rose-500'
                      : 'text-slate-400'
                  )}
                >
                  {seoForm.description.length}/160 characters
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                OG Image URL
              </label>
              <input
                placeholder="OG Image URL"
                value={seoForm.ogImage}
                onChange={(e) =>
                  setSeoForm({ ...seoForm, ogImage: e.target.value })
                }
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
              {seoForm.ogImage && (
                <img
                  src={seoForm.ogImage}
                  alt="OG preview"
                  className="w-full h-24 object-cover rounded-xl border border-slate-100 mt-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                Canonical URL
              </label>
              <input
                placeholder="Canonical URL"
                value={seoForm.canonicalUrl}
                onChange={(e) =>
                  setSeoForm({ ...seoForm, canonicalUrl: e.target.value })
                }
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm font-medium text-slate-600">
                No index (hide from search engines)
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={seoForm.noIndex}
                onClick={() =>
                  setSeoForm({ ...seoForm, noIndex: !seoForm.noIndex })
                }
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  seoForm.noIndex ? 'bg-[#4B2A63]' : 'bg-slate-200'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
                    seoForm.noIndex ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

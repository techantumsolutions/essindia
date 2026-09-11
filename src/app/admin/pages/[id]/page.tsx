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
  Trash2,
  Edit,
  Calendar,
  User,
  Image as ImageIcon,
  X,
  BookOpen,
  SlidersHorizontal,
  LayoutGrid,
  BarChart3,
  Search,
  ChevronDown,
  Check,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';
import { buildPagePathFromNavHierarchy, resolvePageSlug } from '@/lib/cms/build-page-path-from-nav';
import { slugify } from '@/lib/cms/utils';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import {
  SectionEditorCard,
  setNestedValue,
} from '@/components/admin/page-editor';
import type { PageSection, JsonValue } from '@/components/admin/page-editor';
import { RichTextField } from '@/components/admin/page-editor/RichTextField';
import { MediaField } from '@/components/admin/page-editor/MediaField';
import { ColorPickerField } from '@/components/admin/page-editor/ColorPickerField';

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
  navigationItemId?: string | null;
  megaMenuCategoryId?: string | null;
  megaMenuSubCategoryId?: string | null;
  megaMenuSubSubCategoryId?: string | null;
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
// Blog Posts Manager Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Case Study Posts Manager Component
// ---------------------------------------------------------------------------

export function CaseStudyManager({ pageId, onRefresh }: { pageId?: string; onRefresh?: () => void }) {
  const [studies, setStudies] = React.useState<any[]>([]);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingStudyId, setEditingStudyId] = React.useState<string | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('basic');

  // Basic Info
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [topic, setTopic] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [date, setDate] = React.useState('');
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [gradientFrom, setGradientFrom] = React.useState('#1e2445');
  const [gradientTo, setGradientTo] = React.useState('#292048');
  const [status, setStatus] = React.useState('draft');

  // Overview
  const [overview, setOverview] = React.useState('');
  const [overviewImage1, setOverviewImage1] = React.useState('');
  const [overviewImage2, setOverviewImage2] = React.useState('');

  // Challenge
  const [challengeTitle, setChallengeTitle] = React.useState('');
  const [challengeDescription, setChallengeDescription] = React.useState('');
  const [challengeImage, setChallengeImage] = React.useState('');
  const [challengePoints, setChallengePoints] = React.useState([{ title: '', description: '' }]);

  // Solutions
  const [solutionsTitle, setSolutionsTitle] = React.useState('');
  const [solutionsDescription, setSolutionsDescription] = React.useState('');
  const [solutionModules, setSolutionModules] = React.useState([{ name: '', description: '', icon: '' }]);

  // Results
  const [resultsTitle, setResultsTitle] = React.useState('');
  const [resultsItems, setResultsItems] = React.useState(['']);

  const fetchStudies = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const tree = await res.json();
        let targetPageId = pageId;
        if (!targetPageId) {
          const findCaseStudiesNode = (nodes: any[]): any => {
            for (const node of nodes) {
              if (node.fullPath === '/case-studies' || node.slug === 'case-studies') return node;
              if (node.children) {
                const found = findCaseStudiesNode(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const csNode = findCaseStudiesNode(tree);
          if (csNode) targetPageId = csNode.id;
        }

        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.id === targetPageId) return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        const node = findNode(tree);
        if (node && node.children) {
          setStudies(node.children);
        } else {
          setStudies([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch case studies', err);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  const fetchTemplates = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/templates');
      if (res.ok) {
        setTemplates(await res.json());
      }
    } catch (err) {
      console.error('Failed to load templates', err);
    }
  }, []);

  React.useEffect(() => {
    fetchStudies();
    fetchTemplates();
  }, [fetchStudies, fetchTemplates]);

  React.useEffect(() => {
    if (!slugTouched && !editingStudyId) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, slugTouched, editingStudyId]);

  const resetForm = () => {
    setEditingStudyId(null);
    setTitle(''); setSlug(''); setSlugTouched(false); setTopic(''); setIndustry(''); setDate(''); setImage(''); setDescription(''); setGradientFrom('#1e2445'); setGradientTo('#292048'); setStatus('draft');
    setOverview(''); setOverviewImage1(''); setOverviewImage2('');
    setChallengeTitle(''); setChallengeDescription(''); setChallengeImage(''); setChallengePoints([{ title: '', description: '' }]);
    setSolutionsTitle(''); setSolutionsDescription(''); setSolutionModules([{ name: '', description: '', icon: '' }]);
    setResultsTitle(''); setResultsItems(['']);
    setActiveTab('basic');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = async (studyId: string) => {
    setIsFetchingDetail(true);
    try {
      const res = await fetch(`/api/admin/pages/${studyId}`);
      if (!res.ok) throw new Error('Failed to load case study details');
      const pageData = await res.json();

      setEditingStudyId(studyId);
      setTitle(pageData.title || '');
      setSlug(pageData.slug || '');
      setSlugTouched(true);
      setStatus(pageData.status || 'draft');

      const detailSection = pageData.sections?.find((s: any) => s.type === 'case-study-detail');
      const content = detailSection?.content || {};

      setTopic(content.badgeText || content.topic || '');
      setIndustry(content.industry || '');
      setDate(content.date || '');
      setImage(content.image || '');
      setDescription(content.description || '');
      setGradientFrom(content.gradientFrom || '#1e2445');
      setGradientTo(content.gradientTo || '#292048');

      setOverview(Array.isArray(content.overviewParagraphs) ? content.overviewParagraphs.join('\n\n') : (content.overview || ''));

      setChallengeTitle(content.challengeTitle || '');
      setChallengeDescription(content.challengeDescription || '');
      setChallengeImage(content.challengeImage || '');
      setChallengePoints(Array.isArray(content.challengePoints) && content.challengePoints.length > 0 ? content.challengePoints : [{ title: '', description: '' }]);

      setSolutionsTitle(content.solutionsTitle || '');
      setSolutionsDescription(content.solutionsDescription || '');
      setSolutionModules(Array.isArray(content.solutionModules) && content.solutionModules.length > 0 ? content.solutionModules : [{ name: '', description: '', icon: '' }]);

      setResultsTitle(content.resultsTitle || '');
      setResultsItems(Array.isArray(content.resultsItems) && content.resultsItems.length > 0 ? content.resultsItems : ['']);

      setActiveTab('basic');
      setShowCreateModal(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load case study');
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Case study deleted successfully');
        fetchStudies();
        onRefresh?.();
      } else {
        toast.error('Failed to delete case study');
      }
    } catch (err) {
      toast.error('Failed to delete case study');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return toast.error('Title and Slug are required');
    setIsCreating(true);
    try {
      const filteredChallengePoints = challengePoints.filter(p => p.title.trim() || p.description.trim());
      const filteredSolutions = solutionModules.filter(m => m.name.trim() || m.description.trim() || m.icon.trim());
      const filteredResults = resultsItems.filter(r => r.trim());
      const filteredOverviewImages = [overviewImage1, overviewImage2].filter(img => img.trim());

      const updatedContent = {
        title,
        titleColor: '#ffffff',
        bgColor: `linear-gradient(135deg, ${gradientFrom || '#1e2445'} 0%, ${gradientTo || '#292048'} 100%)`,
        gradientFrom: gradientFrom || '#1e2445',
        gradientTo: gradientTo || '#292048',
        badgeBgColor: '#ffffff',
        badgeBorderColor: '#7c3aed',
        badgeText: topic || 'Caetrory Name',
        badgeTextColor: '#7c3aed',
        date: date || undefined,
        dateColor: '#ffffff',
        description: description || undefined,
        descriptionColor: '#e2e8f0',
        image: image || undefined,
        overview: overview || undefined,
        overviewParagraphs: overview ? overview.split('\n\n').map(p => p.trim()).filter(Boolean) : undefined,
        overviewImages: filteredOverviewImages.length > 0 ? filteredOverviewImages : undefined,
        challengeTitle: challengeTitle || undefined,
        challengeDescription: challengeDescription || undefined,
        challengeImage: challengeImage || undefined,
        challengePoints: filteredChallengePoints.length > 0 ? filteredChallengePoints : undefined,
        solutionsTitle: solutionsTitle || undefined,
        solutionsDescription: solutionsDescription || undefined,
        solutionModules: filteredSolutions.length > 0 ? filteredSolutions : undefined,
        resultsTitle: resultsTitle || undefined,
        resultsItems: filteredResults.length > 0 ? filteredResults : undefined,
      };

      if (editingStudyId) {
        // Mode 1: Edit existing case study
        await fetch(`/api/admin/pages/${editingStudyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, status }),
        });

        const pageRes = await fetch(`/api/admin/pages/${editingStudyId}`);
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          const detailSection = pageData.sections?.find((s: any) => s.type === 'case-study-detail');
          if (detailSection) {
            await fetch(`/api/admin/pages/${editingStudyId}/sections/${detailSection.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: { ...(detailSection.content || {}), ...updatedContent } }),
            });
          }
        }

        if (status === 'published') {
          await fetch(`/api/admin/pages/${editingStudyId}/actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'publish' }),
          });
        }

        toast.success('Case Study updated successfully');
      } else {
        // Mode 2: Create new case study
        let parentTargetId = pageId || null;
        if (!parentTargetId) {
          const pagesRes = await fetch('/api/admin/pages');
          if (pagesRes.ok) {
            const tree = await pagesRes.json();
            const findCaseStudiesNode = (nodes: any[]): any => {
              for (const node of nodes) {
                if (node.fullPath === '/case-studies' || node.slug === 'case-studies') return node;
                if (node.children) {
                  const found = findCaseStudiesNode(node.children);
                  if (found) return found;
                }
              }
              return null;
            };
            const csNode = findCaseStudiesNode(tree);
            if (csNode && csNode.id) parentTargetId = csNode.id;
          }
        }

        let detailTemplate = templates.find((t: any) =>
          t.templateSections?.some((ts: any) => ts.type === 'case-study-detail')
        );

        if (!detailTemplate) {
          const tmplRes = await fetch('/api/admin/templates');
          if (tmplRes.ok) {
            const allTmpls = await tmplRes.json();
            setTemplates(allTmpls);
            detailTemplate = allTmpls.find((t: any) =>
              t.templateSections?.some((ts: any) => ts.type === 'case-study-detail')
            );
          }
        }

        if (!detailTemplate) throw new Error('Case Study Detail template not found');

        const createPageRes = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim() || undefined,
            parentId: parentTargetId ? parentTargetId : null,
            templateId: detailTemplate.id ? detailTemplate.id : null,
            pageType: 'standard',
            status: 'draft',
          }),
        });

        if (!createPageRes.ok) {
          const errBody = await createPageRes.json().catch(() => ({}));
          throw new Error(errBody.error || errBody.message || 'Failed to create page');
        }
        const pageData = await createPageRes.json();

        const detailSection = pageData.sections?.find((s: any) => s.type === 'case-study-detail');
        if (!detailSection) throw new Error('Created page does not contain case-study-detail section');

        const defaultContent = detailSection.content || detailTemplate.templateSections?.find((ts: any) => ts.type === 'case-study-detail')?.contentJson || {};

        await fetch(
          `/api/admin/pages/${pageData.id}/sections/${detailSection.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: { ...defaultContent, ...updatedContent } }),
          }
        );

        if (status === 'published') {
          await fetch(`/api/admin/pages/${pageData.id}/actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'publish' }),
          });
        }

        toast.success('Case Study created successfully');
      }

      setShowCreateModal(false);
      resetForm();
      fetchStudies();
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save case study');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4B2A63]" />
            Case Study Posts Manager
          </h2>
          <p className="text-xs text-slate-400">
            Create, view, edit, and delete case studies.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 gap-2 h-10 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Case Study
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 text-[#4B2A63] animate-spin" /></div>
      ) : studies.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200">
          <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium text-sm">No case studies found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                <th className="py-3 px-2">Case Study</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((study: any) => (
                <tr key={study.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm font-medium">
                  <td className="py-3.5 px-2">
                    <span className="font-bold text-slate-800 block truncate">{study.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">{study.fullPath}</span>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="relative inline-block">
                      <select
                        value={study.status || 'draft'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          if (newStatus === study.status) return;
                          try {
                            const action = newStatus === 'published' ? 'publish' : 'unpublish';
                            const res = await fetch(`/api/admin/pages/${study.id}/actions`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action }),
                            });
                            if (res.ok) {
                              toast.success(`Status updated to ${newStatus}`);
                              setStudies(prev =>
                                prev.map(s => (s.id === study.id ? { ...s, status: newStatus } : s))
                              );
                              onRefresh?.();
                            } else {
                              toast.error('Failed to update status');
                            }
                          } catch (err) {
                            toast.error('Failed to update status');
                          }
                        }}
                        className={cn(
                          'appearance-none bg-none [background-image:none] text-[8px] font-black pl-2 pr-4 py-0 rounded-full uppercase tracking-tighter cursor-pointer border transition-all focus:outline-none h-4.5 leading-none',
                          study.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80'
                            : 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80'
                        )}
                      >
                        <option value="published" className="bg-white text-slate-800 font-semibold text-xs">Published</option>
                        <option value="draft" className="bg-white text-slate-800 font-semibold text-xs">Draft</option>
                      </select>
                      <ChevronDown className={cn(
                        'w-2 h-2 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none transition-colors opacity-75',
                        study.status === 'published' ? 'text-emerald-700' : 'text-amber-700'
                      )} />
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#4B2A63] hover:bg-[#4B2A63]/5" onClick={() => handleOpenEdit(study.id)} disabled={isFetchingDetail}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {editingStudyId ? 'Edit Case Study' : 'Add Case Study'}
                </h3>
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex overflow-hidden flex-1 min-h-0">
                {/* Sidebar Tabs */}
                <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-2 overflow-y-auto">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: BookOpen },
                    { id: 'overview', label: 'Overview', icon: ImageIcon },
                    { id: 'challenge', label: 'Challenge', icon: SlidersHorizontal },
                    { id: 'solutions', label: 'Solutions', icon: LayoutGrid },
                    { id: 'results', label: 'Results', icon: BarChart3 }
                  ].map(tab => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left", activeTab === tab.id ? "bg-[#4B2A63] text-white shadow-md shadow-[#4B2A63]/20" : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800")}>
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Form Content */}
                <form id="caseStudyForm" onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 bg-white">
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="admin-label">Title</label>
                          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
                        </div>
                        <div className="space-y-1">
                          <label className="admin-label">URL Slug</label>
                          <input type="text" required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className="admin-input" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="admin-label">Topic</label>
                          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. ERP" className="admin-input" />
                        </div>
                        <div className="space-y-1">
                          <label className="admin-label">Industry</label>
                          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Retail" className="admin-input" />
                        </div>
                        <div className="space-y-1">
                          <label className="admin-label">Date</label>
                          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Oct 2023" className="admin-input" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Hero Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="admin-input resize-none" />
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
                          <label className="admin-label">Hero BG Gradient 1 (Start)</label>
                          <ColorPickerField fieldKey="gradientFrom" value={gradientFrom} onChange={(val) => setGradientFrom(val)} />
                        </div>
                        <div className="space-y-1">
                          <label className="admin-label">Hero BG Gradient 2 (End)</label>
                          <ColorPickerField fieldKey="gradientTo" value={gradientTo} onChange={(val) => setGradientTo(val)} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Hero Image URL</label>
                        <MediaField fieldKey="hero-image" value={image} onChange={(val) => setImage(val)} />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Initial Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey="case-study-overview"
                          label="Overview Text"
                          value={overview}
                          onChange={(val) => setOverview(val)}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'challenge' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey="challenge-title"
                          label="Challenge Title"
                          value={challengeTitle}
                          onChange={(val) => setChallengeTitle(val)}
                        />
                      </div>
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey="challenge-description"
                          label="Challenge Description"
                          value={challengeDescription}
                          onChange={(val) => setChallengeDescription(val)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Challenge Image</label>
                        <MediaField fieldKey="challenge-image" value={challengeImage} onChange={(val) => setChallengeImage(val)} />
                      </div>
                      <div className="space-y-3">
                        <label className="admin-label">Challenge Points</label>
                        {challengePoints.map((pt, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Title" value={pt.title} onChange={e => { const n = [...challengePoints]; n[idx].title = e.target.value; setChallengePoints(n); }} className="admin-input flex-1" />
                            <input type="text" placeholder="Description" value={pt.description} onChange={e => { const n = [...challengePoints]; n[idx].description = e.target.value; setChallengePoints(n); }} className="admin-input flex-[2]" />
                            <button type="button" onClick={() => setChallengePoints(challengePoints.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setChallengePoints([...challengePoints, { title: '', description: '' }])} className="w-full rounded-xl border-dashed">Add Point</Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'solutions' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey="solutions-title"
                          label="Solutions Title"
                          value={solutionsTitle}
                          onChange={(val) => setSolutionsTitle(val)}
                        />
                      </div>
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey="solutions-description"
                          label="Solutions Description"
                          value={solutionsDescription}
                          onChange={(val) => setSolutionsDescription(val)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="admin-label">Solution Modules</label>
                        {solutionModules.map((mod, idx) => (
                          <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="w-20 shrink-0">
                              <MediaField fieldKey={`solution-icon-${idx}`} value={mod.icon} onChange={val => { const n = [...solutionModules]; n[idx].icon = val; setSolutionModules(n); }} />
                            </div>
                            <div className="flex-1 space-y-2">
                              <input type="text" placeholder="Module Name" value={mod.name} onChange={e => { const n = [...solutionModules]; n[idx].name = e.target.value; setSolutionModules(n); }} className="admin-input" />
                              <input type="text" placeholder="Description" value={mod.description} onChange={e => { const n = [...solutionModules]; n[idx].description = e.target.value; setSolutionModules(n); }} className="admin-input" />
                            </div>
                            <button type="button" onClick={() => setSolutionModules(solutionModules.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0 mt-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setSolutionModules([...solutionModules, { name: '', description: '', icon: '' }])} className="w-full rounded-xl border-dashed">Add Module</Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'results' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="admin-label">Results Title</label>
                        <input type="text" value={resultsTitle} onChange={(e) => setResultsTitle(e.target.value)} className="admin-input" />
                      </div>
                      <div className="space-y-3">
                        <label className="admin-label">Result Items</label>
                        {resultsItems.map((resItem, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Result bullet point" value={resItem} onChange={e => { const n = [...resultsItems]; n[idx] = e.target.value; setResultsItems(n); }} className="admin-input flex-1" />
                            <button type="button" onClick={() => setResultsItems(resultsItems.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setResultsItems([...resultsItems, ''])} className="w-full rounded-xl border-dashed">Add Result Item</Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-full">Cancel</Button>
                <Button form="caseStudyForm" type="submit" disabled={isCreating} className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 shadow-sm">
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingStudyId ? 'Save Changes' : 'Create Case Study'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

function CustomDropdown({ value, onChange, options, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 hover:bg-slate-100/80 active:bg-slate-200/50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium text-left flex items-center justify-between transition-all cursor-pointer"
      >
        <span className={value ? 'text-slate-800 font-medium' : 'text-slate-400 font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'transform rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-white border border-slate-100 shadow-xl py-1 outline-none"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-sm text-left font-medium transition-colors hover:bg-[#4B2A63]/5 hover:text-[#4B2A63] flex items-center justify-between cursor-pointer',
                  opt.value === value ? 'bg-[#4B2A63]/5 text-[#4B2A63]' : 'text-slate-700'
                )}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check className="w-4.5 h-4.5 text-[#4B2A63]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


const DEFAULT_TOPICS = [
  'Business Intelligence',
  'ERP Solutions',
  'IoT Solutions',
  'Mobile App Solutions',
  'CRM Solutions',
  'Sales Force Automation',
  'After-Sales Service App'
];

const DEFAULT_INDUSTRIES = [
  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics',
  'Automotive',
  'Healthcare',
  'Logistics & Supply Chain',
  'Chemicals',
  'Textiles',
  'Construction & Real Estate',
  'Food & Beverages',
  'Agriculture',
  'Energy & Utilities',
  'Financial Services'
];

export interface BlogManagerProps {
  pageId?: string;
  onRefresh?: () => void;
  blogListSection?: PageSection;
}

export function BlogManager({ pageId, onRefresh, blogListSection }: BlogManagerProps) {
  const topics = React.useMemo(() => {
    const sectionContent = blogListSection?.content as any;
    const rawTopics = sectionContent?.topics;
    if (Array.isArray(rawTopics) && rawTopics.length > 0) {
      return rawTopics.filter(Boolean);
    }
    return DEFAULT_TOPICS;
  }, [blogListSection]);

  const industries = React.useMemo(() => {
    const sectionContent = blogListSection?.content as any;
    const rawIndustries = sectionContent?.industries;
    if (Array.isArray(rawIndustries) && rawIndustries.length > 0) {
      return rawIndustries.filter(Boolean);
    }
    return DEFAULT_INDUSTRIES;
  }, [blogListSection]);

  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contentHtml, setContentHtml] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');

  // Tab-1: Hero & Basic Details
  const [heroBgImage, setHeroBgImage] = React.useState('');
  const [bgColor, setBgColor] = React.useState('');
  const [gradientFrom, setGradientFrom] = React.useState('#4A3AFF');
  const [gradientVia, setGradientVia] = React.useState('#4842E9');
  const [gradientTo, setGradientTo] = React.useState('#6095FF');
  const [date, setDate] = React.useState('May 15,2026');
  const [readTime, setReadTime] = React.useState('3min read');

  // Tab-2: Author Card
  const [authorCardAvatar, setAuthorCardAvatar] = React.useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
  const [authorCardName, setAuthorCardName] = React.useState('Saurabh Singh');
  const [authorCardRole, setAuthorCardRole] = React.useState('Managing Director');
  const [authorCardBio, setAuthorCardBio] = React.useState('With over 15 years of experience driving large-scale digital initiatives, Saurabh Singh is the CEO and Managing Director specializing in mobile product strategy, app store optimization, monetization, and digital growth across enterprise, retail, and media.');

  // Tab-3: Content Segments (Dynamic & Unsequenced)
  const [contentSegments, setContentSegments] = React.useState<any[]>([
    {
      type: 'key-takeaways',
      id: 'key-takeaways-1',
      tocTitle: 'Key takeaways',
      title: 'Key takeaways:',
      points: [
        'Most enterprise app delays start after approvals, integrations, and infrastructure reviews pile up across different teams.',
        'Real-time features, AI systems, and legacy integrations usually add more time than frontend development work.'
      ],
      descriptions: ['How Power BI Services Help Fix Multi-System Data Mismatches...']
    }
  ]);

  // Tab-4: Conclusion & Form
  const [conclusionParagraphs, setConclusionParagraphs] = React.useState<string[]>([
    'Managing data across multiple systems creates confusion, reporting errors, and slower decision-making.',
    'If you want to learn more about how Power BI Services can help your business eliminate data mismatches, contact marketing@essindia.com.'
  ]);
  const [calcTitle, setCalcTitle] = React.useState('Calculate your app development timeline!');
  const [calcDisclaimer, setCalcDisclaimer] = React.useState('I agree to receive the personalized development estimation report and future tech insights.');
  const [calcPoints, setCalcPoints] = React.useState<string[]>([
    '100% Free & No Commitment',
    'Detailed Timeline Breakdown in 24h',
    'Estimated Cost Range Included'
  ]);

  // Modal active tab control
  const [activeTab, setActiveTab] = React.useState<'hero' | 'author' | 'content' | 'conclusion'>('hero');
  const [editingBlogId, setEditingBlogId] = React.useState<string | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setTitle('');
    setSlug('');
    setSlugTouched(false);
    setCategory('');
    setIndustry('');
    setDate('May 15,2026');
    setReadTime('3min read');
    setHeroBgImage('');
    setBgColor('');
    setGradientFrom('#4A3AFF');
    setGradientVia('#4842E9');
    setGradientTo('#6095FF');

    setAuthorCardAvatar('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
    setAuthorCardName('Saurabh Singh');
    setAuthorCardRole('Managing Director');
    setAuthorCardBio('With over 15 years of experience driving large-scale digital initiatives...');

    setContentSegments([]);
    setConclusionParagraphs([]);
    setCalcTitle('Calculate your app development timeline!');
    setCalcDisclaimer('');
    setCalcPoints([]);
    setStatus('draft');
    setEditingBlogId(null);
    setActiveTab('hero');
  }, []);

  const handleEditBlog = async (blogId: string) => {
    setIsFetchingDetail(true);
    setEditingBlogId(blogId);
    try {
      const res = await fetch(`/api/admin/pages/${blogId}`);
      if (!res.ok) throw new Error('Failed to fetch blog details');
      const pageData = await res.json();

      setTitle(pageData.title || '');
      setSlug(pageData.slug || '');
      setSlugTouched(true);
      setStatus(pageData.status === 'published' ? 'published' : 'draft');

      const detailSection = pageData.sections?.find((s: any) => s.type === 'blog-detail-block');
      if (detailSection && detailSection.content) {
        const c = detailSection.content;
        setCategory(c.category || c.topic || '');
        setIndustry(c.industry || '');
        setHeroBgImage(c.heroBgImage || '');
        setBgColor(c.bgColor || '');
        setGradientFrom(c.gradientFrom || '#4A3AFF');
        setGradientVia(c.gradientVia || '#4842E9');
        setGradientTo(c.gradientTo || '#6095FF');
        setDate(c.date || 'May 15,2026');
        setReadTime(c.readTime || '3min read');

        setAuthorCardAvatar(c.authorCardAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
        setAuthorCardName(c.authorCardName || 'Saurabh Singh');
        setAuthorCardRole(c.authorCardRole || 'Managing Director');
        setAuthorCardBio(c.authorCardBio || '');

        setContentSegments(Array.isArray(c.contentSegments) ? c.contentSegments : []);
        setConclusionParagraphs(Array.isArray(c.conclusionParagraphs) ? c.conclusionParagraphs : []);

        setCalcTitle(c.calcTitle || 'Calculate your app development timeline!');
        setCalcDisclaimer(c.calcDisclaimer || '');
        setCalcPoints(Array.isArray(c.calcPoints) ? c.calcPoints : []);
      }

      setActiveTab('hero');
      setShowCreateModal(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load blog post details');
      setEditingBlogId(null);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const fetchBlogs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const tree = await res.json();
        let targetPageId = pageId;

        if (!targetPageId) {
          const findBlogNode = (nodes: any[]): any => {
            for (const node of nodes) {
              if (node.fullPath === '/blogs' || node.slug === 'blogs') return node;
              if (node.children) {
                const found = findBlogNode(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const bNode = findBlogNode(tree);
          if (bNode) targetPageId = bNode.id;
        }

        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.id === targetPageId) return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const blogNode = findNode(tree);
        if (blogNode && blogNode.children) {
          setBlogs(blogNode.children);
        } else {
          const allBlogPages: any[] = [];
          const collectBlogs = (nodes: any[]) => {
            for (const node of nodes) {
              if (node.fullPath?.includes('/blogs/') || node.slug?.startsWith('blog')) {
                allBlogPages.push(node);
              }
              if (node.children) collectBlogs(node.children);
            }
          };
          collectBlogs(tree);
          setBlogs(allBlogPages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch blog pages', err);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  const [updatingStatusId, setUpdatingStatusId] = React.useState<string | null>(null);

  const handleStatusChange = async (blogId: string, newStatus: 'draft' | 'published') => {
    setUpdatingStatusId(blogId);
    try {
      const action = newStatus === 'published' ? 'publish' : 'unpublish';
      const res = await fetch(`/api/admin/pages/${blogId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        setBlogs((prev) =>
          prev.map((b) => (b.id === blogId ? { ...b, status: newStatus } : b))
        );
        if (onRefresh) onRefresh();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const fetchTemplates = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to load templates', err);
    }
  }, []);

  React.useEffect(() => {
    fetchBlogs();
    fetchTemplates();
  }, [fetchBlogs, fetchTemplates]);

  // Auto-slugify
  React.useEffect(() => {
    if (!slugTouched) {
      const slugified = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(slugified);
    }
  }, [title, slugTouched]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this blog post? This will permanently delete the page and all of its sections.'
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Blog post deleted successfully');
        fetchBlogs();
        if (onRefresh) onRefresh();
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (err) {
      toast.error('Failed to delete blog post');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    setIsCreating(true);
    try {
      if (editingBlogId) {
        // UPDATE EXISTING BLOG
        await fetch(`/api/admin/pages/${editingBlogId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug }),
        });

        const getPageRes = await fetch(`/api/admin/pages/${editingBlogId}`);
        const pageData = await getPageRes.json();
        const detailSection = pageData.sections?.find((s: any) => s.type === 'blog-detail-block');

        if (detailSection) {
          const defaultContent = detailSection.content || {};
          const updatedContent = {
            ...defaultContent,
            heroBgImage: heroBgImage || undefined,
            category: category || undefined,
            industry: industry || undefined,
            bgColor: bgColor || undefined,
            gradientFrom: gradientFrom || '#4A3AFF',
            gradientVia: gradientVia || '#4842E9',
            gradientTo: gradientTo || '#6095FF',
            heroTitle: title || undefined,
            title: title || undefined,
            date: date || undefined,
            readTime: readTime || '3min read',

            authorCardAvatar: authorCardAvatar || undefined,
            authorCardName: authorCardName || undefined,
            authorCardRole: authorCardRole || undefined,
            authorCardBio: authorCardBio || undefined,

            contentSegments: contentSegments || [],
            conclusionParagraphs: conclusionParagraphs || [],

            calcTitle: calcTitle || 'Calculate your app development timeline!',
            calcDisclaimer: calcDisclaimer || undefined,
            calcPoints: calcPoints || [],
          };

          await fetch(`/api/admin/pages/${editingBlogId}/sections/${detailSection.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: updatedContent }),
          });
        }

        if (status === 'published') {
          await fetch(`/api/admin/pages/${editingBlogId}/actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'publish' }),
          });
        } else {
          await fetch(`/api/admin/pages/${editingBlogId}/actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'unpublish' }),
          });
        }

        toast.success('Blog post updated successfully');
        setShowCreateModal(false);
        resetForm();
        fetchBlogs();
        if (onRefresh) onRefresh();
        return;
      }

      // CREATE NEW BLOG
      const blogDetailTemplate = templates.find((t: any) =>
        t.templateSections?.some((ts: any) => ts.type === 'blog-detail-block')
      );

      const templateId = blogDetailTemplate?.id || null;
      if (!templateId) {
        throw new Error(
          'Blog Detail Template not found in CMS. Please run seed script first.'
        );
      }

      let targetParentId = pageId;
      if (!targetParentId) {
        const res = await fetch('/api/admin/pages');
        if (res.ok) {
          const tree = await res.json();
          const findBlogNode = (nodes: any[]): any => {
            for (const node of nodes) {
              if (node.fullPath === '/blogs' || node.slug === 'blogs') return node;
              if (node.children) {
                const found = findBlogNode(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const bNode = findBlogNode(tree);
          if (bNode) targetParentId = bNode.id;
        }
      }

      // 1. Create the page
      const createPageRes = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          parentId: targetParentId || null,
          templateId,
          pageType: 'standard',
          status: 'draft',
        }),
      });

      const pageData = await createPageRes.json();
      if (!createPageRes.ok) {
        throw new Error(pageData.error || 'Failed to create page');
      }

      // 2. Find detail section on new page
      const detailSection = pageData.sections?.find(
        (s: any) => s.type === 'blog-detail-block'
      );
      if (!detailSection) {
        throw new Error('Created page does not contain blog-detail-block section');
      }

      // 3. Prepare section content
      const defaultContent =
        detailSection.content ||
        blogDetailTemplate.templateSections?.find(
          (ts: any) => ts.type === 'blog-detail-block'
        )?.contentJson ||
        {};

      const updatedContent = {
        ...defaultContent,
        heroBgImage: heroBgImage || undefined,
        category: category || undefined,
        industry: industry || undefined,
        bgColor: bgColor || undefined,
        gradientFrom: gradientFrom || '#4A3AFF',
        gradientVia: gradientVia || '#4842E9',
        gradientTo: gradientTo || '#6095FF',
        heroTitle: title || undefined,
        title: title || undefined,
        date: date || undefined,
        readTime: readTime || '3min read',

        authorCardAvatar: authorCardAvatar || undefined,
        authorCardName: authorCardName || undefined,
        authorCardRole: authorCardRole || undefined,
        authorCardBio: authorCardBio || undefined,

        contentSegments: contentSegments && contentSegments.length > 0 ? contentSegments : defaultContent.contentSegments,

        conclusionParagraphs: conclusionParagraphs || [],

        calcTitle: calcTitle || 'Calculate your app development timeline!',
        calcDisclaimer: calcDisclaimer || undefined,
        calcPoints: calcPoints || [],
      };

      // 4. Save section content
      const updateSectionRes = await fetch(
        `/api/admin/pages/${pageData.id}/sections/${detailSection.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: updatedContent }),
        }
      );

      if (!updateSectionRes.ok) {
        throw new Error('Failed to save content fields to section');
      }

      // 5. Publish if requested
      if (status === 'published') {
        const publishRes = await fetch(`/api/admin/pages/${pageData.id}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'publish' }),
        });
        if (!publishRes.ok) {
          toast.warning(
            'Blog post created but failed to publish automatically. You can publish it manually.'
          );
        }
      }

      toast.success('Blog post created successfully');
      setShowCreateModal(false);

      resetForm();

      fetchBlogs();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create blog post');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#4B2A63]" />
            Blog Posts Manager
          </h2>
          <p className="text-xs text-slate-400">
            Create, view, and delete articles nested under this blog listing page.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 gap-2 h-10 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Blog Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-[#4B2A63] animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium text-sm">No blog posts found</p>
          <p className="text-xs text-slate-300 mt-1">
            Click &ldquo;Add Blog Post&rdquo; to create your first article.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                <th className="py-3 px-2">Article</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Publish Date</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog: any) => (
                <tr
                  key={blog.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm font-medium"
                >
                  <td className="py-3.5 px-2 max-w-[280px]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                        <img
                          src={
                            blog.previewThumbnail ||
                            '/blog-1.png'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/blog-1.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">
                          {blog.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {blog.fullPath}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-500 text-xs">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                      {blog.categoryId || 'Technology'}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-slate-400 text-xs">
                    {new Date(blog.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <select
                      value={blog.status || 'draft'}
                      onChange={(e) => handleStatusChange(blog.id, e.target.value as 'draft' | 'published')}
                      disabled={updatingStatusId === blog.id}
                      className={cn(
                        'text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight border focus:outline-none focus:ring-2 focus:ring-[#4B2A63]/20 cursor-pointer transition-all',
                        blog.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      )}
                    >
                      <option value="draft" className="bg-white text-slate-800 font-medium">Draft</option>
                      <option value="published" className="bg-white text-slate-800 font-medium">Published</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#4B2A63] hover:bg-[#4B2A63]/5"
                        onClick={() => handleEditBlog(blog.id)}
                        title="Edit Blog Post Content"
                        disabled={isFetchingDetail && editingBlogId === blog.id}
                      >
                        {isFetchingDetail && editingBlogId === blog.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Create Blog Modal ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4B2A63]" />
                    {editingBlogId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingBlogId ? 'Update article details, content segments, and conclusion.' : 'This will create a new dynamic page and pre-configure the blog details content.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 shrink-0 overflow-x-auto">
                {[
                  { id: 'hero', label: '1. Hero & Basic Details' },
                  { id: 'author', label: '2. Author Card' },
                  { id: 'content', label: '3. Content Segments' },
                  { id: 'conclusion', label: '4. Conclusion & Form' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                      activeTab === tab.id
                        ? 'border-[#4B2A63] text-[#4B2A63] border-b-[#4B2A63]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Form Scroll Area */}
              <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* TAB 1: Hero & Basic Details */}
                {activeTab === 'hero' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="admin-label">Blog Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. How Power BI Solves Mismatches"
                          className="admin-input font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">URL Slug</label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value);
                            setSlugTouched(true);
                          }}
                          placeholder="e.g. how-power-bi-solves-mismatches"
                          className="admin-input font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="admin-label">Topic / Category</label>
                        <CustomDropdown
                          value={category}
                          onChange={setCategory}
                          placeholder="Select Topic"
                          options={topics.map((t) => ({ value: t, label: t }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Industry</label>
                        <CustomDropdown
                          value={industry}
                          onChange={setIndustry}
                          placeholder="Select Industry"
                          options={industries.map((ind) => ({ value: ind, label: ind }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Published Date</label>
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="e.g. May 15,2026"
                          className="admin-input font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Time Estimation</label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="e.g. 3min read"
                          className="admin-input font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <ColorPickerField
                        fieldKey="bgColor"
                        label="Hero BG Color"
                        value={bgColor}
                        onChange={setBgColor}
                      />
                      <ColorPickerField
                        fieldKey="gradientFrom"
                        label="BG Gradient 1"
                        value={gradientFrom}
                        onChange={setGradientFrom}
                      />
                      <ColorPickerField
                        fieldKey="gradientVia"
                        label="BG Gradient 2"
                        value={gradientVia}
                        onChange={setGradientVia}
                      />
                      <ColorPickerField
                        fieldKey="gradientTo"
                        label="BG Gradient 3"
                        value={gradientTo}
                        onChange={setGradientTo}
                      />
                    </div>

                    <MediaField
                      fieldKey="heroBgImage"
                      label="Banner Image Upload"
                      value={heroBgImage}
                      onChange={setHeroBgImage}
                    />
                  </div>
                )}

                {/* TAB 2: Author Card */}
                {activeTab === 'author' && (
                  <div className="space-y-5">
                    <MediaField
                      fieldKey="authorCardAvatar"
                      label="Author Image Upload"
                      value={authorCardAvatar}
                      onChange={setAuthorCardAvatar}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="admin-label">Author Name</label>
                        <input
                          type="text"
                          value={authorCardName}
                          onChange={(e) => setAuthorCardName(e.target.value)}
                          placeholder="e.g. Saurabh Singh"
                          className="admin-input font-bold"
                        />
                        <p className="text-[10px] text-slate-400">Note: Author Name is automatically called in the Hero section before Published Date.</p>
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Designation</label>
                        <input
                          type="text"
                          value={authorCardRole}
                          onChange={(e) => setAuthorCardRole(e.target.value)}
                          placeholder="e.g. Managing Director"
                          className="admin-input font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="admin-label">Author Description</label>
                      <textarea
                        rows={3}
                        value={authorCardBio}
                        onChange={(e) => setAuthorCardBio(e.target.value)}
                        placeholder="Author biography or short details..."
                        className="admin-input font-medium resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Content Segments (Dynamic & Unsequenced) */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dynamic Content Segments</h4>
                        <p className="text-[11px] text-slate-400">Add Key Takeaways, Items, Cards (50 char limit), or Tables in any order.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setContentSegments(prev => [...prev, { type: 'key-takeaways', id: `seg-${Date.now()}`, tocTitle: 'Key takeaways', title: 'Key takeaways:', points: ['New takeaway point'], descriptions: [] }])}
                          className="text-xs rounded-full"
                        >
                          + Key Takeaways
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setContentSegments(prev => [...prev, { type: 'items', id: `seg-${Date.now()}`, tocTitle: 'New Section', items: [{ title: 'Section Title', descriptions: ['Paragraph text...'], image: '' }] }])}
                          className="text-xs rounded-full"
                        >
                          + Items Section
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setContentSegments(prev => [...prev, { type: 'cards', id: `seg-${Date.now()}`, tocTitle: 'Benefits', cards: [{ title: 'Card Title', description: 'Description max 50 chars' }] }])}
                          className="text-xs rounded-full"
                        >
                          + Cards
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setContentSegments(prev => [...prev, { type: 'table', id: `seg-${Date.now()}`, tocTitle: 'Timeline Table', column1Title: 'Complexity', column2Title: 'Timelines', rows: [{ col1Title: 'Simple App', col1Desc: 'Basic setup', col2Text: '2-4 Months' }] }])}
                          className="text-xs rounded-full"
                        >
                          + Table
                        </Button>
                      </div>
                    </div>

                    {contentSegments.map((seg, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 relative">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-black text-[#4B2A63] uppercase">
                            Segment #{sIdx + 1} &mdash; {seg.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => setContentSegments(prev => prev.filter((_, i) => i !== sIdx))}
                            className="p-1 text-rose-500 hover:bg-rose-100 rounded-full text-xs font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="admin-label">Left Sidebar TOC Tab Label</label>
                          <input
                            type="text"
                            value={seg.tocTitle || ''}
                            onChange={(e) => {
                              const copy = [...contentSegments];
                              copy[sIdx].tocTitle = e.target.value;
                              setContentSegments(copy);
                            }}
                            placeholder="e.g. Why Multi-System Data Mismatches Happen"
                            className="admin-input font-medium"
                          />
                        </div>

                        {/* 1. Key Takeaways Segment */}
                        {seg.type === 'key-takeaways' && (
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                            <div className="space-y-1">
                              <label className="admin-label">Segment Title</label>
                              <input
                                type="text"
                                value={seg.title || ''}
                                onChange={(e) => {
                                  const copy = [...contentSegments];
                                  copy[sIdx].title = e.target.value;
                                  setContentSegments(copy);
                                }}
                                className="admin-input font-bold"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="admin-label">Points</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].points = [...(copy[sIdx].points || []), 'New point...'];
                                    setContentSegments(copy);
                                  }}
                                  className="text-[11px] font-bold text-[#4B2A63] hover:underline"
                                >
                                  + Add Point
                                </button>
                              </div>
                              {seg.points?.map((pt: string, pIdx: number) => (
                                <div key={pIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={pt}
                                    onChange={(e) => {
                                      const copy = [...contentSegments];
                                      copy[sIdx].points[pIdx] = e.target.value;
                                      setContentSegments(copy);
                                    }}
                                    className="admin-input text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const copy = [...contentSegments];
                                      copy[sIdx].points = copy[sIdx].points.filter((_: any, i: number) => i !== pIdx);
                                      setContentSegments(copy);
                                    }}
                                    className="text-rose-500 p-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Items Segment */}
                        {seg.type === 'items' && (
                          <div className="space-y-4 bg-white p-3 rounded-xl border border-slate-200">
                            {seg.items?.map((item: any, iIdx: number) => (
                              <div key={iIdx} className="p-3 border border-slate-100 rounded-lg space-y-3 bg-slate-50/50">
                                <div className="space-y-1">
                                  <RichTextField
                                    fieldKey={`item-title-${iIdx}`}
                                    label="Item Title"
                                    value={item.title || ''}
                                    onChange={(val) => {
                                      const copy = [...contentSegments];
                                      copy[sIdx].items[iIdx].title = val;
                                      setContentSegments(copy);
                                    }}
                                  />
                                </div>

                                <MediaField
                                  fieldKey={`item-image-${iIdx}`}
                                  label="Image Upload"
                                  value={item.image || ''}
                                  onChange={(val) => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].items[iIdx].image = val;
                                    setContentSegments(copy);
                                  }}
                                />

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="admin-label">Descriptions</label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const copy = [...contentSegments];
                                        copy[sIdx].items[iIdx].descriptions = [...(copy[sIdx].items[iIdx].descriptions || []), ''];
                                        setContentSegments(copy);
                                      }}
                                      className="text-[11px] font-bold text-[#4B2A63] hover:underline"
                                    >
                                      + Add Description
                                    </button>
                                  </div>
                                  {item.descriptions?.map((desc: string, dIdx: number) => (
                                    <div key={dIdx} className="flex items-start gap-2">
                                      <div className="flex-1">
                                        <RichTextField
                                          fieldKey={`item-desc-${iIdx}-${dIdx}`}
                                          label={`Description ${dIdx + 1}`}
                                          value={desc || ''}
                                          onChange={(val) => {
                                            const copy = [...contentSegments];
                                            copy[sIdx].items[iIdx].descriptions[dIdx] = val;
                                            setContentSegments(copy);
                                          }}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const copy = [...contentSegments];
                                          copy[sIdx].items[iIdx].descriptions = copy[sIdx].items[iIdx].descriptions.filter((_: any, i: number) => i !== dIdx);
                                          setContentSegments(copy);
                                        }}
                                        className="text-rose-500 p-1 mt-7 cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const copy = [...contentSegments];
                                copy[sIdx].items = [...(copy[sIdx].items || []), { title: 'New Item', descriptions: [], image: '' }];
                                setContentSegments(copy);
                              }}
                              className="text-xs rounded-full w-full"
                            >
                              + Add Item Button
                            </Button>
                          </div>
                        )}

                        {/* 3. Cards Segment */}
                        {seg.type === 'cards' && (
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                            {seg.cards?.map((card: any, cIdx: number) => (
                              <div key={cIdx} className="p-3 border border-slate-100 rounded-lg space-y-2 bg-slate-50/50">
                                <div className="space-y-1">
                                  <label className="admin-label">Card Title</label>
                                  <input
                                    type="text"
                                    value={card.title || ''}
                                    onChange={(e) => {
                                      const copy = [...contentSegments];
                                      copy[sIdx].cards[cIdx].title = e.target.value;
                                      setContentSegments(copy);
                                    }}
                                    className="admin-input font-bold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="admin-label">Description (200 Char Limit)</label>
                                    <span className={cn('text-[10px] font-mono', (card.description?.length || 0) > 200 ? 'text-rose-600 font-bold' : 'text-slate-400')}>
                                      {card.description?.length || 0}/200
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    maxLength={200}
                                    value={card.description || ''}
                                    onChange={(e) => {
                                      const copy = [...contentSegments];
                                      copy[sIdx].cards[cIdx].description = e.target.value.slice(0, 200);
                                      setContentSegments(copy);
                                    }}
                                    className="admin-input text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const copy = [...contentSegments];
                                copy[sIdx].cards = [...(copy[sIdx].cards || []), { title: 'New Card', description: 'Short desc max 200 chars' }];
                                setContentSegments(copy);
                              }}
                              className="text-xs rounded-full w-full"
                            >
                              + Add Card Button
                            </Button>
                          </div>
                        )}

                        {/* 4. Table Segment */}
                        {seg.type === 'table' && (
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="admin-label">Column 1 Title</label>
                                <input
                                  type="text"
                                  value={seg.column1Title || ''}
                                  onChange={(e) => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].column1Title = e.target.value;
                                    setContentSegments(copy);
                                  }}
                                  className="admin-input font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="admin-label">Column 2 Title</label>
                                <input
                                  type="text"
                                  value={seg.column2Title || ''}
                                  onChange={(e) => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].column2Title = e.target.value;
                                    setContentSegments(copy);
                                  }}
                                  className="admin-input font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="space-y-3">
                                {seg.rows?.map((row: any, rIdx: number) => (
                                  <div key={rIdx} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 1 Title</label>
                                        <input
                                          type="text"
                                          placeholder="Column 1 Title"
                                          value={row.col1Title || ''}
                                          onChange={(e) => {
                                            const copy = [...contentSegments];
                                            copy[sIdx].rows[rIdx].col1Title = e.target.value;
                                            setContentSegments(copy);
                                          }}
                                          className="admin-input text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 2 Text</label>
                                        <input
                                          type="text"
                                          placeholder="Column 2 Value"
                                          value={row.col2Text || ''}
                                          onChange={(e) => {
                                            const copy = [...contentSegments];
                                            copy[sIdx].rows[rIdx].col2Text = e.target.value;
                                            setContentSegments(copy);
                                          }}
                                          className="admin-input text-xs"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 1 Description (Optional)</label>
                                      <textarea
                                        rows={2}
                                        placeholder="Enter Column 1 description..."
                                        value={row.col1Desc || ''}
                                        onChange={(e) => {
                                          const copy = [...contentSegments];
                                          copy[sIdx].rows[rIdx].col1Desc = e.target.value;
                                          setContentSegments(copy);
                                        }}
                                        className="admin-input text-xs w-full resize-y"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].rows = [...(copy[sIdx].rows || []), { col1Title: 'Item', col1Desc: '', col2Text: 'Matched Value' }];
                                    setContentSegments(copy);
                                  }}
                                  className="text-xs rounded-full w-full"
                                >
                                  + Add Table Row
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: Conclusion & Form */}
                {activeTab === 'conclusion' && (
                  <div className="space-y-6">
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Conclusion (Single Block)</h4>
                        <button
                          type="button"
                          onClick={() => setConclusionParagraphs(prev => [...prev, 'New conclusion paragraph...'])}
                          className="text-xs font-bold text-[#4B2A63] hover:underline"
                        >
                          + Add Description Button
                        </button>
                      </div>

                      {conclusionParagraphs.map((para, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2">
                          <textarea
                            rows={3}
                            value={para}
                            onChange={(e) => {
                              const copy = [...conclusionParagraphs];
                              copy[cIdx] = e.target.value;
                              setConclusionParagraphs(copy);
                            }}
                            className="admin-input text-xs resize-y"
                          />
                          <button
                            type="button"
                            onClick={() => setConclusionParagraphs(prev => prev.filter((_, i) => i !== cIdx))}
                            className="text-rose-500 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">Sidebar Form</h4>

                      <div className="space-y-1">
                        <label className="admin-label">Form Title</label>
                        <input
                          type="text"
                          value={calcTitle}
                          onChange={(e) => setCalcTitle(e.target.value)}
                          placeholder="e.g. Calculate your app development timeline!"
                          className="admin-input font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="admin-label">Disclaimer</label>
                        <input
                          type="text"
                          value={calcDisclaimer}
                          onChange={(e) => setCalcDisclaimer(e.target.value)}
                          placeholder="Form disclaimer agreement..."
                          className="admin-input font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="admin-label">Points</label>
                          <button
                            type="button"
                            onClick={() => setCalcPoints(prev => [...prev, 'New feature point'])}
                            className="text-xs font-bold text-[#4B2A63] hover:underline"
                          >
                            + Add Points Button
                          </button>
                        </div>
                        {calcPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const copy = [...calcPoints];
                                copy[pIdx] = e.target.value;
                                setCalcPoints(copy);
                              }}
                              className="admin-input text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setCalcPoints(prev => prev.filter((_, i) => i !== pIdx))}
                              className="text-rose-500 p-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="admin-label">
                      Publish Immediately
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={status === 'published'}
                      onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        status === 'published' ? 'bg-[#4B2A63]' : 'bg-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
                          status === 'published' ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {editingBlogId ? 'Saving...' : 'Creating...'}
                        </>
                      ) : (
                        editingBlogId ? 'Save Changes' : 'Create Blog Post'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
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
  const [sectionSearchQuery, setSectionSearchQuery] = React.useState('');
  const [librarySections, setLibrarySections] = React.useState<any[]>([]);
  const [previewSectionType, setPreviewSectionType] = React.useState<string | null>(null);
  const [seoForm, setSeoForm] = React.useState({
    title: '',
    description: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
    ogTitle: '',
    ogDescription: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    headerScripts: '',
    footerScripts: '',
    headingH1: '',
  });
  const [savedSeoSnapshot, setSavedSeoSnapshot] = React.useState('');
  const [dirtySections, setDirtySections] = React.useState<Set<string>>(new Set());
  const [showExamplePreview, setShowExamplePreview] = React.useState(false);

  // Navigation placement state
  const [navItems, setNavItems] = React.useState<NavigationTreeItem[]>([]);
  const [megaMenu, setMegaMenu] = React.useState<MegaMenuPayload | null>(null);
  const [megaMenuLoading, setMegaMenuLoading] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/admin/navigation/hierarchy?location=header-main&for=page-create')
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setNavItems(data.items || []);
      })
      .catch((err) => console.error('Failed to load navigation items:', err));
  }, []);

  React.useEffect(() => {
    if (!page?.navigationItemId) {
      setMegaMenu(null);
      return;
    }

    const selectedNav = navItems.find((n) => n.id === page.navigationItemId);
    if (!selectedNav?.megaMenuEnabled) {
      setMegaMenu(null);
      return;
    }

    setMegaMenuLoading(true);
    fetch(`/api/admin/navigation/hierarchy?navigationItemId=${page.navigationItemId}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMegaMenu(data);
        } else {
          setMegaMenu(null);
        }
      })
      .catch(() => setMegaMenu(null))
      .finally(() => setMegaMenuLoading(false));
  }, [page?.navigationItemId, navItems]);

  const activeCategory = React.useMemo(() => {
    return megaMenu?.categories.find((c) => c.id === (page?.megaMenuCategoryId || '')) || null;
  }, [megaMenu, page?.megaMenuCategoryId]);

  const activeSubCategory = React.useMemo(() => {
    return activeCategory?.subCategories.find((s) => s.id === (page?.megaMenuSubCategoryId || '')) || null;
  }, [activeCategory, page?.megaMenuSubCategoryId]);

  const handleNavigationChange = (
    newNavId: string,
    newMegaCatId: string = '',
    newMegaSubCatId: string = '',
    newMegaSubSubCatId: string = ''
  ) => {
    if (!page) return;

    const selectedNav = navItems.find((n) => n.id === newNavId);
    const pageSlug = resolvePageSlug(page.title, page.slug);

    let newFullPath = `/${pageSlug}`;

    setPage((prev) =>
      prev
        ? {
            ...prev,
            navigationItemId: newNavId || null,
            megaMenuCategoryId: newMegaCatId || null,
            megaMenuSubCategoryId: newMegaSubCatId || null,
            megaMenuSubSubCategoryId: newMegaSubSubCatId || null,
            fullPath: newFullPath,
            slug: pageSlug,
          }
        : prev
    );
  };

  const isLandingPage = React.useMemo(() => {
    return page?.template?.name?.toLowerCase().includes('landing page') || page?.pageType === 'landing-page' || false;
  }, [page]);

  const isBlogsListingPage = React.useMemo(() => {
    return page?.sections.some((s) => s.type === 'blog-list-block') || false;
  }, [page]);

  const isCaseStudyListingPage = React.useMemo(() => {
    return page?.sections.some((s) => s.type === 'case-study-list') || false;
  }, [page]);

  const isDirty = React.useMemo(() => {
    if (!page) return false;
    const current = JSON.stringify({
      title: page.title,
      slug: page.slug,
      fullPath: page.fullPath,
      navigationItemId: page.navigationItemId || null,
      megaMenuCategoryId: page.megaMenuCategoryId || null,
      megaMenuSubCategoryId: page.megaMenuSubCategoryId || null,
      megaMenuSubSubCategoryId: page.megaMenuSubSubCategoryId || null,
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
        fullPath: p.fullPath,
        navigationItemId: p.navigationItemId || null,
        megaMenuCategoryId: p.megaMenuCategoryId || null,
        megaMenuSubCategoryId: p.megaMenuSubCategoryId || null,
        megaMenuSubSubCategoryId: p.megaMenuSubSubCategoryId || null,
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
        ogTitle: data.seo?.ogTitle || '',
        ogDescription: data.seo?.ogDescription || '',
        twitterCard: data.seo?.twitterCard || 'summary_large_image',
        twitterTitle: data.seo?.twitterTitle || '',
        twitterDescription: data.seo?.twitterDescription || '',
        twitterImage: data.seo?.twitterImage || '',
        headerScripts: data.seo?.headerScripts || '',
        footerScripts: data.seo?.footerScripts || '',
        headingH1: data.seo?.headingH1 || '',
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

  const fetchLibrarySections = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      if (res.ok) {
        const data = await res.json();
        setLibrarySections(data);
      }
    } catch (err) {
      console.error('Failed to load library sections', err);
    }
  }, []);

  React.useEffect(() => {
    fetchPage();
    fetchLibrarySections();
  }, [fetchPage, fetchLibrarySections]);

  // ---- Save All ----
  const handleSaveAll = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
      const metaRes = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          fullPath: page.fullPath,
          navigationItemId: page.navigationItemId || null,
          megaMenuCategoryId: page.megaMenuCategoryId || null,
          megaMenuSubCategoryId: page.megaMenuSubCategoryId || null,
          megaMenuSubSubCategoryId: page.megaMenuSubSubCategoryId || null,
        }),
      });
      if (!metaRes.ok) throw new Error('Failed to save page settings');

      const seoRes = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: seoForm }),
      });
      if (!seoRes.ok) throw new Error('Failed to save SEO');

      const secRes = await fetch(`/api/admin/pages/${pageId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: page.sections.map((s) => ({ id: s.id, content: s.content })),
        }),
      });
      if (!secRes.ok) throw new Error('Failed to save page sections');

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
    setIsPublishing(true);
    try {
      // 1. Save all section draft changes to DB first
      const secRes = await fetch(`/api/admin/pages/${pageId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: page.sections.map((s) => ({ id: s.id, content: s.content })),
        }),
      });
      if (!secRes.ok) throw new Error('Failed to save page sections');

      // 2. Execute publish action
      const res = await fetch(`/api/admin/pages/${pageId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });
      if (!res.ok) throw new Error('Failed to publish');
      toast.success('Page published successfully to live website');
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
    toast.success('Section saved to draft preview');
    setDirtySections((prev) => {
      const next = new Set(prev);
      next.delete(section.id);
      return next;
    });
  };

  const handleDiscardSection = async (sectionId: string) => {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to reload section');
      const savedSection = data.sections?.find((s: PageSection) => s.id === sectionId);
      if (savedSection) {
        setPage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sections: prev.sections.map((s) => (s.id === sectionId ? savedSection : s)),
          };
        });
        setDirtySections((prev) => {
          const next = new Set(prev);
          next.delete(sectionId);
          return next;
        });
        toast.info('Section changes discarded');
      }
    } catch {
      toast.error('Failed to discard changes');
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
    const libSec = librarySections.find(
      (s) => s.type === type && (s.variant === 'default' || !s.variant)
    ) || librarySections.find((s) => s.type === type);
    const isValidUuid = libSec?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(libSec.id);

    const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        orderIndex: afterIndex !== undefined ? afterIndex + 1 : undefined,
        sectionLibraryId: isValidUuid ? libSec.id : undefined,
        content: libSec?.contentJson || {},
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
    } else {
      toast.error('Failed to delete section');
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
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowExamplePreview(true)}
              className="rounded-full gap-2 h-10 border-[#4B2A63]/30 text-[#4B2A63] hover:bg-[#4B2A63]/5 font-medium"
            >
              <Monitor className="w-4 h-4 text-[#4B2A63]" />
              <span>Example Preview</span>
            </Button>
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


          {isBlogsListingPage && (
            <BlogManager
              pageId={pageId}
              onRefresh={fetchPage}
              blogListSection={page?.sections.find((s) => s.type === 'blog-list-block')}
            />
          )}

          {isCaseStudyListingPage && (
            <CaseStudyManager pageId={pageId} onRefresh={fetchPage} />
          )}

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
              {!isLandingPage && (
                <Button
                  onClick={() => setShowAddSection(!showAddSection)}
                  variant="outline"
                  className="rounded-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </Button>
              )}
            </div>
          </div>

          {/* Add Section Palette */}
          <AnimatePresence>
            {showAddSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl border-2 border-dashed border-[#4B2A63]/20 p-6 flex flex-col gap-4 overflow-hidden"
              >
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={sectionSearchQuery}
                    onChange={(e) => setSectionSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B2A63]/20 focus:border-[#4B2A63]/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {SECTION_REGISTRY.filter((s) => {
                    if (s.label.includes('Legacy')) return false;
                    if (s.type === 'mfg-icons') {
                      return page.template?.name === 'Intelligent ERP Automation Template';
                    }
                    if (sectionSearchQuery.trim()) {
                      const query = sectionSearchQuery.toLowerCase();
                      if (!s.label.toLowerCase().includes(query) && !s.description.toLowerCase().includes(query)) {
                        return false;
                      }
                    }
                    return true;
                  }).map((s) => (
                    <div
                      key={s.type}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between gap-3 group hover:border-[#4B2A63]/20 transition-all hover:shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {s.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() => setPreviewSectionType(s.type)}
                          className="flex-1 text-xs py-1 h-8 rounded-lg border-[#4B2A63]/20 text-[#4B2A63] hover:bg-[#4B2A63]/5 font-semibold"
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => { addSection(s.type); setSectionSearchQuery(''); }}
                          className="flex-1 text-xs py-1 h-8 rounded-lg bg-[#4B2A63] text-white hover:bg-[#3B198F] font-semibold"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
              onReorder={isLandingPage ? () => {} : reorderSections}
              className="space-y-3"
            >
              {page.sections.map((section, index) => (
                <Reorder.Item key={section.id} value={section} drag={!isLandingPage ? "y" : false}>
                  <SectionEditorCard
                    section={section}
                    schema={findSchemaForSection(section, templateSchemas)}
                    index={index}
                    total={page.sections.length}
                    isExpanded={expandedSections.has(section.id)}
                    onToggleExpand={() => toggleSectionExpand(section.id)}
                    onContentChange={handleSectionContentChange}
                    onSave={handleSaveSection}
                    onDiscard={handleDiscardSection}
                    onDelete={deleteSection}
                    onMove={moveSection}
                    isSectionDirty={dirtySections.has(section.id)}
                    disableStructureChanges={isLandingPage}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* ===== Sidebar ===== */}
        <div className="space-y-4">
          {/* ===== Navigation placement Card ===== */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-800 text-base">Navigation placement</h2>

            {page.status !== 'published' && page.navigationItemId && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Draft Page Notice
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  This page is currently a <strong>Draft</strong>. Live navbar links will return 404 until you click <strong>Publish</strong>.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                MENU ITEM (NAV BAR)
              </label>
              <select
                value={page.navigationItemId || ''}
                onChange={(e) => handleNavigationChange(e.target.value)}
                className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm font-semibold outline-none border border-slate-200 focus:border-[#4B2A63]/30 focus:ring-2 focus:ring-[#4B2A63]/10 text-slate-800 cursor-pointer"
              >
                <option value="">None — unlinked page</option>
                {navItems.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} {n.megaMenuEnabled ? '(Mega Menu)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {megaMenuLoading ? (
              <p className="text-xs text-slate-400 animate-pulse">Loading Mega Menu structure...</p>
            ) : megaMenu ? (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#4B2A63]" />
                    Mega Menu Linking (Optional)
                  </h4>
                </div>

                <div className="space-y-3 pl-3 border-l-2 border-slate-100">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Category (Tab)
                    </label>
                    <select
                      value={page.megaMenuCategoryId || ''}
                      onChange={(e) => handleNavigationChange(page.navigationItemId || '', e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none border border-slate-200 focus:border-[#4B2A63]/30 text-slate-800 cursor-pointer"
                    >
                      <option value="">None — do not link in Mega Menu</option>
                      {megaMenu.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {page.megaMenuCategoryId && activeCategory && activeCategory.subCategories.length > 0 && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                        Sub Category (Panel)
                      </label>
                      <select
                        value={page.megaMenuSubCategoryId || ''}
                        onChange={(e) =>
                          handleNavigationChange(
                            page.navigationItemId || '',
                            page.megaMenuCategoryId || '',
                            e.target.value
                          )
                        }
                        className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none border border-slate-200 focus:border-[#4B2A63]/30 text-slate-800 cursor-pointer"
                      >
                        <option value="">None — select sub category</option>
                        {activeCategory.subCategories.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {page.megaMenuSubCategoryId && activeSubCategory && activeSubCategory.subSubCategories.length > 0 && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                        Leaf Link (Grid Link)
                      </label>
                      <select
                        value={page.megaMenuSubSubCategoryId || ''}
                        onChange={(e) =>
                          handleNavigationChange(
                            page.navigationItemId || '',
                            page.megaMenuCategoryId || '',
                            page.megaMenuSubCategoryId || '',
                            e.target.value
                          )
                        }
                        className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none border border-slate-200 focus:border-[#4B2A63]/30 text-slate-800 cursor-pointer"
                      >
                        <option value="">None — select leaf link</option>
                        {activeSubCategory.subSubCategories.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* ===== Page General Settings ===== */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B2A63]">
              <Layers className="w-5 h-5" />
              <h2 className="font-bold">Page Settings</h2>
            </div>

            <div className="space-y-1.5">
              <label className="admin-label">Page Title</label>
              <input
                type="text"
                placeholder="Page Title"
                value={page.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setPage((prev) => (prev ? { ...prev, title: val } : prev));
                }}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20 font-semibold text-slate-900"
              />
            </div>

            {/* Single Dynamic URL/Slug Field */}
            {(() => {
              const isNested = Boolean(
                page.fullPath && page.fullPath.split('/').filter(Boolean).length > 1
              );

              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="admin-label">
                      {isNested ? 'Full URL Path' : 'URL Slug'}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isNested ? 'Category Route' : 'Individual Page'}
                    </span>
                  </div>
                  {isNested ? (
                    <input
                      type="text"
                      placeholder="/solutions/example/page"
                      value={page.fullPath}
                      onChange={(e) => {
                        let val = e.target.value.toLowerCase().replace(/[^a-z0-9-/]+/g, '');
                        if (val && !val.startsWith('/')) val = `/${val}`;
                        const parts = val.split('/').filter(Boolean);
                        const lastSegment = parts.length > 0 ? parts[parts.length - 1] : page.slug;
                        setPage((prev) => (prev ? { ...prev, fullPath: val, slug: lastSegment } : prev));
                      }}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20 text-slate-800 font-medium"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="page-slug"
                      value={page.slug}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '');
                        setPage((prev) =>
                          prev ? { ...prev, slug: val, fullPath: `/${val}` } : prev
                        );
                      }}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20 text-slate-800 font-medium"
                    />
                  )}
                  <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                    Note: Changing the URL will automatically create a 301 Permanent Redirect from the old URL to the new URL so existing links don&apos;t break.
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 sticky top-36 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B2A63]">
              <Globe className="w-5 h-5" />
              <h2 className="font-bold">SEO Settings</h2>
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">
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
              <label className="admin-label">
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
              <label className="admin-label">
                OG Image
              </label>
              <MediaField
                fieldKey="seo-og-image"
                value={seoForm.ogImage}
                onChange={(val) => setSeoForm({ ...seoForm, ogImage: val })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">
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

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="admin-label">Page H1 (optional)</label>
              <input
                placeholder="Overrides default page heading when used by templates"
                value={seoForm.headingH1}
                onChange={(e) => setSeoForm({ ...seoForm, headingH1: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">OG Title</label>
              <input
                placeholder="Defaults to meta title"
                value={seoForm.ogTitle}
                onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">OG Description</label>
              <textarea
                placeholder="Defaults to meta description"
                value={seoForm.ogDescription}
                onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none min-h-[80px] focus:ring-2 focus:ring-[#4B2A63]/10 resize-y border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Twitter Card</label>
              <select
                value={seoForm.twitterCard}
                onChange={(e) => setSeoForm({ ...seoForm, twitterCard: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Twitter Title</label>
              <input
                placeholder="Defaults to OG/meta title"
                value={seoForm.twitterTitle}
                onChange={(e) => setSeoForm({ ...seoForm, twitterTitle: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Twitter Description</label>
              <textarea
                placeholder="Defaults to OG/meta description"
                value={seoForm.twitterDescription}
                onChange={(e) => setSeoForm({ ...seoForm, twitterDescription: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none min-h-[80px] focus:ring-2 focus:ring-[#4B2A63]/10 resize-y border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Twitter Image</label>
              <MediaField
                fieldKey="seo-twitter-image"
                value={seoForm.twitterImage}
                onChange={(val) => setSeoForm({ ...seoForm, twitterImage: val })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Page Header Scripts</label>
              <textarea
                placeholder="Optional JS for this page only (afterInteractive)"
                value={seoForm.headerScripts}
                onChange={(e) => setSeoForm({ ...seoForm, headerScripts: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-mono outline-none min-h-[80px] focus:ring-2 focus:ring-[#4B2A63]/10 resize-y border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="admin-label">Page Footer Scripts</label>
              <textarea
                placeholder="Optional JS for this page only (lazyOnload)"
                value={seoForm.footerScripts}
                onChange={(e) => setSeoForm({ ...seoForm, footerScripts: e.target.value })}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-mono outline-none min-h-[80px] focus:ring-2 focus:ring-[#4B2A63]/10 resize-y border border-transparent focus:border-[#4B2A63]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Section Preview Modal ===== */}
      <AnimatePresence>
        {previewSectionType && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#4B2A63]" />
                    Section Preview: {SECTION_REGISTRY.find(s => s.type === previewSectionType)?.label || previewSectionType}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This is a live preview showing how this block renders with default library content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSectionType(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Scrollable Preview area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-white min-h-[300px]">
                  <SectionRenderer
                    section={{
                      id: 'preview-temp-id',
                      type: previewSectionType,
                      content: librarySections.find(s => s.type === previewSectionType)?.contentJson || {},
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setPreviewSectionType(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
                <Button
                  type="button"
                  onClick={() => {
                    addSection(previewSectionType);
                    setPreviewSectionType(null);
                  }}
                  className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 gap-2 h-10 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add to Page
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== Example Preview Modal ===== */}
      <AnimatePresence>
        {showExamplePreview && page && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4B2A63]/10 text-[#4B2A63] flex items-center justify-center font-bold">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight flex items-center gap-2">
                      Example Preview
                      <span className="text-[10px] font-bold bg-[#4B2A63]/10 text-[#4B2A63] px-2 py-0.5 rounded-full uppercase">
                        Saved Draft
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{page.fullPath}</p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowExamplePreview(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Live Draft View Container */}
              <div className="flex-1 bg-slate-100 overflow-y-auto flex items-center justify-center p-6">
                <div className="bg-white shadow-xl overflow-y-auto h-full w-full rounded-xl border border-slate-200">
                  <div className="w-full">
                    {page.sections.map((section, idx) => (
                      <SectionRenderer key={section.id ? `${section.id}-${idx}` : `${section.type}-${idx}`} section={section} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer: Confirm & Action Bar */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                <p className="text-xs text-slate-500">
                  Reviewing saved sections. Unsaved section changes will not appear until saved.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowExamplePreview(false)}
                    className="rounded-full px-5 h-10 border-slate-200 text-slate-600"
                  >
                    Close Preview
                  </Button>
                  {page.status === 'draft' && (
                    <Button
                      type="button"
                      disabled={isPublishing}
                      onClick={async () => {
                        await handlePublish();
                        setShowExamplePreview(false);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 gap-2 h-10 font-semibold shadow-sm"
                    >
                      {isPublishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Confirm & Publish Page
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

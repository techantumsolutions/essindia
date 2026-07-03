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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import {
  SectionEditorCard,
  setNestedValue,
} from '@/components/admin/page-editor';
import type { PageSection, JsonValue } from '@/components/admin/page-editor';
import { RichTextField } from '@/components/admin/page-editor/RichTextField';
import { MediaField } from '@/components/admin/page-editor/MediaField';

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
// Blog Posts Manager Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Case Study Posts Manager Component
// ---------------------------------------------------------------------------

function CaseStudyManager({ pageId, onRefresh }: { pageId: string; onRefresh: () => void }) {
  const [studies, setStudies] = React.useState<any[]>([]);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
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
        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.id === pageId) return node;
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
    if (!slugTouched) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, slugTouched]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Case study deleted successfully');
        fetchStudies();
        onRefresh();
      } else {
        toast.error('Failed to delete case study');
      }
    } catch (err) {
      toast.error('Failed to delete case study');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return toast.error('Title and Slug are required');
    setIsCreating(true);
    try {
      // 1. Get Template
      const detailTemplate = templates.find((t: any) =>
        t.templateSections?.some((ts: any) => ts.type === 'case-study-detail')
      );
      if (!detailTemplate) {
        throw new Error('Case Study Detail template not found');
      }
      const templateId = detailTemplate.id;

      // 2. Create Page
      const createPageRes = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          parentId: pageId,
          templateId,
          pageType: 'standard',
          status: 'draft',
        }),
      });

      if (!createPageRes.ok) throw new Error('Failed to create page');
      const pageData = await createPageRes.json();

      // 3. Find section
      const detailSection = pageData.sections?.find((s: any) => s.type === 'case-study-detail');
      if (!detailSection) {
        throw new Error('Created page does not contain case-study-detail section');
      }

      // 4. Update section with all form data
      const defaultContent = detailSection.content || detailTemplate.templateSections?.find((ts: any) => ts.type === 'case-study-detail')?.contentJson || {};

      const filteredChallengePoints = challengePoints.filter(p => p.title.trim() || p.description.trim());
      const filteredSolutions = solutionModules.filter(m => m.name.trim() || m.description.trim() || m.icon.trim());
      const filteredResults = resultsItems.filter(r => r.trim());
      const filteredOverviewImages = [overviewImage1, overviewImage2].filter(img => img.trim());

      const updatedContent = {
        ...defaultContent,
        title,
        titleColor: '#ffffff',
        bgColor: 'linear-gradient(135deg, #1e2445 0%, #292048 100%)',
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

      const updateSectionRes = await fetch(
        `/api/admin/pages/${pageData.id}/sections/${detailSection.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: updatedContent }),
        }
      );

      if (!updateSectionRes.ok) {
        throw new Error('Failed to save case study details');
      }

      // 5. Publish if requested
      if (status === 'published') {
        await fetch(`/api/admin/pages/${pageData.id}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'publish' }),
        });
      }

      toast.success('Case Study created successfully');
      setShowCreateModal(false);

      // Reset
      setTitle(''); setSlug(''); setTopic(''); setIndustry(''); setDate(''); setImage('');
      setOverview(''); setOverviewImage1(''); setOverviewImage2('');
      setChallengeTitle(''); setChallengeDescription(''); setChallengePoints([{ title: '', description: '' }]);
      setSolutionsTitle(''); setSolutionsDescription(''); setSolutionModules([{ name: '', description: '', icon: '' }]);
      setResultsTitle(''); setResultsItems(['']);
      setActiveTab('basic');

      fetchStudies();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create case study');
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
            Create, view, and delete case studies nested under this listing page.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-6 gap-2 h-10 shadow-sm">
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
                    <span className={cn('text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter', study.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{study.status}</span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#4B2A63] hover:bg-[#4B2A63]/5" onClick={() => (window.location.href = `/admin/pages/${study.id}`)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(study.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">Add Case Study</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"><X className="w-5 h-5" /></button>
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
                <form id="caseStudyForm" onSubmit={handleCreate} className="flex-1 overflow-y-auto p-8 bg-white">
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Title</label>
                          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">URL Slug</label>
                          <input type="text" required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Topic</label>
                          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. ERP" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Industry</label>
                          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Retail" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Date</label>
                          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Oct 2023" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Hero Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Hero Image URL</label>
                        <MediaField fieldKey="hero-image" value={image} onChange={(val) => setImage(val)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Initial Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Overview Text</label>
                        <textarea value={overview} onChange={(e) => setOverview(e.target.value)} rows={6} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Overview Image 1 URL</label>
                        <MediaField fieldKey="overview-image-1" value={overviewImage1} onChange={(val) => setOverviewImage1(val)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Overview Image 2 URL</label>
                        <MediaField fieldKey="overview-image-2" value={overviewImage2} onChange={(val) => setOverviewImage2(val)} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'challenge' && (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Challenge Title</label>
                        <input type="text" value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Challenge Description</label>
                        <textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} rows={3} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Challenge Image</label>
                        <MediaField fieldKey="challenge-image" value={challengeImage} onChange={(val) => setChallengeImage(val)} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500">Challenge Points</label>
                        {challengePoints.map((pt, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Title" value={pt.title} onChange={e => { const n = [...challengePoints]; n[idx].title = e.target.value; setChallengePoints(n); }} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <input type="text" placeholder="Description" value={pt.description} onChange={e => { const n = [...challengePoints]; n[idx].description = e.target.value; setChallengePoints(n); }} className="flex-[2] bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
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
                        <label className="text-xs font-semibold text-slate-500">Solutions Title</label>
                        <input type="text" value={solutionsTitle} onChange={(e) => setSolutionsTitle(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Solutions Description</label>
                        <textarea value={solutionsDescription} onChange={(e) => setSolutionsDescription(e.target.value)} rows={3} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20 resize-none" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500">Solution Modules</label>
                        {solutionModules.map((mod, idx) => (
                          <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="w-20 shrink-0">
                              <MediaField fieldKey={`solution-icon-${idx}`} value={mod.icon} onChange={val => { const n = [...solutionModules]; n[idx].icon = val; setSolutionModules(n); }} />
                            </div>
                            <div className="flex-1 space-y-2">
                              <input type="text" placeholder="Module Name" value={mod.name} onChange={e => { const n = [...solutionModules]; n[idx].name = e.target.value; setSolutionModules(n); }} className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                              <input type="text" placeholder="Description" value={mod.description} onChange={e => { const n = [...solutionModules]; n[idx].description = e.target.value; setSolutionModules(n); }} className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
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
                        <label className="text-xs font-semibold text-slate-500">Results Title</label>
                        <input type="text" value={resultsTitle} onChange={(e) => setResultsTitle(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500">Result Items</label>
                        {resultsItems.map((resItem, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Result bullet point" value={resItem} onChange={e => { const n = [...resultsItems]; n[idx] = e.target.value; setResultsItems(n); }} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
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
                  Create Case Study
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


interface BlogManagerProps {
  pageId: string;
  onRefresh: () => void;
}

function BlogManager({ pageId, onRefresh }: BlogManagerProps) {
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
  const [date, setDate] = React.useState('');
  const [authorName, setAuthorName] = React.useState('');
  const [authorAvatar, setAuthorAvatar] = React.useState('');
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contentHtml, setContentHtml] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');

  // Additional fields for Blog Detail Page
  const [badgeText, setBadgeText] = React.useState('');
  const [headingText, setHeadingText] = React.useState('');
  const [subheadingText, setSubheadingText] = React.useState('');
  const [bgImage, setBgImage] = React.useState('');

  // Highlights State
  const [highlights, setHighlights] = React.useState<Array<{ title: string; description: string; image: string }>>([]);

  const addHighlight = () => {
    setHighlights(prev => [...prev, { title: '', description: '', image: '' }]);
  };

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, idx) => idx !== index));
  };

  // Conclusion HTML
  const [conclusionHtml, setConclusionHtml] = React.useState('');

  // Tab control in the creation modal
  const [activeTab, setActiveTab] = React.useState<'basic' | 'hero' | 'highlights'>('basic');

  const fetchBlogs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const tree = await res.json();

        // Find current page in tree
        const findNode = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.id === pageId) return node;
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
          setBlogs([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch blog pages', err);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

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
        onRefresh();
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
      // Find Blog Detail Template
      const blogDetailTemplate = templates.find((t: any) =>
        t.templateSections?.some((ts: any) => ts.type === 'blog-detail-block')
      );

      const templateId = blogDetailTemplate?.id || null;
      if (!templateId) {
        throw new Error(
          'Blog Detail Template not found in CMS. Please run seed script first.'
        );
      }

      // 1. Create the page
      const createPageRes = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          parentId: pageId,
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
        title: title,
        category: category || undefined,
        industries: industry ? [industry] : [],
        authorName: authorName || undefined,
        authorAvatar: authorAvatar || (authorName
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`
          : undefined),
        date: date || undefined,
        image: image || undefined,
        description: description || undefined,
        contentHtml: contentHtml || undefined,
        badgeText: badgeText || undefined,
        headingText: headingText || undefined,
        subheadingText: subheadingText || undefined,
        bgImage: bgImage || undefined,
        conclusionHtml: conclusionHtml || undefined,
      };

      // For highlights, only update if user edited them
      if (highlights.some(h => h.title.trim() || h.description.trim() || h.image.trim())) {
        (updatedContent as any).highlights = highlights
          .filter(h => h.title.trim() || h.description.trim() || h.image.trim())
          .map(h => ({
            title: h.title.trim(),
            description: h.description.trim(),
            image: h.image.trim() || undefined,
          }));
      }

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

      // Reset form
      setTitle('');
      setSlug('');
      setSlugTouched(false);
      setCategory('');
      setIndustry('');
      setDate('');
      setAuthorName('');
      setAuthorAvatar('');
      setImage('');
      setDescription('');
      setContentHtml('');
      setStatus('draft');

      // Reset new fields
      setBadgeText('');
      setHeadingText('');
      setSubheadingText('');
      setBgImage('');
      setHighlights([]);
      setConclusionHtml('');
      setActiveTab('basic');

      fetchBlogs();
      onRefresh();
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
          onClick={() => setShowCreateModal(true)}
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
                    <span
                      className={cn(
                        'text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tighter',
                        blog.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      )}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#4B2A63] hover:bg-[#4B2A63]/5"
                        onClick={() => (window.location.href = `/admin/pages/${blog.id}`)}
                        title="Edit Blog Post Content"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                        onClick={() => handleDelete(blog.id)}
                        title="Delete Blog Post"
                      >
                        <Trash2 className="w-4 h-4" />
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
                    Create New Blog Post
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This will create a new dynamic page and pre-configure the blog details content.
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
              <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 shrink-0">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'hero', label: 'Hero Banner' },
                  { id: 'highlights', label: 'Highlights & Conclusion' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer',
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
                {activeTab === 'basic' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Blog Title
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. How Power BI Solves Mismatches"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          URL Slug
                        </label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value);
                            setSlugTouched(true);
                          }}
                          placeholder="e.g. how-power-bi-solves-mismatches"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Category / Topic
                        </label>
                        <CustomDropdown
                          value={category}
                          onChange={setCategory}
                          placeholder="Select Category"
                          options={[
                            { value: 'Business Intelligence', label: 'Business Intelligence' },
                            { value: 'ERP Solutions', label: 'ERP Solutions' },
                            { value: 'IoT Solutions', label: 'IoT Solutions' },
                            { value: 'Mobile App Solutions', label: 'Mobile App Solutions' },
                            { value: 'CRM Solutions', label: 'CRM Solutions' },
                            { value: 'Sales Force Automation', label: 'Sales Force Automation' },
                            { value: 'After-Sales Service App', label: 'After-Sales Service App' },
                          ]}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Industry
                        </label>
                        <CustomDropdown
                          value={industry}
                          onChange={setIndustry}
                          placeholder="Select Industry"
                          options={[
                            { value: 'FMCG', label: 'FMCG' },
                            { value: 'Pharma', label: 'Pharma' },
                            { value: 'Manufacturing', label: 'Manufacturing' },
                            { value: 'Retail', label: 'Retail' },
                            { value: 'Electronics', label: 'Electronics' },
                          ]}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g. Jason Francisco"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Publish Date String
                        </label>
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="e.g. May 15, 2026"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium"
                        />
                      </div>
                    </div>

                    <MediaField
                      fieldKey="authorAvatar"
                      value={authorAvatar}
                      onChange={setAuthorAvatar}
                    />

                    <MediaField
                      fieldKey="featuredImage"
                      value={image}
                      onChange={setImage}
                    />

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">
                        Brief Description / Summary
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short excerpt for lists and previews..."
                        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium resize-none"
                      />
                    </div>

                    <RichTextField
                      fieldKey="contentHtml"
                      value={contentHtml}
                      onChange={setContentHtml}
                      placeholder="Start writing article content..."
                    />
                  </>
                )}

                {activeTab === 'hero' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">
                          Badge Text
                        </label>
                        <input
                          type="text"
                          value={badgeText}
                          onChange={(e) => setBadgeText(e.target.value)}
                          placeholder="e.g. Latest Blogs"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500">
                          Hero Heading Text
                        </label>
                        <input
                          type="text"
                          value={headingText}
                          onChange={(e) => setHeadingText(e.target.value)}
                          placeholder="e.g. Explore our knowledge hub"
                          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">
                        Hero Subheading Text
                      </label>
                      <textarea
                        rows={2}
                        value={subheadingText}
                        onChange={(e) => setSubheadingText(e.target.value)}
                        placeholder="Subheading below hero heading..."
                        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium resize-none"
                      />
                    </div>

                    <MediaField
                      fieldKey="heroBackgroundImage"
                      value={bgImage}
                      onChange={setBgImage}
                    />
                  </div>
                )}

                {activeTab === 'highlights' && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Highlights / Solutions</h4>

                    {highlights.length === 0 ? (
                      <div className="bg-slate-50/50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                        <p className="text-xs text-slate-400 font-medium">No highlights added yet.</p>
                        <p className="text-[10px] text-slate-300 mt-0.5">Click &ldquo;Add Highlight&rdquo; below to insert a highlight card.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {highlights.map((highlight, index) => (
                          <div key={index} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h5 className="text-[10px] font-black text-[#4B2A63] uppercase tracking-wider">Highlight {index + 1}</h5>
                                <button
                                  type="button"
                                  onClick={() => removeHighlight(index)}
                                  className="p-1 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                  title="Delete Highlight"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-500">Title</label>
                                <input
                                  type="text"
                                  value={highlight.title}
                                  onChange={(e) => {
                                    const newHighlights = [...highlights];
                                    newHighlights[index].title = e.target.value;
                                    setHighlights(newHighlights);
                                  }}
                                  placeholder="Feature or solution title..."
                                  className="w-full bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200 focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-slate-500">Description</label>
                                <textarea
                                  rows={2}
                                  value={highlight.description}
                                  onChange={(e) => {
                                    const newHighlights = [...highlights];
                                    newHighlights[index].description = e.target.value;
                                    setHighlights(newHighlights);
                                  }}
                                  placeholder="Detail explanation..."
                                  className="w-full bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200 focus:border-[#4B2A63]/20 focus:ring-2 focus:ring-[#4B2A63]/10 font-medium resize-none"
                                />
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 mt-2">
                              <MediaField
                                fieldKey={`highlight-${index + 1}-image`}
                                value={highlight.image}
                                onChange={(url) => {
                                  const newHighlights = [...highlights];
                                  newHighlights[index].image = url;
                                  setHighlights(newHighlights);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={addHighlight}
                      variant="outline"
                      className="w-full border-dashed border-[#4B2A63]/30 hover:border-[#4B2A63] text-[#4B2A63] gap-2 rounded-xl py-4 h-auto shadow-none font-bold"
                    >
                      <Plus className="w-4 h-4" />
                      Add Highlight
                    </Button>

                    <RichTextField
                      fieldKey="conclusionHtml"
                      value={conclusionHtml}
                      onChange={setConclusionHtml}
                      placeholder="Write concluding paragraphs here..."
                    />
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-slate-500">
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
                          Creating...
                        </>
                      ) : (
                        'Create Blog Post'
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
  });
  const [savedSeoSnapshot, setSavedSeoSnapshot] = React.useState('');
  const [dirtySections, setDirtySections] = React.useState<Set<string>>(new Set());

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
    const libSec = librarySections.find(
      (s) => s.type === type && (s.variant === 'default' || !s.variant)
    ) || librarySections.find((s) => s.type === type);

    const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        orderIndex: afterIndex !== undefined ? afterIndex + 1 : undefined,
        sectionLibraryId: libSec?.id || null,
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


          {isBlogsListingPage && (
            <BlogManager pageId={pageId} onRefresh={fetchPage} />
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
                OG Image
              </label>
              <MediaField
                fieldKey="seo-og-image"
                value={seoForm.ogImage}
                onChange={(val) => setSeoForm({ ...seoForm, ogImage: val })}
              />
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
    </motion.div>
  );
}

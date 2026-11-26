'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Loader2,
  Layers,
  Trash2,
  Edit,
  X,
  BookOpen,
  SlidersHorizontal,
  LayoutGrid,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RichTextField } from '@/components/admin/page-editor/RichTextField';
import { MediaField } from '@/components/admin/page-editor/MediaField';
import { ColorPickerField } from '@/components/admin/page-editor/ColorPickerField';
import type { PageSection } from '@/components/admin/page-editor';
import { defaultCaseStudies } from '@/lib/case-studies-data';
import { DEFAULT_TOPICS, DEFAULT_INDUSTRIES } from '@/lib/blogs-data';

// ---------------------------------------------------------------------------
// Shared Taxonomy & Dropdown Components
// ---------------------------------------------------------------------------

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

export function CustomDropdown({ value, onChange, options, placeholder }: CustomDropdownProps) {
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [importingSlug, setImportingSlug] = React.useState<string | null>(null);
  const itemsPerPage = 10;

  // Basic Info
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [topic, setTopic] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [topics, setTopics] = React.useState<string[]>(DEFAULT_TOPICS);
  const [industries, setIndustries] = React.useState<string[]>(DEFAULT_INDUSTRIES);
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
  const [resultsSubtitle, setResultsSubtitle] = React.useState('');
  const [resultsItems, setResultsItems] = React.useState(['']);

  const totalPages = Math.max(1, Math.ceil(studies.length / itemsPerPage));
  const paginatedStudies = React.useMemo(
    () => studies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [studies, currentPage]
  );

  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(studies.length / itemsPerPage));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [studies.length, currentPage]);

  const fetchStudies = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const tree = await res.json();

        const collectCaseStudyPages = (nodes: any[], acc: any[] = []) => {
          for (const node of nodes) {
            const path = node.fullPath || '';
            if (path.startsWith('/case-studies/') && path !== '/case-studies') {
              acc.push(node);
            }
            if (node.children?.length) collectCaseStudyPages(node.children, acc);
          }
          return acc;
        };

        const cmsStudies = collectCaseStudyPages(tree);
        const cmsSlugs = new Set(cmsStudies.map((s: any) => s.slug).filter(Boolean));

        // Include static/default case studies that appear on the public site but are not yet CMS pages
        const staticStudies = defaultCaseStudies
          .filter((cs) => !cmsSlugs.has(cs.slug))
          .map((cs) => ({
            id: null,
            title: cs.title,
            slug: cs.slug,
            fullPath: `/case-studies/${cs.slug}`,
            status: 'static',
            isStatic: true,
            staticData: cs,
          }));

        const merged = [...cmsStudies, ...staticStudies].sort((a, b) =>
          String(a.title || '').localeCompare(String(b.title || ''))
        );
        setStudies(merged);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch case studies', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const fetchTaxonomy = React.useCallback(async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.configuredTopics) && data.configuredTopics.length > 0) {
          setTopics(data.configuredTopics);
        }
        if (Array.isArray(data?.configuredIndustries) && data.configuredIndustries.length > 0) {
          setIndustries(data.configuredIndustries);
        }
      }
    } catch (err) {
      console.error('Failed to load topics & industries in CaseStudyManager', err);
    }
  }, []);

  React.useEffect(() => {
    fetchStudies();
    fetchTemplates();
    fetchTaxonomy();
  }, [fetchStudies, fetchTemplates, fetchTaxonomy]);

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
    setResultsTitle(''); setResultsSubtitle(''); setResultsItems(['']);
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

      setTopic(content.topic || content.badgeText || '');
      setIndustry(content.industry || (Array.isArray(content.industries) ? content.industries[0] : '') || '');
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
      setResultsSubtitle(content.resultsSubtitle || content.resultsHtml || '');
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

  const resolveCaseStudiesParentId = async (): Promise<string | null> => {
    if (pageId) return pageId;
    const pagesRes = await fetch('/api/admin/pages');
    if (!pagesRes.ok) return null;
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
    return findCaseStudiesNode(tree)?.id || null;
  };

  const handleImportStatic = async (study: any) => {
    const cs = study?.staticData;
    if (!cs?.slug) return;
    setImportingSlug(cs.slug);
    try {
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

      const parentTargetId = await resolveCaseStudiesParentId();
      const createPageRes = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cs.title,
          slug: cs.slug,
          parentId: parentTargetId,
          templateId: detailTemplate.id || null,
          pageType: 'standard',
          status: 'draft',
        }),
      });
      if (!createPageRes.ok) {
        const errBody = await createPageRes.json().catch(() => ({}));
        throw new Error(errBody.error || errBody.message || 'Failed to import case study');
      }
      const pageData = await createPageRes.json();
      const detailSection = pageData.sections?.find((s: any) => s.type === 'case-study-detail');
      if (detailSection) {
        const defaultContent =
          detailSection.content ||
          detailTemplate.templateSections?.find((ts: any) => ts.type === 'case-study-detail')?.contentJson ||
          {};
        await fetch(`/api/admin/pages/${pageData.id}/sections/${detailSection.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: {
              ...defaultContent,
              title: cs.title,
              badgeText: cs.badgeText || cs.topic || cs.badge || 'Case Study',
              topic: cs.topic,
              industry: cs.industry || cs.industries?.[0] || '',
              industries: cs.industries || [],
              date: cs.date,
              image: cs.image,
              description: cs.description,
              overview: cs.overview || cs.overviewHtml,
              overviewParagraphs: cs.overviewParagraphs,
              overviewImages: cs.overviewImages,
              challengeTitle: cs.challengeTitle,
              challengeDescription: cs.challengeDescription || cs.challengeHtml,
              challengeImage: cs.challengeImage,
              challengePoints: cs.challengePoints,
              solutionsTitle: cs.solutionsTitle,
              solutionsDescription: cs.solutionsDescription || cs.solutionHtml,
              solutionModules: cs.solutionModules,
              resultsTitle: cs.resultsTitle,
              resultsSubtitle: cs.resultsSubtitle || cs.resultsHtml,
              resultsItems: cs.resultsItems,
              gradientFrom: cs.gradientFrom || '#1e2445',
              gradientTo: cs.gradientTo || '#292048',
            },
          }),
        });
      }
      toast.success('Case study imported into CMS');
      await fetchStudies();
      onRefresh?.();
      await handleOpenEdit(pageData.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to import case study');
    } finally {
      setImportingSlug(null);
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
        badgeText: topic || 'Case Study',
        badgeTextColor: '#7c3aed',
        topic: topic || undefined,
        industry: industry || undefined,
        industries: industry ? [industry] : [],
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
        resultsSubtitle: resultsSubtitle || undefined,
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
        <div className="space-y-0">
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
                {paginatedStudies.map((study: any) => (
                  <tr key={study.id || `static-${study.slug}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm font-medium">
                    <td className="py-3.5 px-2">
                      <span className="font-bold text-slate-800 block truncate">{study.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">{study.fullPath}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      {study.isStatic ? (
                        <span className="inline-flex text-[8px] font-black pl-2 pr-2 py-0.5 rounded-full uppercase tracking-tighter bg-slate-100 text-slate-500 border border-slate-200">
                          Static
                        </span>
                      ) : (
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
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        {study.isStatic ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full text-[11px] font-bold px-3 text-[#4B2A63] border-[#4B2A63]/20 hover:bg-[#4B2A63]/5"
                            onClick={() => handleImportStatic(study)}
                            disabled={importingSlug === study.slug}
                          >
                            {importingSlug === study.slug ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 mr-1" />
                            )}
                            Import to CMS
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#4B2A63] hover:bg-[#4B2A63]/5" onClick={() => handleOpenEdit(study.id)} disabled={isFetchingDetail}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {studies.length > 0 && (
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Showing{' '}
                <span className="font-medium text-slate-900">
                  {studies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-slate-900">
                  {Math.min(currentPage * itemsPerPage, studies.length)}
                </span>{' '}
                of <span className="font-medium text-slate-900">{studies.length}</span> case studies
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-3 h-3 mr-1" /> Previous
                </Button>
                <span className="text-[11px] text-slate-600 font-medium px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
                    { id: 'overview', label: 'Overview', icon: LayoutGrid },
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
                          <label className="admin-label">Topic / Category</label>
                          <CustomDropdown
                            value={topic}
                            onChange={setTopic}
                            placeholder="Select Topic"
                            options={Array.from(new Set([...(topic ? [topic] : []), ...topics])).map((t) => ({ value: t, label: t }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="admin-label">Industry</label>
                          <CustomDropdown
                            value={industry}
                            onChange={setIndustry}
                            placeholder="Select Industry"
                            options={Array.from(new Set([...(industry ? [industry] : []), ...industries])).map((ind) => ({ value: ind, label: ind }))}
                          />
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
                      <div className="space-y-1">
                        <label className="admin-label">Results Description</label>
                        <textarea
                          value={resultsSubtitle}
                          onChange={(e) => setResultsSubtitle(e.target.value)}
                          rows={4}
                          placeholder="Description shown under the results title"
                          className="admin-input resize-y min-h-[96px]"
                        />
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
// Blog Posts Manager Component
// ---------------------------------------------------------------------------

export interface BlogManagerProps {
  pageId?: string;
  onRefresh?: () => void;
  blogListSection?: PageSection;
}

export function BlogManager({ pageId, onRefresh, blogListSection }: BlogManagerProps) {
  const [fetchedTopics, setFetchedTopics] = React.useState<string[]>([]);
  const [fetchedIndustries, setFetchedIndustries] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.configuredTopics) && data.configuredTopics.length > 0) {
            setFetchedTopics(data.configuredTopics);
          }
          if (Array.isArray(data?.configuredIndustries) && data.configuredIndustries.length > 0) {
            setFetchedIndustries(data.configuredIndustries);
          }
        }
      } catch (err) {
        console.error('Failed to load topics & industries in BlogManager', err);
      }
    }
    fetchTaxonomy();
  }, []);

  const topics = React.useMemo(() => {
    const sectionContent = blogListSection?.content as any;
    const rawTopics = sectionContent?.topics;
    if (Array.isArray(rawTopics) && rawTopics.length > 0) {
      return rawTopics.filter(Boolean);
    }
    if (fetchedTopics.length > 0) {
      return fetchedTopics;
    }
    return DEFAULT_TOPICS;
  }, [blogListSection, fetchedTopics]);

  const industries = React.useMemo(() => {
    const sectionContent = blogListSection?.content as any;
    const rawIndustries = sectionContent?.industries;
    if (Array.isArray(rawIndustries) && rawIndustries.length > 0) {
      return rawIndustries.filter(Boolean);
    }
    if (fetchedIndustries.length > 0) {
      return fetchedIndustries;
    }
    return DEFAULT_INDUSTRIES;
  }, [blogListSection, fetchedIndustries]);

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
  const [calcButtonText, setCalcButtonText] = React.useState('Get Free Estimation');
  const [calcPoints, setCalcPoints] = React.useState<string[]>([
    '100% Free & No Commitment',
    'Detailed Timeline Breakdown in 24h',
    'Estimated Cost Range Included'
  ]);

  // Modal active tab control
  const [activeTab, setActiveTab] = React.useState<'hero' | 'author' | 'content' | 'conclusion' | 'form'>('hero');
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
    setCalcDisclaimer('I agree to receive the personalized development estimation report and future tech insights.');
    setCalcButtonText('Get Free Estimation');
    setCalcPoints([
      '100% Free & No Commitment',
      'Detailed Timeline Breakdown in 24h',
      'Estimated Cost Range Included'
    ]);
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
        setCalcDisclaimer(
          c.calcDisclaimer ||
            'I agree to receive the personalized development estimation report and future tech insights.'
        );
        setCalcButtonText(c.calcButtonText || 'Get Free Estimation');
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
            calcButtonText: calcButtonText || 'Get Free Estimation',
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
        calcButtonText: calcButtonText || 'Get Free Estimation',
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
                          src={blog.previewThumbnail || '/blog-1.png'}
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
                  { id: 'conclusion', label: '4. Conclusion' },
                  { id: 'form', label: '5. Blog Contact Form' },
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
                          options={Array.from(new Set([...(category ? [category] : []), ...topics])).map((t) => ({ value: t, label: t }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Industry</label>
                        <CustomDropdown
                          value={industry}
                          onChange={setIndustry}
                          placeholder="Select Industry"
                          options={Array.from(new Set([...(industry ? [industry] : []), ...industries])).map((ind) => ({ value: ind, label: ind }))}
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

                {/* TAB 4: Conclusion */}
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
                  </div>
                )}

                {/* TAB 5: Blog Contact Form */}
                {activeTab === 'form' && (
                  <div className="space-y-6">
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                        Blog Contact Form
                      </h4>

                      <div className="space-y-1">
                        <label className="admin-label">Form Heading</label>
                        <input
                          type="text"
                          value={calcTitle}
                          onChange={(e) => setCalcTitle(e.target.value)}
                          placeholder="e.g. Calculate your app development timeline!"
                          className="admin-input font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="admin-label">Form Content</label>
                        <textarea
                          rows={3}
                          value={calcDisclaimer}
                          onChange={(e) => setCalcDisclaimer(e.target.value)}
                          placeholder="Agreement / consent text shown next to the checkbox..."
                          className="admin-input font-medium text-xs resize-y"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="admin-label">Form Button Text</label>
                        <input
                          type="text"
                          value={calcButtonText}
                          onChange={(e) => setCalcButtonText(e.target.value)}
                          placeholder="e.g. Get Free Estimation"
                          className="admin-input font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="admin-label">Form Points</label>
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


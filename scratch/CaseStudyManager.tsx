import React from 'react';

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
  const [status, setStatus] = React.useState('draft');

  // Overview
  const [overview, setOverview] = React.useState('');
  const [overviewImage1, setOverviewImage1] = React.useState('');
  const [overviewImage2, setOverviewImage2] = React.useState('');

  // Challenge
  const [challengeTitle, setChallengeTitle] = React.useState('');
  const [challengeDescription, setChallengeDescription] = React.useState('');
  const [challengePoints, setChallengePoints] = React.useState([{ title: '', description: '' }]);

  // Solutions
  const [solutionsTitle, setSolutionsTitle] = React.useState('');
  const [solutionsDescription, setSolutionsDescription] = React.useState('');
  const [solutionModules, setSolutionModules] = React.useState([{ title: '', description: '' }]);

  // Results
  const [resultsTitle, setResultsTitle] = React.useState('');
  const [resultsItems, setResultsItems] = React.useState([{ metric: '', label: '' }]);

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
      const filteredSolutions = solutionModules.filter(m => m.title.trim() || m.description.trim());
      const filteredResults = resultsItems.filter(r => r.metric.trim() || r.label.trim());
      const filteredOverviewImages = [overviewImage1, overviewImage2].filter(img => img.trim());

      const updatedContent = {
        ...defaultContent,
        title,
        topic: topic || undefined,
        industry: industry || undefined,
        date: date || undefined,
        image: image || undefined,
        overview: overview || undefined,
        overviewImages: filteredOverviewImages.length > 0 ? filteredOverviewImages : undefined,
        challengeTitle: challengeTitle || undefined,
        challengeDescription: challengeDescription || undefined,
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
      setChallengeTitle(''); setChallengeDescription(''); setChallengePoints([{title:'', description:''}]);
      setSolutionsTitle(''); setSolutionsDescription(''); setSolutionModules([{title:'', description:''}]);
      setResultsTitle(''); setResultsItems([{metric:'', label:''}]);
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
                        <label className="text-xs font-semibold text-slate-500">Hero Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
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
                        <input type="text" value={overviewImage1} onChange={(e) => setOverviewImage1(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Overview Image 2 URL</label>
                        <input type="text" value={overviewImage2} onChange={(e) => setOverviewImage2(e.target.value)} className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border focus:border-[#4B2A63]/20" />
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
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500">Challenge Points</label>
                        {challengePoints.map((pt, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Title" value={pt.title} onChange={e => { const n = [...challengePoints]; n[idx].title = e.target.value; setChallengePoints(n); }} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <input type="text" placeholder="Description" value={pt.description} onChange={e => { const n = [...challengePoints]; n[idx].description = e.target.value; setChallengePoints(n); }} className="flex-[2] bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <button type="button" onClick={() => setChallengePoints(challengePoints.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setChallengePoints([...challengePoints, {title:'', description:''}])} className="w-full rounded-xl border-dashed">Add Point</Button>
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
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Module Name" value={mod.title} onChange={e => { const n = [...solutionModules]; n[idx].title = e.target.value; setSolutionModules(n); }} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <input type="text" placeholder="Description" value={mod.description} onChange={e => { const n = [...solutionModules]; n[idx].description = e.target.value; setSolutionModules(n); }} className="flex-[2] bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <button type="button" onClick={() => setSolutionModules(solutionModules.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setSolutionModules([...solutionModules, {title:'', description:''}])} className="w-full rounded-xl border-dashed">Add Module</Button>
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
                        <label className="text-xs font-semibold text-slate-500">Result Metrics</label>
                        {resultsItems.map((resItem, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <input type="text" placeholder="Metric (e.g. 50%)" value={resItem.metric} onChange={e => { const n = [...resultsItems]; n[idx].metric = e.target.value; setResultsItems(n); }} className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <input type="text" placeholder="Label (e.g. Increase in sales)" value={resItem.label} onChange={e => { const n = [...resultsItems]; n[idx].label = e.target.value; setResultsItems(n); }} className="flex-[2] bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border focus:border-[#4B2A63]/20" />
                            <button type="button" onClick={() => setResultsItems(resultsItems.filter((_, i) => i !== idx))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setResultsItems([...resultsItems, {metric:'', label:''}])} className="w-full rounded-xl border-dashed">Add Metric</Button>
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

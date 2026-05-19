'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';

export type PageCreateFormData = {
  navigationItemId: string;
  megaMenuCategoryId: string;
  megaMenuSubCategoryId: string;
  megaMenuSubSubCategoryId: string;
  title: string;
  slug: string;
  templateId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  templates: Array<{ id: string; name: string; templateSections?: unknown[] }>;
  onSubmit: (data: PageCreateFormData) => Promise<void>;
};

const initialForm: PageCreateFormData = {
  navigationItemId: '',
  megaMenuCategoryId: '',
  megaMenuSubCategoryId: '',
  megaMenuSubSubCategoryId: '',
  title: '',
  slug: '',
  templateId: '',
};

export function PageCreateWizard({ open, onClose, templates, onSubmit }: Props) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<PageCreateFormData>(initialForm);
  const [navItems, setNavItems] = React.useState<NavigationTreeItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setStep(1);
    setForm(initialForm);
    setLoading(true);
    fetch('/api/admin/navigation/hierarchy?location=header-main')
      .then((r) => r.json())
      .then((d) => setNavItems(d.items || []))
      .finally(() => setLoading(false));
  }, [open]);

  const selectedNav = navItems.find((n) => n.id === form.navigationItemId);
  const categories = selectedNav?.categories ?? [];
  const selectedCat = categories.find((c) => c.id === form.megaMenuCategoryId);
  const subCategories = selectedCat?.subCategories ?? [];
  const selectedSub = subCategories.find((s) => s.id === form.megaMenuSubCategoryId);
  const subSubCategories = selectedSub?.subSubCategories ?? [];

  const maxStep = selectedSub && subSubCategories.length > 0 ? 5 : 4;

  const canNext = () => {
    if (step === 1) return !!form.navigationItemId;
    if (step === 2) return !!form.megaMenuCategoryId || !selectedNav?.megaMenuEnabled;
    if (step === 3) return !!form.megaMenuSubCategoryId || subCategories.length === 0;
    if (step === 4 && subSubCategories.length > 0) return true;
    return true;
  };

  const handleNext = () => {
    if (step === 1 && (!selectedNav?.megaMenuEnabled || categories.length === 0)) {
      setStep(maxStep);
      return;
    }
    if (step === 2 && subCategories.length === 0) {
      setStep(maxStep);
      return;
    }
    if (step === 3 && subSubCategories.length === 0) {
      setStep(maxStep);
      return;
    }
    setStep((s) => Math.min(maxStep, s + 1));
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
        >
          <motion.div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Page</h2>
              <p className="text-sm text-slate-400">
                Step {step} of {maxStep} — Navigation-first hierarchy
              </p>
            </div>
            <button type="button" onClick={onClose}>
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </motion.div>

          <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading navigation…</p>
            ) : (
              <>
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Navigation menu item
                    </label>
                    <select
                      value={form.navigationItemId}
                      onChange={(e) =>
                        setForm({
                          ...initialForm,
                          navigationItemId: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                    >
                      <option value="">Select menu item</option>
                      {navItems.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {step === 2 && selectedNav?.megaMenuEnabled && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Category (mega menu tab)
                    </label>
                    <select
                      value={form.megaMenuCategoryId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          megaMenuCategoryId: e.target.value,
                          megaMenuSubCategoryId: '',
                          megaMenuSubSubCategoryId: '',
                        })
                      }
                      className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-sm text-amber-600">
                        No categories in CMS for this item. Add them under Navigation → Mega Menu.
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 3 && subCategories.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Sub category
                    </label>
                    <select
                      value={form.megaMenuSubCategoryId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          megaMenuSubCategoryId: e.target.value,
                          megaMenuSubSubCategoryId: '',
                        })
                      }
                      className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                    >
                      <option value="">Select sub category</option>
                      {subCategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {step === 4 && subSubCategories.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Sub sub category (optional leaf)
                    </label>
                    <select
                      value={form.megaMenuSubSubCategoryId}
                      onChange={(e) =>
                        setForm({ ...form, megaMenuSubSubCategoryId: e.target.value })
                      }
                      className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                    >
                      <option value="">None — attach page to sub category</option>
                      {subSubCategories.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {step === maxStep && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Page title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                      />
                      <input
                        placeholder="URL slug (optional)"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        Template
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, templateId: '' })}
                          className={cn(
                            'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                            !form.templateId
                              ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                              : 'border-slate-100'
                          )}
                        >
                          Blank Page
                        </button>
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setForm({ ...form, templateId: t.id })}
                            className={cn(
                              'p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all',
                              form.templateId === t.id
                                ? 'border-[#4B2A63] bg-[#4B2A63] text-white'
                                : 'border-slate-100'
                            )}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="rounded-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {step < maxStep ? (
              <Button
                onClick={handleNext}
                disabled={!canNext()}
                className="bg-[#4B2A63] text-white rounded-full px-8"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!form.title.trim() || submitting}
                className="bg-[#4B2A63] text-white rounded-full px-8"
              >
                {submitting ? 'Creating…' : 'Create Page'}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

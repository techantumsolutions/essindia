'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, FileText, Eye, X, ClipboardList, ChevronRight, Link2, Save, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

/* ──────────────────────────────────────────────
   FORM DEFINITIONS (static – matches actual modals)
────────────────────────────────────────────── */
interface FieldDef {
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required: boolean;
  note?: string;
}

interface FormDef {
  id: string;
  name: string;
  formType: 'contact' | 'cta';
  usedIn: string;
  description: string;
  fields: FieldDef[];
  color: string;
  submissionsTab: 'contact' | 'cta';
}

const FORMS: FormDef[] = [
  {
    id: 'contact',
    name: 'Contact Us Form',
    formType: 'contact',
    usedIn: 'Contact Us page / Header CTA',
    description: 'General contact inquiry form. Captures name, email, phone, company, country and message.',
    submissionsTab: 'contact',
    color: '#4B2A63',
    fields: [
      { label: 'Full Name', type: 'text', placeholder: 'Enter Name', required: true },
      { label: 'Email Address', type: 'email', placeholder: 'Enter Email', required: true },
      { label: 'Phone Number', type: 'tel', placeholder: 'Enter Mobile No', required: true },
      { label: 'Company Name', type: 'text', placeholder: 'Enter Company Name', required: false },
      { label: 'Country', type: 'select', placeholder: 'Select Country', required: true },
      { label: 'Message', type: 'textarea', placeholder: 'Enter your message', required: false },
      {
        label: 'You agree to our privacy policy.',
        type: 'checkbox',
        required: true,
        note: 'Disclaimer: This information will not be shared with anybody, it will be used for internal purposes only.',
      },
    ],
  },
  {
    id: 'cta',
    name: 'Page CTA Form',
    formType: 'cta',
    usedIn: 'Solution / Product pages (CTA buttons)',
    description: 'Lead capture form triggered by CTA buttons on solution pages. Delivers a PDF download after submission.',
    submissionsTab: 'cta',
    color: '#103D38',
    fields: [
      { label: 'Full Name', type: 'text', placeholder: 'Enter Name', required: true },
      { label: 'Email Address', type: 'email', placeholder: 'Enter Email', required: true },
      { label: 'Phone Number', type: 'tel', placeholder: 'Enter Mobile No', required: true },
      { label: 'Country', type: 'select', placeholder: 'Select Country', required: true },
      {
        label: 'You agree to our privacy policy.',
        type: 'checkbox',
        required: true,
        note: 'Disclaimer: This information will not be shared with anybody, it will be used for internal purposes only.',
      },
    ],
  },
];

const TYPE_BADGE: Record<string, string> = {
  text:     'bg-blue-50 text-blue-700 border border-blue-100',
  email:    'bg-violet-50 text-violet-700 border border-violet-100',
  tel:      'bg-orange-50 text-orange-700 border border-orange-100',
  select:   'bg-emerald-50 text-emerald-700 border border-emerald-100',
  textarea: 'bg-slate-100 text-slate-600 border border-slate-200',
  checkbox: 'bg-amber-50 text-amber-700 border border-amber-100',
};

/* ──────────────────────────────────────────────
   INLINE FORM PREVIEW (read-only mockup)
────────────────────────────────────────────── */
function FormPreview({ form }: { form: FormDef }) {
  return (
    <div className="space-y-4">
      {form.fields.map((field, i) => {
        if (field.type === 'checkbox') {
          return (
            <div key={i} className="pt-1">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-2 border-slate-300 shrink-0" />
                <span className="text-sm text-slate-600">{field.label}</span>
              </div>
              {field.note && (
                <p className="text-xs text-slate-400 mt-1 ml-7">{field.note}</p>
              )}
            </div>
          );
        }

        if (field.type === 'tel') {
          return (
            <div key={i} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <div className="flex rounded-md overflow-hidden border border-slate-200">
                <div className="px-3 py-2 bg-slate-50 text-sm text-slate-500 border-r border-slate-200 whitespace-nowrap">
                  +91
                </div>
                <div className="flex-1 px-3 py-2 bg-white text-sm text-slate-400 italic">
                  {field.placeholder}
                </div>
              </div>
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={i} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <div className="flex items-center justify-between px-3 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-400 italic">
                <span>{field.placeholder}</span>
                <ChevronRight className="w-4 h-4 rotate-90 text-slate-300" />
              </div>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={i} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <div className="px-3 py-2 min-h-[72px] rounded-md border border-slate-200 bg-white text-sm text-slate-400 italic">
                {field.placeholder}
              </div>
            </div>
          );
        }

        return (
          <div key={i} className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <div className="px-3 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-400 italic">
              {field.placeholder}
            </div>
          </div>
        );
      })}

      {/* Preview submit button */}
      <div className="pt-2 flex justify-end gap-3">
        <div className="px-4 py-2 rounded-md border border-slate-200 text-sm font-medium text-slate-500 select-none">
          Cancel
        </div>
        <div
          className="px-4 py-2 rounded-md text-white text-sm font-semibold select-none"
          style={{ background: form.color }}
        >
          {form.id === 'cta' ? 'Submit & View' : 'Submit'}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────── */
export default function FormDefinitionsPage() {
  const router = useRouter();
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [previewForm, setPreviewForm] = React.useState<FormDef | null>(null);
  const [thankYouUrls, setThankYouUrls] = React.useState<Record<string, string>>({
    contact: '/thank-you',
    cta: '/thank-you',
  });
  const [savingType, setSavingType] = React.useState<string | null>(null);
  const [savedType, setSavedType] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch('/api/admin/forms');
        if (!res.ok) return;
        const data: { formType: string }[] = await res.json();
        const c: Record<string, number> = {};
        for (const sub of data) {
          const t = sub.formType || 'contact';
          c[t] = (c[t] || 0) + 1;
        }
        setCounts(c);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/forms/settings');
        if (!res.ok) return;
        const data = await res.json();
        setThankYouUrls({
          contact: data?.contact?.thankYouUrl || '/thank-you',
          cta: data?.cta?.thankYouUrl || '/thank-you',
        });
      } catch {
        // silent
      }
    }

    fetchCounts();
    fetchSettings();
  }, []);

  async function saveThankYouUrl(formType: 'contact' | 'cta') {
    setSavingType(formType);
    setSavedType(null);
    try {
      const res = await fetch('/api/admin/forms/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [formType]: { thankYouUrl: thankYouUrls[formType] || '' },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      const data = await res.json();
      setThankYouUrls({
        contact: data?.contact?.thankYouUrl || '/thank-you',
        cta: data?.cta?.thankYouUrl || '/thank-you',
      });
      setSavedType(formType);
      toast.success('Thank you page link saved');
      window.setTimeout(() => setSavedType(null), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Could not save thank you link');
    } finally {
      setSavingType(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 w-full"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Forms</h1>
          <p className="text-slate-500 font-medium">
            All active forms on the website. Set a thank-you page link per form to redirect after submission.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/forms')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B2A63] text-white text-sm font-semibold hover:bg-[#3A1F4D] transition-colors cursor-pointer"
        >
          <ClipboardList className="w-4 h-4" />
          View All Leads
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/60 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">S.No</th>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">Form Name</th>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">Type</th>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">Fields</th>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">Thank You Page</th>
              <th className="px-6 py-4 font-semibold text-slate-500 whitespace-nowrap">Submissions</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {FORMS.map((form, i) => (
              <tr key={form.id} className="hover:bg-slate-50/50 transition-colors">
                {/* # */}
                <td className="px-6 py-5 text-slate-400 font-semibold">{i + 1}</td>

                {/* Name */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ background: form.color }}
                    >
                      {form.id === 'contact'
                        ? <Mail className="w-4 h-4" />
                        : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{form.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-[220px] truncate">{form.description}</p>
                    </div>
                  </div>
                </td>

                {/* Type badge */}
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                    {form.formType}
                  </span>
                </td>

                {/* Field count + pills */}
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                    {form.fields.map((f, fi) => (
                      <span
                        key={fi}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${TYPE_BADGE[f.type]}`}
                      >
                        {f.type}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Thank you URL */}
                <td className="px-6 py-5 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={thankYouUrls[form.formType] ?? ''}
                        onChange={(e) =>
                          setThankYouUrls((prev) => ({
                            ...prev,
                            [form.formType]: e.target.value,
                          }))
                        }
                        placeholder="/thank-you"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4B2A63]/30 focus:border-[#4B2A63]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => saveThankYouUrl(form.formType)}
                      disabled={savingType === form.formType}
                      title="Save thank you page link"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#4B2A63] text-white hover:bg-[#3A1F4D] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {savingType === form.formType ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : savedType === form.formType ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    After submit, redirect here. PDF opens after 5s if attached.
                  </p>
                </td>

                {/* Submissions */}
                <td className="px-6 py-5">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                  ) : (
                    <button
                      onClick={() => router.push(`/admin/forms?tab=${form.submissionsTab}`)}
                      className="flex items-center gap-1.5 text-sm font-bold cursor-pointer hover:underline"
                      style={{ color: form.color }}
                    >
                      {counts[form.formType] ?? 0}
                      <span className="text-xs font-medium text-slate-400">leads</span>
                    </button>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setPreviewForm(form)}
                    title="Preview Form"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-[#4B2A63] hover:text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Preview Dialog */}
      <Dialog open={!!previewForm} onOpenChange={(open) => !open && setPreviewForm(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
          <AnimatePresence>
            {previewForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                {/* Dialog Header */}
                <div
                  className="px-6 py-5 flex items-center justify-between"
                  style={{ background: previewForm.color }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      {previewForm.id === 'contact'
                        ? <Mail className="w-4 h-4" />
                        : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{previewForm.name}</h2>
                      <p className="text-xs text-white/70 mt-0.5">{previewForm.usedIn}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewForm(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview banner */}
                <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">
                    Preview mode — this is a read-only mockup of the live form.
                  </p>
                </div>

                {/* Form fields preview */}
                <div className="px-6 py-6 bg-white">
                  <FormPreview form={previewForm} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

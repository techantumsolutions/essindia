'use client';

import React from 'react';
import { Loader2, X, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSectionDefinition } from '@/lib/cms/section-registry';

interface SaveSectionLibraryModalProps {
  open: boolean;
  sectionType: string;
  defaultName?: string;
  saving?: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function SaveSectionLibraryModal({
  open,
  sectionType,
  defaultName = '',
  saving = false,
  onClose,
  onConfirm,
}: SaveSectionLibraryModalProps) {
  const [name, setName] = React.useState(defaultName);
  const meta = getSectionDefinition(sectionType);
  const templateLabel = meta?.label || sectionType;
  const templateType = sectionType;

  React.useEffect(() => {
    if (open) {
      setName(defaultName || `${templateLabel} – Saved`);
    }
  }, [open, defaultName, templateLabel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
        disabled={saving}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4B2A63]/10 text-[#4B2A63] flex items-center justify-center">
              <BookmarkPlus className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Save Section Template</h3>
              <p className="text-[11px] text-slate-400">Reuse this filled section on any page</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Section Template
            </p>
            <p className="text-sm font-semibold text-slate-800">{templateLabel}</p>
            <p className="text-[11px] font-mono text-slate-400">{templateType}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600" htmlFor="saved-section-name">
              Saved Template Name <span className="text-red-500">*</span>
            </label>
            <input
              id="saved-section-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BI Tabs – FMCG page filled"
              disabled={saving}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/15 focus:border-[#4B2A63]/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  e.preventDefault();
                  onConfirm(name.trim());
                }
              }}
            />
            <p className="text-[10px] text-slate-400">
              All current fields, colors, and content will be saved with this name.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={saving}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={saving || !name.trim()}
            onClick={() => onConfirm(name.trim())}
            className="rounded-full bg-[#4B2A63] text-white hover:bg-[#3B198F] gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : 'Save Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}

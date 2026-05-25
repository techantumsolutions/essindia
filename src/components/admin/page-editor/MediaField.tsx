'use client';

import React from 'react';
import { ImageIcon, X } from 'lucide-react';
import { humanLabel } from './field-utils';

interface MediaFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}

export function MediaField({ fieldKey, value, onChange }: MediaFieldProps) {
  const [showPreview, setShowPreview] = React.useState(true);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <div className="flex items-start gap-3">
        {value && showPreview ? (
          <div className="relative group shrink-0">
            <img
              src={value}
              alt=""
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-50"
              onError={() => setShowPreview(false)}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
            <ImageIcon className="w-6 h-6 text-slate-300" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowPreview(true);
            }}
            placeholder="Enter image URL or path..."
            className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
          />
          <p className="text-[10px] text-slate-400">
            Paste image URL or use a path like /images/example.jpg
          </p>
        </div>
      </div>
    </div>
  );
}

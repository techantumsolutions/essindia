'use client';

import React from 'react';
import { humanLabel } from './field-utils';

interface ColorPickerFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerField({ fieldKey, value, onChange }: ColorPickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
        />
        {value && (
          <div
            className="w-10 h-10 rounded-xl border border-slate-200 shrink-0"
            style={{ backgroundColor: value }}
          />
        )}
      </div>
    </div>
  );
}

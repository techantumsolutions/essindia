'use client';

import React from 'react';
import { humanLabel } from './field-utils';

interface ColorPickerFieldProps {
  fieldKey: string;
  label?: string;
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

function normalizeHex(color: string | undefined): string {
  if (!color || typeof color !== 'string') return '';
  const trimmed = color.trim();
  if (!trimmed) return '';
  // Native <input type="color"> only accepts #rrggbb
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '';
}

export function ColorPickerField({
  fieldKey,
  label,
  value,
  defaultValue = '',
  onChange,
}: ColorPickerFieldProps) {
  const currentValue = value || '';
  const resolvedDefault = defaultValue || '';
  const displayValue = currentValue || resolvedDefault;
  const pickerValue = normalizeHex(displayValue) || '#ffffff';
  const isUsingDefault = !currentValue && !!resolvedDefault;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500">{label || humanLabel(fieldKey)}</label>
        {currentValue && (
          <button
            type="button"
            onClick={() => onChange(resolvedDefault)}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear (Use Default)
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
          />
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={resolvedDefault || 'Please enter color code (e.g. #7C3AED)'}
          className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
        />
        {displayValue ? (
          <div
            className="w-10 h-10 rounded-xl border border-slate-200 shrink-0 shadow-sm relative"
            style={{ backgroundColor: displayValue }}
            title={isUsingDefault ? `Default: ${resolvedDefault}` : displayValue}
          />
        ) : (
          <div className="w-10 h-10 rounded-xl border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Auto</span>
          </div>
        )}
      </div>
    </div>
  );
}

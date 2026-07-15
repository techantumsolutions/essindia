'use client';

import { cn } from '@/lib/utils';
import { humanLabel } from './field-utils';

interface ToggleSwitchProps {
  fieldKey: string;
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleSwitch({ fieldKey, label, value, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between py-2 px-1 cursor-pointer group">
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
        {label || humanLabel(fieldKey)}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
          value ? 'bg-[#4B2A63]' : 'bg-slate-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
            value ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </label>
  );
}

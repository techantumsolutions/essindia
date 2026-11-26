'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ServiceSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  placeholderClassName?: string;
}

/**
 * Shared mandatory Service dropdown populated dynamically from `/api/forms/settings`.
 */
export function ServiceSelectField({
  value,
  onChange,
  placeholder = 'Please select a service',
  disabled,
  triggerClassName,
  contentClassName,
  placeholderClassName,
}: ServiceSelectFieldProps) {
  const [services, setServices] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetch('/api/forms/settings', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        setServices(Array.isArray(data?.services) ? data.services : []);
      })
      .catch(() => {
        if (!active) return;
        setServices([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Select value={value} onValueChange={(v) => onChange(v || '')} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'w-full px-4 !h-[38px] rounded-md border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-white shadow-none',
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value ? (
            <span className="truncate">{value}</span>
          ) : (
            <span className={cn('text-slate-400 truncate', placeholderClassName)}>{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn('max-h-60 p-1', contentClassName)}
        alignItemWithTrigger={false}
        side="bottom"
        collisionAvoidance={{ side: 'none' }}
      >
        {isLoading ? (
          <div className="py-3 text-center text-xs text-slate-400">Loading services...</div>
        ) : services.length > 0 ? (
          services.map((svc) => (
            <SelectItem key={svc} value={svc} className="cursor-pointer">
              {svc}
            </SelectItem>
          ))
        ) : (
          <div className="py-3 px-2 text-center text-xs text-slate-400">No services available</div>
        )}
      </SelectContent>
    </Select>
  );
}

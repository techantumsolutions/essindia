'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_PHONE_COUNTRY, DIAL_CODES } from '@/lib/dial-codes';
import { cn } from '@/lib/utils';

export type PhoneFieldVariant = 'attached' | 'split';

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  variant?: PhoneFieldVariant;
  required?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  inputClassName?: string;
  contentClassName?: string;
}

export function PhoneField({
  value,
  onChange,
  countryCode,
  onCountryChange,
  variant = 'attached',
  required,
  name,
  id,
  placeholder = 'Enter phone number',
  disabled,
  className,
  triggerClassName,
  inputClassName,
  contentClassName,
}: PhoneFieldProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const region = countryCode || DEFAULT_PHONE_COUNTRY;
  const attached = variant === 'attached';

  const filtered = DIAL_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery)
  );

  const selectedDial = DIAL_CODES.find((c) => c.code === region)?.dialCode;

  return (
    <div className={cn(attached ? 'flex' : 'flex gap-2', className)}>
      <Select
        value={region}
        onValueChange={(v) => onCountryChange(v || DEFAULT_PHONE_COUNTRY)}
        onOpenChange={(open) => !open && setSearchQuery('')}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            attached
              ? 'w-[100px] px-3 !h-[38px] rounded-l-lg rounded-r-none border border-r-0 border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-gray-50 shadow-none z-10 relative'
              : 'w-[100px] px-3 !h-[38px] rounded-md border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-slate-50 shadow-none relative shrink-0',
            triggerClassName
          )}
        >
          <SelectValue>
            {region && (
              <span className="flex items-center gap-1.5">
                {selectedDial}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className={cn('w-[260px] max-h-60 p-0', contentClassName)}
          align="start"
          alignItemWithTrigger={false}
          side="bottom"
          collisionAvoidance={{ side: 'none' }}
        >
          <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm outline-none border border-gray-200 rounded-md focus:border-[#5C2B6A] focus:ring-1 focus:ring-[#5C2B6A] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === ' ') {
                  e.preventDefault();
                  setSearchQuery((prev) => prev + ' ');
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="p-1">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <SelectItem key={c.code} value={c.code} className="cursor-pointer flex items-center gap-2">
                  <span className="text-gray-500 w-10">{c.dialCode}</span>
                  <span className="truncate">{c.name}</span>
                </SelectItem>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">Not found</div>
            )}
          </div>
        </SelectContent>
      </Select>
      <input
        id={id}
        name={name}
        type="tel"
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="tel-national"
        className={cn(
          attached
            ? 'w-full px-4 !h-[38px] rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm relative z-0'
            : 'flex-1 !h-[38px] rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent',
          inputClassName
        )}
      />
    </div>
  );
}

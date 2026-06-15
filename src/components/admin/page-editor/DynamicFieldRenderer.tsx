'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectFieldType, humanLabel } from './field-utils';
import type { JsonValue, FieldType } from './field-utils';
import { ToggleSwitch } from './ToggleSwitch';
import { ColorPickerField } from './ColorPickerField';
import { MediaField } from './MediaField';
import { RichTextField } from './RichTextField';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import { ALL_COUNTRIES_LIST } from '@/lib/countries';

interface DynamicFieldRendererProps {
  keyPath: string;
  fieldKey: string;
  value: JsonValue;
  onChange: (keyPath: string, value: JsonValue) => void;
  depth?: number;
}

export function DynamicFieldRenderer({
  keyPath,
  fieldKey,
  value,
  onChange,
  depth = 0,
}: DynamicFieldRendererProps) {
  const fieldType = detectFieldType(fieldKey, value);

  switch (fieldType) {
    case 'null':
      return (
        <div className="flex items-center gap-3 py-1">
          <label className="text-xs font-semibold text-slate-400 w-36 shrink-0 truncate">
            {humanLabel(fieldKey)}
          </label>
          <span className="text-xs text-slate-300 italic">Empty</span>
        </div>
      );

    case 'boolean':
      return (
        <ToggleSwitch
          fieldKey={fieldKey}
          value={value as boolean}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'number':
      return (
        <NumberField
          fieldKey={fieldKey}
          value={value as number}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'color':
      return (
        <ColorPickerField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'image':
      return (
        <MediaField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'url':
      return (
        <UrlField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'icon':
      return (
        <IconField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'countryCode':
      return (
        <CountryCodeField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'richtext':
      return (
        <RichTextField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'textarea':
      return (
        <TextareaField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'text':
      return (
        <TextField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'array':
      return (
        <ArrayField
          keyPath={keyPath}
          fieldKey={fieldKey}
          value={value as JsonValue[]}
          onChange={onChange}
          depth={depth}
        />
      );

    case 'object':
      return (
        <ObjectField
          keyPath={keyPath}
          fieldKey={fieldKey}
          value={value as Record<string, JsonValue>}
          onChange={onChange}
          depth={depth}
        />
      );

    default:
      return null;
  }
}

function TextField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isTitleLike = /title|heading|name|label/i.test(fieldKey);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full bg-slate-50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20',
          isTitleLike ? 'text-base font-bold' : 'text-sm font-medium'
        )}
      />
    </div>
  );
}

function TextareaField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(3, Math.ceil((value?.length || 0) / 80)))}
        className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 resize-y min-h-[72px] border border-transparent focus:border-[#4B2A63]/20"
      />
    </div>
  );
}

function NumberField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20 max-w-[200px]"
      />
    </div>
  );
}

function UrlField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// or /path..."
          className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#4B2A63] hover:underline shrink-0"
          >
            Test
          </a>
        )}
      </div>
    </div>
  );
}

function IconField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#4B2A63]/5 flex items-center justify-center text-sm font-bold text-[#4B2A63] shrink-0">
          {value ? value.charAt(0).toUpperCase() : '?'}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Icon name (e.g., Shield, Star)"
          className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
        />
      </div>
    </div>
  );
}

function ObjectField({
  keyPath,
  fieldKey,
  value,
  onChange,
  depth,
}: {
  keyPath: string;
  fieldKey: string;
  value: Record<string, JsonValue>;
  onChange: (keyPath: string, value: JsonValue) => void;
  depth: number;
}) {
  const [collapsed, setCollapsed] = React.useState(depth > 2);
  const keys = Object.keys(value);

  const isCtaLike = /cta|button|action|link/i.test(fieldKey);
  const isHeadingLike = /heading|header|title/i.test(fieldKey);

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden',
        isCtaLike
          ? 'border-violet-200 bg-violet-50/30'
          : isHeadingLike
            ? 'border-blue-200 bg-blue-50/20'
            : 'border-slate-200 bg-white'
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors',
          isCtaLike
            ? 'hover:bg-violet-50'
            : isHeadingLike
              ? 'hover:bg-blue-50'
              : 'hover:bg-slate-50'
        )}
      >
        {collapsed ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
        <span
          className={cn(
            'text-xs font-bold uppercase tracking-wider',
            isCtaLike ? 'text-violet-600' : isHeadingLike ? 'text-blue-600' : 'text-slate-600'
          )}
        >
          {humanLabel(fieldKey)}
        </span>
        <span className="text-[10px] text-slate-400">{keys.length} fields</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {keys.map((k) => (
            <DynamicFieldRenderer
              key={k}
              keyPath={keyPath ? `${keyPath}.${k}` : k}
              fieldKey={k}
              value={value[k]}
              onChange={onChange}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArrayField({
  keyPath,
  fieldKey,
  value,
  onChange,
  depth,
}: {
  keyPath: string;
  fieldKey: string;
  value: JsonValue[];
  onChange: (keyPath: string, value: JsonValue) => void;
  depth: number;
}) {
  const isPrimitive = value.length > 0 && typeof value[0] !== 'object';
  const isImageArray = isPrimitive && (
    fieldKey.toLowerCase().includes('image') ||
    fieldKey.toLowerCase().includes('logo') ||
    fieldKey.toLowerCase().includes('photo')
  );

  return (
    <ArrayFieldEditor
      fieldKey={fieldKey}
      value={value}
      onChange={(newArr) => onChange(keyPath, newArr)}
      keyPathPrefix={keyPath}
      renderItem={(item, _idx, onItemChange, itemKeyPath) => {
        if (isPrimitive) {
          if (isImageArray) {
            return (
              <div className="flex-1">
                <MediaField
                  fieldKey={`${fieldKey}-${_idx}`}
                  value={String(item ?? '')}
                  onChange={(v) => onItemChange(_idx, v)}
                />
              </div>
            );
          }
          return (
            <input
              type="text"
              value={String(item ?? '')}
              onChange={(e) => onItemChange(_idx, e.target.value)}
              className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
            />
          );
        }

        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const objItem = item as Record<string, JsonValue>;
          return (
            <>
              {Object.keys(objItem).map((k) => (
                <DynamicFieldRenderer
                  key={k}
                  keyPath={`${itemKeyPath}.${k}`}
                  fieldKey={k}
                  value={objItem[k]}
                  onChange={(_kp, newVal) => {
                    onItemChange(_idx, { ...objItem, [k]: newVal });
                  }}
                  depth={depth + 2}
                />
              ))}
            </>
          );
        }

        return (
          <DynamicFieldRenderer
            keyPath={itemKeyPath}
            fieldKey={`Item`}
            value={item}
            onChange={(_kp, newVal) => onItemChange(_idx, newVal)}
            depth={depth + 2}
          />
        );
      }}
    />
  );
}

function CountryCodeField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
      >
        <option value="">Select a country...</option>
        {ALL_COUNTRIES_LIST.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}

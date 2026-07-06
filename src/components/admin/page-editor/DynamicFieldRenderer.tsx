'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectFieldType, humanLabel } from './field-utils';
import type { JsonValue, FieldType } from './field-utils';
import { ToggleSwitch } from './ToggleSwitch';
import { ColorPickerField } from './ColorPickerField';
import { MediaField } from './MediaField';
import { RichTextField } from './RichTextField';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import { ALL_COUNTRIES_LIST } from '@/lib/countries';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';

interface DynamicFieldRendererProps {
  keyPath: string;
  fieldKey: string;
  value: JsonValue;
  onChange: (keyPath: string, value: JsonValue) => void;
  depth?: number;
  sectionType?: string;
}

import { getImageHint } from '@/lib/cms/image-dimensions';

export function DynamicFieldRenderer({
  keyPath,
  fieldKey,
  value,
  onChange,
  depth = 0,
  sectionType,
}: DynamicFieldRendererProps) {
  let fieldType = detectFieldType(fieldKey, value, sectionType);
  if (fieldKey.toLowerCase().includes('pdf')) {
    fieldType = 'image';
  }

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
          value={String(value ?? '')}
          onChange={(v) => onChange(keyPath, v)}
          hint={sectionType ? getImageHint(sectionType, fieldKey) : undefined}
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

    case 'topicSelect':
      return (
        <TopicSelectField
          fieldKey={fieldKey}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'industrySelect':
      return (
        <IndustrySelectField
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
      if (sectionType === 'services' && fieldKey === 'services') {
        return (
          <SelectedPagesField
            keyPath={keyPath}
            fieldKey={fieldKey}
            value={value as JsonValue[]}
            onChange={onChange}
            depth={depth}
          />
        );
      }
      return (
        <ArrayField
          keyPath={keyPath}
          fieldKey={fieldKey}
          value={value as JsonValue[]}
          onChange={onChange}
          depth={depth}
          sectionType={sectionType}
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
          sectionType={sectionType}
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
  const isTabDesc = fieldKey.toLowerCase() === 'tabdesc';
  const maxLength = isTabDesc ? 50 : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
        {maxLength && (
          <span className={cn(
            "text-[10px] font-medium",
            (value?.length || 0) >= maxLength ? "text-red-500 font-bold" : "text-slate-400"
          )}>
            {(value?.length || 0)}/{maxLength}
          </span>
        )}
      </div>
      <input
        type="text"
        value={value || ''}
        maxLength={maxLength}
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
  sectionType,
}: {
  keyPath: string;
  fieldKey: string;
  value: Record<string, JsonValue>;
  onChange: (keyPath: string, value: JsonValue) => void;
  depth: number;
  sectionType?: string;
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
              sectionType={sectionType}
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
  sectionType,
}: {
  keyPath: string;
  fieldKey: string;
  value: JsonValue[];
  onChange: (keyPath: string, value: JsonValue) => void;
  depth: number;
  sectionType?: string;
}) {
  let normalizedValue = value;
  if (sectionType === 'bi-tabs' && fieldKey === 'tabs' && Array.isArray(value)) {
    normalizedValue = value.map(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return {
          tabName: '',
          tabDesc: '',
          heading: '',
          subheading: '',
          questions: [],
          image: '',
          ...item
        };
      }
      return item;
    });
  }

  const isPrimitive = normalizedValue.length > 0 && typeof normalizedValue[0] !== 'object';
  const isImageArray = isPrimitive && (
    fieldKey.toLowerCase().includes('image') ||
    fieldKey.toLowerCase().includes('logo') ||
    fieldKey.toLowerCase().includes('photo')
  );

  return (
    <ArrayFieldEditor
      fieldKey={fieldKey}
      value={normalizedValue}
      onChange={(newArr) => onChange(keyPath, newArr)}
      keyPathPrefix={keyPath}
      sectionType={sectionType}
      renderItem={(item, _idx, onItemChange, itemKeyPath) => {
        if (isPrimitive) {
          if (isImageArray) {
            return (
              <div className="flex-1">
                <MediaField
                  fieldKey={`${fieldKey}-${_idx}`}
                  value={String(item ?? '')}
                  onChange={(v) => onItemChange(_idx, v)}
                  hint={sectionType ? getImageHint(sectionType, fieldKey) : undefined}
                />
              </div>
            );
          }
          if (fieldKey === 'paragraphs') {
            return (
              <div className="flex-1">
                <RichTextField
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

          // Detect nested CMS sections (objects with a type string and content/contentJson)
          if (fieldKey === 'sections' && typeof objItem.type === 'string' && ('content' in objItem || 'contentJson' in objItem)) {
            const sectionTypeStr = objItem.type as string;
            const contentKey = 'content' in objItem ? 'content' : 'contentJson';
            const contentObj = (objItem[contentKey] as Record<string, JsonValue>) || {};
            const schema = SECTION_REGISTRY.find(s => s.type === sectionTypeStr);

            if (schema) {
              return (
                <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="text-sm font-bold text-slate-700 mb-2 border-b border-slate-200 pb-2 flex justify-between items-center">
                    <span>{schema.label} Configuration</span>
                    <span className="text-[10px] bg-[#4B2A63]/10 text-[#4B2A63] px-2 py-1 rounded uppercase">{sectionTypeStr}</span>
                  </div>
                  {(schema.fieldOrder || Object.keys(contentObj)).map(k => (
                    <DynamicFieldRenderer
                      key={k}
                      keyPath={`${itemKeyPath}.${contentKey}.${k}`}
                      fieldKey={k}
                      value={contentObj[k] ?? ''}
                      onChange={(_kp, newVal) => {
                        const newContent = { ...contentObj, [k]: newVal };
                        onItemChange(_idx, { ...objItem, [contentKey]: newContent });
                      }}
                      depth={depth + 2}
                      sectionType={sectionTypeStr}
                    />
                  ))}
                </div>
              );
            }
          }
          
          let sortedKeys = Object.keys(objItem);
          if (fieldKey === 'testimonials') {
            const testimonialOrder = ['topic', 'industry', 'companyName', 'quote', 'authorAvatar', 'authorName', 'authorTitle'];
            sortedKeys = sortedKeys.filter(k => k !== 'logoUrl');
            sortedKeys.sort((a, b) => {
              const indexA = testimonialOrder.indexOf(a);
              const indexB = testimonialOrder.indexOf(b);
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return 0;
            });
          } else if (fieldKey === 'cards') {
            let cardOrder = ['badge', 'icon', 'image', 'title', 'description', 'contact', 'badgeBorderColor', 'badgeTextColor', 'badgeBgColor'];
            if (sectionType && sectionType.startsWith('fmcg-')) {
              if (sectionType === 'fmcg-action') {
                cardOrder = ['badge', 'image', 'title', 'description', 'badgeBorderColor', 'badgeTextColor', 'badgeBgColor'];
              } else if (sectionType === 'fmcg-impact' || sectionType === 'fmcg-integrations') {
                cardOrder = ['image', 'title'];
              } else if (sectionType === 'fmcg-challenges' || sectionType === 'fmcg-empower') {
                cardOrder = ['icon', 'title', 'description'];
              }
            }
            sortedKeys = cardOrder.filter(k => k in objItem);
          } else if (fieldKey === 'faqs') {
            if (!('quotation' in objItem)) {
              if ('qutation' in objItem) {
                objItem.quotation = objItem.qutation;
                delete objItem.qutation;
              } else if ('question' in objItem) {
                objItem.quotation = objItem.question;
                delete objItem.question;
              }
            }
            const faqOrder = ['quotation', 'answer', 'arrowIcon'];
            sortedKeys = faqOrder.filter(k => k in objItem);
          } else if (fieldKey === 'locations') {
            if (!('name' in objItem) && 'person' in objItem) {
              objItem.name = objItem.person;
              delete objItem.person;
            }
            const locationOrder = ['city', 'address', 'name', 'phone', 'email'];
            sortedKeys = locationOrder;
          } else if (fieldKey === 'sections' && 'items' in objItem) {
            const sectionOrder = ['title', 'items'];
            sortedKeys = sectionOrder;
          } else if (fieldKey.toLowerCase().includes('items')) {
            let itemOrder = ['icon', 'text', 'title', 'description', 'image', 'ctaText', 'ctaUrl'];
            if (sectionType === 'oracle-apex-approach') {
              itemOrder = ['image', 'title'];
            }
            sortedKeys = itemOrder.filter(k => k in objItem);
          } else if (fieldKey === 'steps') {
            const stepOrder = ['icon', 'image', 'title', 'description'];
            sortedKeys = stepOrder.filter(k => k in objItem);
          } else if (fieldKey === 'features') {
            const featureOrder = ['icon', 'title', 'description'];
            sortedKeys = featureOrder.filter(k => k in objItem);
          } else if (fieldKey === 'tabs') {
            let tabOrder = ['tabName', 'heading', 'subheading', 'questions', 'image'];
            if (sectionType === 'bi-tabs') {
              tabOrder = ['tabName', 'tabDesc', 'heading', 'subheading', 'questions', 'image'];
            } else if (sectionType === 'fmcg-use-cases') {
              tabOrder = ['tabName', 'tag', 'heading', 'points', 'buttonText', 'buttonUrl', 'image'];
            } else if (sectionType === 'aom-workspace') {
              tabOrder = ['label', 'desc', 'icon', 'contentTitle', 'contentDescription', 'contentImage', 'benefits', 'ctaText', 'ctaUrl'];
            } else if (sectionType === 'bi-industry-services') {
              tabOrder = ['tabName', 'tabTitle', 'points', 'buttonText', 'buttonUrl', 'image'];
            } else if (sectionType === 'oracle-apex-approach') {
              tabOrder = ['tabName', 'items'];
            } else if (sectionType === 'mfg-icons') {
              tabOrder = ['label', 'iconImage', 'sections'];
            }
            sortedKeys = tabOrder.filter(k => k in objItem);
          } else if (fieldKey === 'stats') {
            const statOrder = ['value', 'label'];
            sortedKeys = statOrder.filter(k => k in objItem);
          } else if (fieldKey === 'solutions') {
            const solutionOrder = ['title', 'description'];
            sortedKeys = solutionOrder.filter(k => k in objItem);
          } else if (fieldKey === 'benefits') {
            const benefitOrder = ['image', 'title'];
            sortedKeys = benefitOrder.filter(k => k in objItem);
          } else if (fieldKey === 'industries' && sectionType === 'rpa-industries') {
            const industryOrder = ['icon', 'title', 'description'];
            sortedKeys = industryOrder.filter(k => k in objItem);
          } else {
            // Heuristic to sort common fields logically
            const priorityKeys = ['subtitle', 'iconImage', 'icon', 'image', 'title', 'tags', 'name', 'heading', 'label', 'description', 'bgImage', 'ctaText', 'ctaUrl', 'items', 'points', 'cards'];
            sortedKeys.sort((a, b) => {
              const indexA = priorityKeys.indexOf(a);
              const indexB = priorityKeys.indexOf(b);
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return 0;
            });
          }

          return (
            <>
              {sortedKeys.map((k) => (
                <DynamicFieldRenderer
                  key={k}
                  keyPath={`${itemKeyPath}.${k}`}
                  fieldKey={k}
                  value={objItem[k]}
                  onChange={(_kp, newVal) => {
                    onItemChange(_idx, { ...objItem, [k]: newVal });
                  }}
                  depth={depth + 2}
                  sectionType={sectionType}
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

const TOPIC_OPTIONS = [
  'Business Intelligence',
  'ERP Solutions',
  'IoT Solutions',
  'Mobile App Solutions',
  'CRM Solutions',
  'Sales Force Automation',
  'After-Sales Service App'
];

function TopicSelectField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5 flex-1 min-w-[200px]">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
      >
        <option value="">Select a topic...</option>
        {TOPIC_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

const INDUSTRY_OPTIONS = [
  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics'
];

function IndustrySelectField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5 flex-1 min-w-[200px]">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
      >
        <option value="">Select an industry...</option>
        {INDUSTRY_OPTIONS.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectedPagesField({
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
  const [pages, setPages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetch('/api/admin/pages?registry=true')
      .then(r => r.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const selectedItems = (Array.isArray(value) ? value : []) as any[];

  const handleSelect = (page: any) => {
    if (selectedItems.length >= 6) return;
    const newItem = {
      title: page.title || '',
      description: page.heroDescription || page.seoDescription || '',
      ctaUrl: page.routePath || '',
      ctaText: 'View more',
      bgImage: '',
      iconImage: ''
    };
    onChange(keyPath, [...selectedItems, newItem]);
    setSearch('');
  };

  const handleRemove = (index: number) => {
    const newArr = [...selectedItems];
    newArr.splice(index, 1);
    onChange(keyPath, newArr);
  };
    const replaceItem = (index: number, page: any) => {
      const newArr = [...selectedItems];
      newArr[index] = {
        ...newArr[index],
        title: page.title || '',
        description: page.heroDescription || page.seoDescription || '',
        ctaUrl: page.routePath || ''
      };
      onChange(keyPath, newArr);
    };

    const updateItemField = (index: number, field: string, val: string) => {
      const newArr = [...selectedItems];
      newArr[index] = { ...newArr[index], [field]: val };
      onChange(keyPath, newArr);
    };

    const megaMenuPages = pages.filter(p => p.categoryLabel || p.subCategoryLabel || p.subSubCategoryLabel);
    const availablePages = megaMenuPages.filter(p => !selectedItems.some(si => si.ctaUrl === p.routePath));

  return (
    <div className="space-y-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <label className="text-sm font-bold text-slate-700">Selected Pages ({selectedItems.length}/6)</label>
      </div>

      <div className="space-y-4">
        {selectedItems.map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative group">
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-red-500 opacity-50 hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
              <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Change Page</label>
                    <select
                      value={item.ctaUrl || ''}
                      onChange={(e) => {
                        const selectedPath = e.target.value;
                        const selectedPage = megaMenuPages.find(p => p.routePath === selectedPath);
                        if (selectedPage) replaceItem(idx, selectedPage);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B2A63]/20"
                    >
                      <option value="" disabled>-- Select a Page --</option>
                      {megaMenuPages.filter(p => p.routePath === item.ctaUrl || !selectedItems.some(si => si.ctaUrl === p.routePath)).map(p => (
                        <option key={p.id} value={p.routePath}>{p.title} ({p.routePath})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.ctaUrl}</div>
                    {item.description && <div className="text-sm text-slate-600 mt-2 line-clamp-2">{item.description}</div>}
                  </div>
                </div>
          </div>
        ))}
      </div>

        {selectedItems.length < 6 && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-500 block mb-2">Add New Page</label>
            <select
              value=""
              onChange={(e) => {
                const selectedPath = e.target.value;
                const selectedPage = megaMenuPages.find(p => p.routePath === selectedPath);
                if (selectedPage) handleSelect(selectedPage);
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B2A63]/20"
            >
              <option value="" disabled>-- Select a Page to Add --</option>
              {availablePages.map(p => (
                <option key={p.id} value={p.routePath}>{p.title} ({p.routePath})</option>
              ))}
            </select>
          </div>
        )}
    </div>
  );
}

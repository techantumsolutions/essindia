'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectFieldType, humanLabel, isHiddenCmsField } from './field-utils';
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
  allSectionValues?: Record<string, JsonValue>;
}

import { getImageHint } from '@/lib/cms/image-dimensions';

export function DynamicFieldRenderer({
  keyPath,
  fieldKey,
  value,
  onChange,
  depth = 0,
  sectionType,
  allSectionValues,
}: DynamicFieldRendererProps) {
  if (isHiddenCmsField(fieldKey, sectionType, keyPath)) return null;

  const fieldLabel = humanLabel(fieldKey, { sectionType, keyPath });

  let fieldType = detectFieldType(fieldKey, value, sectionType, keyPath);
  if (sectionType === 'career-perks' || keyPath.includes('perks') || fieldKey.toLowerCase().includes('perk')) {
    if (fieldType === 'richtext' || fieldType === 'text') {
      fieldType = 'textarea';
    }
  }
  if (fieldKey.toLowerCase().includes('pdf') || fieldKey.toLowerCase().includes('document')) {
    fieldType = 'image';
  }

  if (fieldKey === 'highlightedWordIndices') {
    return (
      <WordHighlightSelector
        fieldKey={fieldKey}
        label={fieldLabel}
        value={value}
        onChange={(v) => onChange(keyPath, v)}
        sectionType={sectionType}
        allSectionValues={allSectionValues}
      />
    );
  }

  if (sectionType === 'bi-features' && (fieldKey === 'standard' || fieldKey === 'professional')) {
    const valStr = typeof value === 'boolean' ? (value ? 'yes' : 'no') : String(value || 'no').toLowerCase();
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          {fieldLabel}
        </label>
        <select
          value={valStr === 'yes' || valStr === 'true' ? 'yes' : 'no'}
          onChange={(e) => onChange(keyPath, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4B2A63] focus:border-transparent font-medium"
        >
          <option value="yes">Yes (Check Icon)</option>
          <option value="no">No (Cross Icon)</option>
        </select>
      </div>
    );
  }

  switch (fieldType) {
    case 'null':
      return (
        <div className="flex items-center gap-3 py-1">
          <label className="admin-label w-36 shrink-0 truncate">
            {fieldLabel}
          </label>
          <span className="text-xs text-slate-300 italic">Empty</span>
        </div>
      );

    case 'boolean':
      return (
        <ToggleSwitch
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as boolean}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'number':
      return (
        <NumberField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as number}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'color':
      return (
        <ColorPickerField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'image':
      return (
        <MediaField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={String(value ?? '')}
          onChange={(v) => onChange(keyPath, v)}
          hint={sectionType ? getImageHint(sectionType, fieldKey) : undefined}
          sectionType={sectionType}
        />
      );

    case 'url':
      return (
        <UrlField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'icon':
      return (
        <IconField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'countryCode':
      return (
        <CountryCodeField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'topicSelect':
      return (
        <TopicSelectField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'industrySelect':
      return (
        <IndustrySelectField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'richtext':
      return (
        <RichTextField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
          maxLength={sectionType === 'rpa-capabilities' && keyPath.includes('items') && fieldKey === 'description' ? 120 : undefined}
        />
      );

    case 'textarea':
      return (
        <TextareaField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'text':
      return (
        <TextField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'array':
      if (fieldKey === 'contentSegments' && sectionType === 'blog-detail-block') {
        return (
          <ContentSegmentsEditor
            keyPath={keyPath}
            value={value as any[]}
            onChange={(newVal) => onChange(keyPath, newVal)}
          />
        );
      }
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

    case 'formSelect':
      return (
        <FormSelectField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={value as string}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    case 'ratingSelect':
      return (
        <RatingSelectField
          fieldKey={fieldKey}
          label={fieldLabel}
          value={Number(value ?? 5)}
          onChange={(v) => onChange(keyPath, v)}
        />
      );

    default:
      return null;
  }
}

function TextField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isTitleLike = /title|heading|name|label/i.test(fieldKey);
  const isTabDesc = fieldKey.toLowerCase() === 'tabdesc';
  const maxLength = isTabDesc ? 50 : undefined;
  const displayLabel = label || humanLabel(fieldKey);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="admin-label">{displayLabel}</label>
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
          'admin-input',
          isTitleLike ? 'text-base font-bold' : 'text-sm font-medium'
        )}
      />
    </div>
  );
}

function TextareaField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(3, Math.ceil((value?.length || 0) / 80)))}
        className="admin-input resize-y min-h-[72px]"
      />
    </div>
  );
}

function NumberField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="admin-input max-w-[200px]"
      />
    </div>
  );
}

function UrlField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// or /path..."
          className="admin-input flex-1"
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

const FORM_OPTIONS = [
  { value: '', label: 'None (use URL)', icon: '🔗', desc: 'Navigates to the URL above' },
  { value: 'contact', label: 'Contact Us Form', icon: '✉️', desc: 'Opens the Contact Us modal' },
  { value: 'cta', label: 'Page CTA Form', icon: '📄', desc: 'Opens the CTA lead-capture modal' },
] as const;

function FormSelectField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <div className="grid grid-cols-3 gap-2">
        {FORM_OPTIONS.map((opt) => {
          const isActive = (value || '') === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
                isActive
                  ? 'border-[#4B2A63] bg-[#4B2A63]/5 ring-1 ring-[#4B2A63]/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <span className="text-base leading-none">{opt.icon}</span>
              <span className={cn('text-[11px] font-bold leading-tight', isActive ? 'text-[#4B2A63]' : 'text-slate-700')}>
                {opt.label}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RatingSelectField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const currentVal = Number(value) || 5;
  return (
    <div className="space-y-1.5 flex-1 min-w-[180px]">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
              currentVal === num
                ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold scale-105 ring-1 ring-amber-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            )}
          >
            <span className="text-amber-500">★</span>
            <span>{num}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function IconField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#4B2A63]/5 flex items-center justify-center text-sm font-bold text-[#4B2A63] shrink-0">
          {value ? value.charAt(0).toUpperCase() : '?'}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Icon name (e.g., Shield, Star)"
          className="admin-input flex-1"
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

  // Dynamically inject formType if a url/href field is present inside this object
  const mergedValue = { ...value };
  if (sectionType === 'landing1-cta' && fieldKey === 'form') {
    if (!('title' in mergedValue)) mergedValue['title'] = 'Schedule your free demo';
    if (!('disclaimerText' in mergedValue)) mergedValue['disclaimerText'] = 'I agree to the Privacy Policy and consent to be contacted about ESS ERP.';
    if (!('buttonText' in mergedValue)) mergedValue['buttonText'] = 'Schedule Free Demo';
    if (!('note' in mergedValue)) mergedValue['note'] = 'Your data is secure and never shared.';
  }
  const hasUrlKey = Object.keys(mergedValue).some(k => /^(url|href)$/i.test(k));
  if (hasUrlKey && !('formType' in mergedValue)) {
    mergedValue['formType'] = '';
  }

  const showPdf = mergedValue['formType'] === 'cta';
  if (showPdf && !('pdfUrl' in mergedValue)) {
    mergedValue['pdfUrl'] = '';
  }

  const keys = Object.keys(mergedValue);

  // Sort keys so formType is directly under the url/href field, and pdfUrl directly under formType
  const orderedKeys: string[] = [];
  keys.forEach(k => {
    if (k === 'formType' || k === 'pdfUrl') return;
    orderedKeys.push(k);
    if (/^(url|href)$/i.test(k)) {
      if (keys.includes('formType')) {
        orderedKeys.push('formType');
      }
      if (showPdf && (keys.includes('pdfUrl') || 'pdfUrl' in mergedValue)) {
        orderedKeys.push('pdfUrl');
      }
    }
  });
  if (keys.includes('formType') && !orderedKeys.includes('formType')) {
    orderedKeys.push('formType');
  }
  if (showPdf && (keys.includes('pdfUrl') || 'pdfUrl' in mergedValue) && !orderedKeys.includes('pdfUrl')) {
    orderedKeys.push('pdfUrl');
  }

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
          {humanLabel(fieldKey, { sectionType, keyPath })}
        </span>
        <span className="text-[10px] text-slate-400">{orderedKeys.length} fields</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {orderedKeys.map((k) => (
            <DynamicFieldRenderer
              key={k}
              keyPath={keyPath ? `${keyPath}.${k}` : k}
              fieldKey={k}
              value={mergedValue[k]}
              onChange={(childKeyPath, childVal) => {
                const updatedObj = { ...mergedValue, [k]: childVal };
                onChange(keyPath, updatedObj);
              }}
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
  let normalizedValue = Array.isArray(value) ? value : [];
  if (sectionType === 'hospital-tech-specs' && fieldKey === 'specs' && !Array.isArray(value)) {
    normalizedValue = [
      { label: "Tiered Application Architecture Specifications" },
      { label: "IIS 8.0 Application Server" },
      { label: "My SQL DB & Database Server" },
      { label: "HTML5, CSS3, JavaScript Web\nApplication Development" },
      { label: "Auto-scaled Backend Application" },
      { label: "AI/ML Powered Data Analytics &\nReport UI" },
      { label: "Windows 2019 Enterprise\nServer and above" },
      { label: "Sub-millisecond latency on UI queries" }
    ];
  }
  if (sectionType === 'staffing-technologies' && fieldKey === 'columns' && !Array.isArray(value)) {
    normalizedValue = [
      {
        iconImage: "/Staffing Services/analytics-business-chart-finance-graph-money_svgrepo.com.png",
        title: "Business Intelligence (ETL)",
        items: [
          { label: "Manual Testing, JIRA" },
          { label: "PRM Analyst" },
          { label: "WFM Analyst" },
          { label: "Non-ITs" },
          { label: "Talend (BI-DWH)" },
          { label: "Scrum Master" },
          { label: "Java, Microservices" },
          { label: "Solution Engineer" },
        ]
      },
      {
        iconImage: "/Staffing Services/robot_svgrepo.com.png",
        title: "Ui Path, Automation Anywhere",
        items: [
          { label: "Oracle ADF" },
          { label: "Oracle Apex" },
          { label: "UI-React.js" },
          { label: "PMP" },
          { label: "Oracle Developer 2000" },
          { label: "Java" },
          { label: "PL/SQL" },
          { label: "Dev Leads" },
        ]
      },
      {
        iconImage: "/Staffing Services/python-icon-new.png",
        title: "Python",
        items: [
          { label: "Angular" },
          { label: ".Net" },
          { label: "Manual tester (lead)" },
          { label: "Odoo" },
          { label: "Cloud Infra/AWS" },
          { label: "Infra/AWS Infra" },
          { label: "Cloud Engineers" },
          { label: "Automation" },
        ]
      }
    ];
  }
  if (sectionType === 'staffing-why-ess' && fieldKey === 'pills' && !Array.isArray(value)) {
    normalizedValue = [
      { label: "Experience with Fortune 10 clients" },
      { label: "Access top IT Talent" },
      { label: "Offshore/Onsite/Global deployment Capabilities" },
      { label: "Shared and dedicated ODC" },
      { label: "Strong Domain Knowledge" },
      { label: "High speed communication" },
      { label: "All hours availability to suit your time zone" }
    ];
  }
  if (sectionType === 'landing1-works' && fieldKey === 'works' && (!Array.isArray(value) || value.length === 0)) {
    normalizedValue = [
      {
        category: 'Category Name',
        title: "Ghana's leading Producer of Wood Products opts ebizframe ERP",
        date: 'December 18, 2025',
        image: '/Landing page1/assets/image 103.png',
        link: '#'
      }
    ];
  }
  if (sectionType === 'landing1-challenges' && fieldKey === 'challenges' && (!Array.isArray(value) || value.length === 0)) {
    normalizedValue = [
      {
        iconType: 'manual',
        title: 'Manual Operations',
        desc: 'Teams waste hours on repetitive data entry, reconciliations and spreadsheets that never agree.',
        solution: 'Solved by ESS ERP'
      }
    ];
  }
  if ((fieldKey === 'challengePoints' || fieldKey === 'challengepoints') && Array.isArray(value)) {
    normalizedValue = value.map(item => {
      if (typeof item === 'string') {
        return { title: item, description: '' };
      }
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const objItem = item as Record<string, any>;
        return {
          title: String(objItem.title || objItem.name || objItem.heading || ''),
          description: String(objItem.description || objItem.desc || objItem.paragraph || '')
        };
      }
      return { title: '', description: '' };
    });
  } else if (sectionType === 'bi-tabs' && fieldKey === 'tabs' && Array.isArray(value)) {
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
  } else if (sectionType === 'landing1-works' && fieldKey === 'works' && Array.isArray(value)) {
    normalizedValue = value.map(item => {
      if (typeof item === 'string') {
        return {
          image: '',
          category: '',
          title: item,
          date: '',
          link: ''
        };
      }
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return {
          image: '',
          category: '',
          title: '',
          date: '',
          link: '',
          ...item
        };
      }
      return { image: '', category: '', title: '', date: '', link: '' };
    });
  } else if (sectionType === 'landing1-testimonials' && fieldKey === 'testimonials' && Array.isArray(value)) {
    normalizedValue = value.map(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return {
          avatar: '',
          name: '',
          rating: 5,
          quote: '',
          ...item
        };
      }
      return item;
    });
  } else if (sectionType === 'landing1-challenges' && fieldKey === 'challenges' && Array.isArray(value)) {
    normalizedValue = value.map(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return {
          icon: '',
          title: '',
          desc: '',
          solution: 'Solved by ESS ERP',
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
                  sectionType={sectionType}
                />
              </div>
            );
          }
          if (fieldKey === 'paragraphs') {
            const itemFieldType = detectFieldType(fieldKey, String(item ?? ''), sectionType, keyPath);
            if (itemFieldType === 'textarea') {
              return (
                <div className="flex-1">
                  <TextareaField
                    fieldKey={`${fieldKey}-${_idx}`}
                    value={String(item ?? '')}
                    onChange={(v) => onItemChange(_idx, v)}
                  />
                </div>
              );
            }
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
              className="admin-input flex-1"
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
            let testimonialOrder = ['topic', 'industry', 'companyName', 'quote', 'authorAvatar', 'authorName', 'authorTitle'];
            if (sectionType === 'landing1-testimonials') {
              testimonialOrder = ['avatar', 'name', 'rating', 'quote'];
              if (!('rating' in objItem) || objItem.rating === undefined || objItem.rating === null) {
                objItem.rating = 5;
              }
              for (const k of testimonialOrder) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
            } else if (sectionType === 'landing2-testimonials') {
              // Standardize single media upload field for image or video
              if ('image' in objItem && !('mediaUrl' in objItem)) {
                objItem.mediaUrl = objItem.image || objItem.videoUrl || '';
              }
              testimonialOrder = ['mediaUrl', 'quote', 'role', 'author'];
              for (const k of testimonialOrder) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
            }
            sortedKeys = testimonialOrder.filter(k => k in objItem);
          } else if (fieldKey === 'cards') {
            let cardOrder = ['badge', 'icon', 'image', 'title', 'description', 'contact', 'badgeBorderColor', 'badgeTextColor', 'badgeBgColor'];
            if (sectionType === 'staffing-benefits') {
              cardOrder = ['image', 'title', 'description'];
              delete objItem.contact;
              for (const k of ['image', 'title', 'description']) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
            } else if (sectionType === 'ass-enterprise') {
              cardOrder = ['icon', 'title'];
              delete objItem.description;
              delete objItem.desc;
              delete objItem.contact;
              for (const k of ['icon', 'title']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'europe-feature-cards') {
              cardOrder = ['image', 'title', 'description'];
            } else if (sectionType === 'europe-product-showcase') {
              cardOrder = ['title', 'description'];
            } else if (sectionType === 'europe-reports') {
              cardOrder = ['image', 'title'];
            } else if (sectionType === 'uganda-services') {
              cardOrder = ['image', 'title', 'description', 'points', 'ctaText', 'ctaUrl', 'ctaFormType'];
              if (!('points' in objItem) || !Array.isArray(objItem.points)) {
                objItem.points = [];
              }
            } else if (sectionType === 'uganda-capabilities') {
              cardOrder = ['icon', 'title', 'description'];
            } else if (sectionType === 'uganda-industries') {
              cardOrder = ['image', 'title', 'description'];
            } else if (sectionType && sectionType.startsWith('fmcg-')) {
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
          } else if (fieldKey === 'challengePoints' || fieldKey === 'challengepoints') {
            const challengeOrder = ['title', 'description'];
            sortedKeys = challengeOrder.filter(k => k in objItem);
            if (sortedKeys.length === 0) sortedKeys = ['title', 'description'];
          } else if (fieldKey === 'sections' && 'items' in objItem) {
            const sectionOrder = ['title', 'items'];
            sortedKeys = sectionOrder;
          } else if (fieldKey === 'rows') {
            let rowOrder = ['featureName', 'standard', 'professional'];
            if ('col1Title' in objItem || 'col2Text' in objItem || 'col1Desc' in objItem) {
              rowOrder = ['col1Title', 'col1Desc', 'col2Text'];
              if (!('col1Desc' in objItem)) {
                objItem.col1Desc = '';
              }
            }
            sortedKeys = rowOrder;
            for (const k of rowOrder) {
              if (!(k in objItem)) {
                objItem[k] = '';
              }
            }
          } else if (fieldKey === 'modules') {
            let moduleOrder = ['image', 'name', 'title', 'desc', 'description', 'features', 'ctaLabel', 'ctaHoverBgColor', 'ctaHoverTextColor', 'ctaUrl', 'ctaFormType'];
            if (sectionType === 'retail-mobile-dashboard') {
              if (!Array.isArray(objItem.features)) {
                objItem.features = [];
              }
              moduleOrder = ['title', 'features'];
            } else if (sectionType === 'landing1-suite') {
              moduleOrder = ['name', 'desc', 'image'];
              for (const k of ['name', 'desc', 'image']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'erp-modules') {
              for (const k of ['ctaHoverBgColor', 'ctaHoverTextColor']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            }
            sortedKeys = moduleOrder.filter(k => k in objItem);
          } else if (fieldKey.toLowerCase().includes('items')) {
            let itemOrder = ['icon', 'text', 'title', 'description', 'image', 'ctaText', 'ctaUrl', 'enableCta'];
            if (sectionType === 'about-us-services-overview') {
              itemOrder = ['image', 'title', 'subtitle'];
              delete objItem.description;
              delete objItem.desc;
              for (const k of ['image', 'title', 'subtitle']) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
            } else if (sectionType === 'ass-functionalities') {
              itemOrder = ['icon', 'text'];
              if (!('icon' in objItem)) objItem.icon = '';
              if (!('text' in objItem) && ('title' in objItem)) objItem.text = objItem.title;
              if (!('text' in objItem)) objItem.text = '';
              delete objItem.description;
              delete objItem.desc;
              delete objItem.image;
              delete objItem.ctaText;
              delete objItem.ctaUrl;
            } else if (sectionType === 'ass-features-grid') {
              if (!('enableCta' in objItem)) {
                objItem.enableCta = true;
              }
            }
            if (sectionType === 'oracle-apex-approach') {
              itemOrder = ['image', 'title'];
            } else if (sectionType === 'staffing-technologies') {
              itemOrder = ['label'];
            } else if (sectionType === 'about-us-why-ess') {
              itemOrder = ['image', 'title', 'description'];
              if (!('image' in objItem)) {
                objItem.image = objItem.icon || objItem.iconUrl || '';
              }
            }
            sortedKeys = itemOrder.filter(k => k in objItem);
          } else if (fieldKey === 'steps') {
            const stepOrder = ['icon', 'image', 'title', 'description'];
            sortedKeys = stepOrder.filter(k => k in objItem);
          } else if (fieldKey === 'process') {
            const processOrder = ['icon', 'title', 'description'];
            for (const k of processOrder) {
              if (!(k in objItem)) {
                objItem[k] = '';
              }
            }
            sortedKeys = processOrder;
          } else if (fieldKey === 'works') {
            const worksOrder = ['image', 'category', 'title', 'date', 'link'];
            for (const k of worksOrder) {
              if (!(k in objItem)) {
                objItem[k] = '';
              }
            }
            sortedKeys = worksOrder;
          } else if (fieldKey === 'stats' || fieldKey === 'statistics') {
            let statOrder = ['icon', 'value', 'title'];
            if (sectionType === 'landing1-stats') {
              statOrder = ['icon', 'value', 'title'];
              delete objItem.description;
              delete objItem.desc;
              for (const k of statOrder) {
                if (!(k in objItem)) objItem[k] = '';
              }
            }
            sortedKeys = statOrder.filter(k => k in objItem);
          } else if (fieldKey === 'features') {
            let featureOrder = ['icon', 'iconType', 'image', 'title', 'desc', 'desc2', 'description'];
            if (sectionType === 'hospital-features') {
              featureOrder = ['label'];
            } else if (sectionType === 'erp-features') {
              featureOrder = ['id', 'image', 'title', 'desc', 'desc2'];
            } else if (sectionType === 'landing1-features') {
              featureOrder = ['icon', 'title', 'desc'];
              delete objItem.image;
              delete objItem.desc2;
              delete objItem.description;
              for (const k of ['icon', 'title', 'desc']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'landing2-why-ess') {
              featureOrder = ['icon', 'iconType', 'title', 'description'];
            }
            sortedKeys = featureOrder.filter(k => k in objItem);
            if (sectionType === 'landing2-why-ess') {
              for (const k of ['icon', 'title', 'description']) {
                if (!sortedKeys.includes(k) && !(k === 'icon' && 'iconType' in objItem)) {
                  sortedKeys.unshift(k);
                }
                if (!(k in objItem) && !(k === 'icon' && 'iconType' in objItem)) {
                  objItem[k] = '';
                }
              }
            }
          } else if (fieldKey === 'tabs') {
            let tabOrder = ['tabName', 'heading', 'subheading', 'questions', 'image'];
            if (sectionType === 'bi-tabs') {
              tabOrder = ['tabName', 'tabDesc', 'heading', 'subheading', 'questions', 'image'];
            } else if (sectionType === 'fmcg-use-cases') {
              tabOrder = ['tabName', 'tag', 'heading', 'points', 'buttonText', 'buttonHoverBgColor', 'buttonHoverTextColor', 'buttonUrl', 'image'];
              for (const k of ['buttonHoverBgColor', 'buttonHoverTextColor']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'aom-workspace') {
              tabOrder = ['label', 'desc', 'icon', 'contentTitle', 'contentDescription', 'contentImage', 'benefits', 'ctaText', 'ctaUrl'];
            } else if (sectionType === 'bi-industry-services') {
              tabOrder = ['tabName', 'tabTitle', 'points', 'buttonText', 'buttonHoverBgColor', 'buttonHoverTextColor', 'buttonUrl', 'image'];
              for (const k of ['buttonHoverBgColor', 'buttonHoverTextColor']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'oracle-apex-approach') {
              tabOrder = ['tabName', 'items'];
            } else if (sectionType === 'uganda-insights') {
              tabOrder = ['tabName', 'contentTitle', 'body1', 'body2', 'points', 'subsections', 'image'];
            } else if (sectionType === 'landing1-showcase') {
              tabOrder = ['name', 'title', 'desc', 'image', 'primaryCtaText', 'primaryCtaUrl', 'primaryCtaFormType', 'secondaryCtaText', 'secondaryCtaUrl', 'secondaryCtaFormType'];
              sortedKeys = tabOrder.filter(k => k in objItem);
              for (const k of ['name', 'title', 'desc', 'image', 'primaryCtaText', 'primaryCtaUrl', 'secondaryCtaText', 'secondaryCtaUrl']) {
                if (!sortedKeys.includes(k)) sortedKeys.push(k);
                if (!(k in objItem)) objItem[k] = '';
              }
            } else if (sectionType === 'mfg-icons') {
              tabOrder = ['label', 'iconImage', 'sections'];
            } else if (sectionType === 'landing2-capabilities') {
              if ('tabName' in objItem && !('name' in objItem)) {
                objItem.name = objItem.tabName;
              }
              tabOrder = ['name', 'image'];
            }
            sortedKeys = tabOrder.filter(k => k in objItem);
            if (sectionType === 'landing2-capabilities') {
              for (const k of ['name', 'image']) {
                if (!sortedKeys.includes(k)) sortedKeys.push(k);
                if (!(k in objItem)) objItem[k] = '';
              }
            }
          } else if (fieldKey === 'stats' || fieldKey === 'statistics') {
            let statOrder = ['number', 'value', 'label'];
            if (sectionType === 'landing1-stats') {
              statOrder = ['icon', 'value', 'title'];
            } else if (sectionType === 'uganda-presence') {
              statOrder = ['title', 'description'];
            } else if (sectionType === 'europe-case-study-slider') {
              statOrder = ['value', 'title'];
            }
            sortedKeys = statOrder.filter(k => k in objItem);
          } else if (fieldKey === 'employees') {
            let employeeOrder = ['name', 'subtitle', 'description', 'quote', 'image', 'nameColor', 'buttonHoverBgColor', 'buttonHoverTextColor', 'stats', 'pills'];
            if (sectionType === 'employee-spotlight-cards') {
              for (const k of ['buttonHoverBgColor', 'buttonHoverTextColor']) {
                if (!(k in objItem)) objItem[k] = '';
              }
            }
            sortedKeys = employeeOrder.filter(k => k in objItem);
          } else if (fieldKey === 'slides') {
            let slideOrder = ['image', 'logo', 'title', 'stats', 'ctaText', 'ctaUrl'];
            if (sectionType === 'landing2-carousel') {
              sortedKeys = ['badge', 'title', 'description', 'mediaUrl', 'videoUrl'];
              for (const k of sortedKeys) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
            } else {
              sortedKeys = slideOrder.filter(k => k in objItem);
            }
          } else if (fieldKey === 'solutions') {
            const solutionOrder = ['title', 'description'];
            sortedKeys = solutionOrder.filter(k => k in objItem);
          } else if (fieldKey === 'benefits') {
            const benefitOrder = ['image', 'title'];
            sortedKeys = benefitOrder.filter(k => k in objItem);
          } else if (fieldKey === 'challenges') {
            let challengeOrder = ['icon', 'title', 'desc', 'solution'];
            if (sectionType === 'landing1-challenges') {
              delete objItem.iconType;
              for (const k of ['icon', 'title', 'desc', 'solution']) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
              sortedKeys = ['icon', 'title', 'desc', 'solution'];
            } else {
              sortedKeys = challengeOrder.filter(k => k in objItem);
            }
          } else if (fieldKey === 'points') {
            let pointsOrder = ['title', 'description'];
            if (sectionType === 'hospital-regulatory') {
              pointsOrder = ['label'];
            }
            sortedKeys = pointsOrder.filter(k => k in objItem);
          } else if (fieldKey === 'specs' || fieldKey === 'pills') {
            let specsOrder = ['label', 'text', 'title'];
            sortedKeys = specsOrder.filter(k => k in objItem);
            if (sortedKeys.length === 0) sortedKeys = ['label'];
          } else if (fieldKey === 'columns') {
            let columnOrder = ['iconImage', 'icon', 'title', 'items'];
            sortedKeys = columnOrder.filter(k => k in objItem);
            for (const k of ['iconImage', 'title', 'items']) {
              if (!sortedKeys.includes(k) && !(k === 'iconImage' && 'icon' in objItem)) {
                sortedKeys.push(k);
              }
              if (!(k in objItem) && !(k === 'iconImage' && 'icon' in objItem)) {
                objItem[k] = k === 'items' ? [] : '';
              }
            }
          } else if (fieldKey === 'industries') {
            if (sectionType === 'landing2-industries') {
              for (const k of ['name', 'image']) {
                if (!(k in objItem)) {
                  objItem[k] = '';
                }
              }
              const industryOrder = ['name', 'image', 'href'];
              sortedKeys = industryOrder.filter(k => k in objItem);
            } else if (sectionType === 'rpa-industries') {
              const industryOrder = ['icon', 'title', 'description'];
              sortedKeys = industryOrder.filter(k => k in objItem);
            }
          } else if (fieldKey === 'categories') {
            let categoryOrder = ['name', 'items'];
            sortedKeys = categoryOrder.filter(k => k in objItem);
            for (const k of Object.keys(objItem)) {
              if (sectionType === 'ass-features-grid' && (k === 'image' || k === 'title' || k.toLowerCase().includes('tab'))) {
                continue;
              }
              if (!sortedKeys.includes(k)) {
                sortedKeys.push(k);
              }
            }
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
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
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

const DEFAULT_TOPIC_OPTIONS = [
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
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [options, setOptions] = React.useState<string[]>(DEFAULT_TOPIC_OPTIONS);

  React.useEffect(() => {
    async function fetchDynamicTopics() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          const configured = Array.isArray(data?.configuredTopics) && data.configuredTopics.length > 0
            ? data.configuredTopics
            : DEFAULT_TOPIC_OPTIONS;
          setOptions(Array.from(new Set(configured)));
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    fetchDynamicTopics();
  }, []);

  return (
    <div className="space-y-1.5 flex-1 min-w-[200px]">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      >
        <option value="">Select a topic...</option>
        {options.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

const DEFAULT_INDUSTRY_OPTIONS = [
  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics',
  'Automotive',
  'Healthcare',
  'Logistics & Supply Chain',
  'Chemicals',
  'Textiles',
  'Construction & Real Estate',
  'Food & Beverages',
  'Agriculture',
  'Energy & Utilities',
  'Financial Services'
];

function IndustrySelectField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [options, setOptions] = React.useState<string[]>(DEFAULT_INDUSTRY_OPTIONS);

  React.useEffect(() => {
    async function fetchDynamicIndustries() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          const configured = Array.isArray(data?.configuredIndustries) && data.configuredIndustries.length > 0
            ? data.configuredIndustries
            : DEFAULT_INDUSTRY_OPTIONS;
          setOptions(Array.from(new Set(configured)));
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    fetchDynamicIndustries();
  }, []);

  return (
    <div className="space-y-1.5 flex-1 min-w-[200px]">
      <label className="admin-label">{label || humanLabel(fieldKey)}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      >
        <option value="">Select an industry...</option>
        {options.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
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
        <label className="admin-label font-bold text-slate-900">Selected Pages ({selectedItems.length}/6)</label>
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
                <label className="admin-label mb-1 block">Change Page</label>
                <select
                  value={item.ctaUrl || ''}
                  onChange={(e) => {
                    const selectedPath = e.target.value;
                    const selectedPage = megaMenuPages.find(p => p.routePath === selectedPath);
                    if (selectedPage) replaceItem(idx, selectedPage);
                  }}
                  className="admin-input"
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
          <label className="admin-label block mb-2">Add New Page</label>
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

function ContentSegmentsEditor({
  keyPath,
  value,
  onChange,
}: {
  keyPath: string;
  value: any[];
  onChange: (newVal: any[]) => void;
}) {
  const contentSegments = Array.isArray(value) ? value : [];

  const addSegment = (type: string) => {
    const copy = [...contentSegments];
    if (type === 'key-takeaways') {
      copy.push({
        type: 'key-takeaways',
        id: `takeaways-${Date.now()}`,
        tocTitle: 'Key takeaways',
        title: 'Key takeaways:',
        points: [''],
        descriptions: ['']
      });
    } else if (type === 'items') {
      copy.push({
        type: 'items',
        id: `items-${Date.now()}`,
        tocTitle: 'New Items Section',
        items: [{ title: 'Item Title', image: '', descriptions: [''] }]
      });
    } else if (type === 'cards') {
      copy.push({
        type: 'cards',
        id: `cards-${Date.now()}`,
        tocTitle: 'Cards Section',
        cards: [{ title: 'Card Title', description: '' }]
      });
    } else if (type === 'table') {
      copy.push({
        type: 'table',
        id: `table-${Date.now()}`,
        tocTitle: 'Table Section',
        column1Title: 'Column 1 Title',
        column2Title: 'Column 2 Title',
        rows: [{ col1Title: 'Item', col2Text: 'Matched Value' }]
      });
    }
    onChange(copy);
  };

  const removeSegment = (sIdx: number) => {
    const copy = contentSegments.filter((_, idx) => idx !== sIdx);
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="admin-label">Dynamic Content Segments</label>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => addSegment('key-takeaways')}
            className="px-2.5 py-1 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium cursor-pointer border border-purple-200"
          >
            + Key Takeaways
          </button>
          <button
            type="button"
            onClick={() => addSegment('items')}
            className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium cursor-pointer border border-blue-200"
          >
            + Items Section
          </button>
          <button
            type="button"
            onClick={() => addSegment('cards')}
            className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium cursor-pointer border border-emerald-200"
          >
            + Cards
          </button>
          <button
            type="button"
            onClick={() => addSegment('table')}
            className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium cursor-pointer border border-amber-200"
          >
            + Table
          </button>
        </div>
      </div>

      {contentSegments.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
          No content segments added yet. Click an option above to add segment blocks.
        </div>
      ) : (
        <div className="space-y-4">
          {contentSegments.map((seg: any, sIdx: number) => (
            <div key={sIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {seg.type === 'key-takeaways' && 'Key Takeaways Segment'}
                  {seg.type === 'items' && 'Items Section Segment'}
                  {seg.type === 'cards' && 'Cards Segment'}
                  {seg.type === 'table' && 'Table Segment'}
                </span>
                <button
                  type="button"
                  onClick={() => removeSegment(sIdx)}
                  className="text-rose-600 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                >
                  Remove Segment
                </button>
              </div>

              <div className="space-y-1">
                <label className="admin-label">Sidebar Tab Title (For Auto-scroll TOC)</label>
                <input
                  type="text"
                  value={seg.tocTitle || ''}
                  onChange={(e) => {
                    const copy = [...contentSegments];
                    copy[sIdx].tocTitle = e.target.value;
                    onChange(copy);
                  }}
                  placeholder="e.g. Key takeaways"
                  className="admin-input"
                />
              </div>

              {/* 1. Key Takeaways */}
              {seg.type === 'key-takeaways' && (
                <div className="space-y-4 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="admin-label">Segment Title</label>
                    <input
                      type="text"
                      value={seg.title || ''}
                      onChange={(e) => {
                        const copy = [...contentSegments];
                        copy[sIdx].title = e.target.value;
                        onChange(copy);
                      }}
                      className="admin-input font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="admin-label">Points List</label>
                    {seg.points?.map((pText: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pText}
                          onChange={(e) => {
                            const copy = [...contentSegments];
                            copy[sIdx].points[pIdx] = e.target.value;
                            onChange(copy);
                          }}
                          className="admin-input flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...contentSegments];
                            copy[sIdx].points = copy[sIdx].points.filter((_: any, i: number) => i !== pIdx);
                            onChange(copy);
                          }}
                          className="text-xs text-rose-500 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...contentSegments];
                        copy[sIdx].points = [...(copy[sIdx].points || []), ''];
                        onChange(copy);
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                    >
                      + Add Point
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="admin-label">Descriptions List</label>
                    {seg.descriptions?.map((dText: string, dIdx: number) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={dText}
                          onChange={(e) => {
                            const copy = [...contentSegments];
                            copy[sIdx].descriptions[dIdx] = e.target.value;
                            onChange(copy);
                          }}
                          className="admin-input flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...contentSegments];
                            copy[sIdx].descriptions = copy[sIdx].descriptions.filter((_: any, i: number) => i !== dIdx);
                            onChange(copy);
                          }}
                          className="text-xs text-rose-500 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...contentSegments];
                        copy[sIdx].descriptions = [...(copy[sIdx].descriptions || []), ''];
                        onChange(copy);
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                    >
                      + Add Description
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Items */}
              {seg.type === 'items' && (
                <div className="space-y-4 bg-white p-3 rounded-xl border border-slate-200">
                  {seg.items?.map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="p-3 border border-slate-100 rounded-lg space-y-3 bg-slate-50/50">
                      <div className="space-y-1">
                        <RichTextField
                          fieldKey={`item-title-${itemIdx}`}
                          label="Item Title"
                          value={item.title || ''}
                          onChange={(v) => {
                            const copy = [...contentSegments];
                            copy[sIdx].items[itemIdx].title = v;
                            onChange(copy);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="admin-label">Item Image Upload</label>
                        <MediaField
                          fieldKey={`item-image-${itemIdx}`}
                          value={item.image || ''}
                          onChange={(v) => {
                            const copy = [...contentSegments];
                            copy[sIdx].items[itemIdx].image = v;
                            onChange(copy);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="admin-label">Item Descriptions</label>
                        {item.descriptions?.map((dText: string, dIdx: number) => (
                          <div key={dIdx} className="space-y-1">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <RichTextField
                                  fieldKey={`item-desc-${itemIdx}-${dIdx}`}
                                  label={`Description ${dIdx + 1}`}
                                  value={dText || ''}
                                  onChange={(v) => {
                                    const copy = [...contentSegments];
                                    copy[sIdx].items[itemIdx].descriptions[dIdx] = v;
                                    onChange(copy);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...contentSegments];
                                  copy[sIdx].items[itemIdx].descriptions = copy[sIdx].items[itemIdx].descriptions.filter((_: any, i: number) => i !== dIdx);
                                  onChange(copy);
                                }}
                                className="text-xs text-rose-500 font-bold px-1 mt-7 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...contentSegments];
                            copy[sIdx].items[itemIdx].descriptions = [...(copy[sIdx].items[itemIdx].descriptions || []), ''];
                            onChange(copy);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          + Add Description
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...contentSegments];
                      copy[sIdx].items = [...(copy[sIdx].items || []), { title: 'New Item', image: '', descriptions: [''] }];
                      onChange(copy);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer border border-blue-200 bg-blue-50/50 py-1.5 px-3 rounded-lg w-full"
                  >
                    + Add Item
                  </button>
                </div>
              )}

              {/* 3. Cards */}
              {seg.type === 'cards' && (
                <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                  {seg.cards?.map((card: any, cIdx: number) => (
                    <div key={cIdx} className="p-3 border border-slate-100 rounded-lg space-y-2 bg-slate-50/50">
                      <div className="space-y-1">
                        <label className="admin-label">Card Title</label>
                        <input
                          type="text"
                          value={card.title || ''}
                          onChange={(e) => {
                            const copy = [...contentSegments];
                            copy[sIdx].cards[cIdx].title = e.target.value;
                            onChange(copy);
                          }}
                          className="admin-input font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="admin-label">Description (200 Char Limit)</label>
                          <span className={cn('text-[10px] font-mono', (card.description?.length || 0) > 200 ? 'text-rose-600 font-bold' : 'text-slate-400')}>
                            {card.description?.length || 0}/200
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={200}
                          value={card.description || ''}
                          onChange={(e) => {
                            const copy = [...contentSegments];
                            copy[sIdx].cards[cIdx].description = e.target.value.slice(0, 200);
                            onChange(copy);
                          }}
                          className="admin-input text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...contentSegments];
                      copy[sIdx].cards = [...(copy[sIdx].cards || []), { title: 'New Card', description: 'Short desc max 200 chars' }];
                      onChange(copy);
                    }}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer border border-emerald-200 bg-emerald-50/50 py-1.5 px-3 rounded-lg w-full"
                  >
                    + Add Card
                  </button>
                </div>
              )}

              {/* 4. Table */}
              {seg.type === 'table' && (
                <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="admin-label">Column 1 Title</label>
                      <input
                        type="text"
                        value={seg.column1Title || ''}
                        onChange={(e) => {
                          const copy = [...contentSegments];
                          copy[sIdx].column1Title = e.target.value;
                          onChange(copy);
                        }}
                        className="admin-input font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="admin-label">Column 2 Title</label>
                      <input
                        type="text"
                        value={seg.column2Title || ''}
                        onChange={(e) => {
                          const copy = [...contentSegments];
                          copy[sIdx].column2Title = e.target.value;
                          onChange(copy);
                        }}
                        className="admin-input font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {seg.rows?.map((row: any, rIdx: number) => (
                      <div key={rIdx} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                        <div className="grid grid-cols-2 gap-2 items-center">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 1 Title</label>
                            <input
                              type="text"
                              placeholder="Column 1 Title"
                              value={row.col1Title || ''}
                              onChange={(e) => {
                                const copy = [...contentSegments];
                                copy[sIdx].rows[rIdx].col1Title = e.target.value;
                                onChange(copy);
                              }}
                              className="admin-input text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 2 Text</label>
                            <input
                              type="text"
                              placeholder="Column 2 Value"
                              value={row.col2Text || ''}
                              onChange={(e) => {
                                const copy = [...contentSegments];
                                copy[sIdx].rows[rIdx].col2Text = e.target.value;
                                onChange(copy);
                              }}
                              className="admin-input text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Col 1 Description (Optional)</label>
                          <textarea
                            rows={2}
                            placeholder="Enter Column 1 description..."
                            value={row.col1Desc || ''}
                            onChange={(e) => {
                              const copy = [...contentSegments];
                              copy[sIdx].rows[rIdx].col1Desc = e.target.value;
                              onChange(copy);
                            }}
                            className="admin-input text-xs w-full resize-y"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...contentSegments];
                        copy[sIdx].rows = [...(copy[sIdx].rows || []), { col1Title: 'Item', col1Desc: '', col2Text: 'Matched Value' }];
                        onChange(copy);
                      }}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer border border-amber-200 bg-amber-50/50 py-1.5 px-3 rounded-lg w-full"
                    >
                      + Add Table Row
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface WordHighlightSelectorProps {
  fieldKey: string;
  label: string;
  value: JsonValue;
  onChange: (v: JsonValue) => void;
  sectionType?: string;
  allSectionValues?: Record<string, JsonValue>;
}

function WordHighlightSelector({ label, value, onChange, allSectionValues }: WordHighlightSelectorProps) {
  const getDirectTitle = () => {
    if (allSectionValues) {
      if (typeof allSectionValues.heading === 'string' && allSectionValues.heading.trim()) return allSectionValues.heading;
      if (typeof allSectionValues.titleText === 'string' && allSectionValues.titleText.trim()) return allSectionValues.titleText;
      if (typeof allSectionValues.title === 'string' && allSectionValues.title.trim()) return allSectionValues.title;
      if (typeof allSectionValues.title_text === 'string' && allSectionValues.title_text.trim()) return allSectionValues.title_text;
    }
    return '';
  };

  const [domTitle, setDomTitle] = React.useState<string>('');

  React.useEffect(() => {
    const handleCheck = () => {
      if (typeof window === 'undefined') return;
      const inputs = Array.from(document.querySelectorAll('input, textarea'));
      const titleInput = (inputs.find(i => {
        const name = (i.getAttribute('name') || '').toLowerCase();
        const placeholder = (i.getAttribute('placeholder') || '').toLowerCase();
        const id = (i.getAttribute('id') || '').toLowerCase();
        return name.includes('title') || placeholder.includes('title') || id.includes('title');
      }) || inputs.find(i => (i as HTMLInputElement).value?.includes('Streamline'))) as HTMLInputElement | HTMLTextAreaElement | undefined;
      
      if (titleInput && titleInput.value) {
        setDomTitle(titleInput.value);
      }
    };

    handleCheck();
    window.addEventListener('input', handleCheck);
    window.addEventListener('keyup', handleCheck);
    window.addEventListener('change', handleCheck);
    const timer = setInterval(handleCheck, 500);

    return () => {
      window.removeEventListener('input', handleCheck);
      window.removeEventListener('keyup', handleCheck);
      window.removeEventListener('change', handleCheck);
      clearInterval(timer);
    };
  }, []);

  const titleText = getDirectTitle() || domTitle || "It's all about Streamline, Automate, and Accelerate for Business Fitness";

  const selectedIndices: number[] = Array.isArray(value)
    ? (value as number[])
    : [3, 4, 6];

  const words = titleText.split(/\s+/).filter(Boolean);

  const toggleWord = (idx: number) => {
    let next: number[];
    if (selectedIndices.includes(idx)) {
      next = selectedIndices.filter((i) => i !== idx);
    } else {
      next = [...selectedIndices, idx].sort((a, b) => a - b);
    }
    onChange(next);
  };

  const selectAll = () => {
    onChange(words.map((_, i) => i));
  };

  const clearAll = () => {
    onChange([]);
  };

  const resetDefault = () => {
    onChange([3, 4, 6]);
  };

  return (
    <div className="space-y-3 p-4 border border-purple-200 bg-purple-50/40 rounded-xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <span>{label}</span>
          <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
            Total Words: {words.length}
          </span>
        </label>
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={resetDefault}
            className="text-purple-600 hover:underline px-1.5 py-0.5 rounded bg-purple-100/60 hover:bg-purple-100"
          >
            Default (4, 5, 7)
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="text-slate-600 hover:underline px-1.5 py-0.5 rounded bg-slate-200/60 hover:bg-slate-200"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-red-600 hover:underline px-1.5 py-0.5 rounded bg-red-100/60 hover:bg-red-100"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">
        Click on any word below to toggle applying the Secondary Title Color to it:
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {words.length === 0 ? (
          <span className="text-xs text-slate-400 italic">Enter a Title above to select words</span>
        ) : (
          words.map((word, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleWord(idx)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5',
                  isSelected
                    ? 'bg-[#462294] text-white border-[#462294] shadow-sm font-semibold scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                )}
              >
                <span className={cn('text-[10px] opacity-75', isSelected ? 'text-purple-200' : 'text-slate-400')}>
                  #{idx + 1}
                </span>
                <span>{word}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

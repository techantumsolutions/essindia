'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSectionDefinition } from '@/lib/cms/section-registry';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { mergeSchemaWithContent } from './field-utils';
import type { JsonValue } from './field-utils';

export interface PageSection {
  id: string;
  type: string;
  variant: string | null;
  name: string | null;
  content: Record<string, unknown>;
  orderIndex: number;
  isActive: boolean;
}

const BLOG_DETAIL_TABS: Record<string, string[]> = {
  basic: ['title', 'category', 'authorName', 'authorAvatar', 'date', 'image', 'description', 'contentHtml'],
  hero: ['badgeText', 'headingText', 'subheadingText', 'bgImage'],
  highlights: ['highlights', 'conclusionHtml']
};

const TESTIMONIALS_TABS: Record<string, string[]> = {
  hero: ['badgeText', 'headingText', 'subheadingText', 'bgImage'],
  testimonials: ['testimonials']
};

const CASE_STUDY_DETAIL_TABS: Record<string, string[]> = {
  hero: ['topic', 'description', 'image'],
  overview: ['overview', 'overviewImages'],
  challenge: ['challengeHtml', 'challengeTitle', 'challengeDescription', 'challengeImage', 'challengePoints'],
  ess: ['solutionsTitle', 'solutionsDescription', 'solutionModules'],
  results: ['resultsHtml', 'resultsTitle', 'resultsItems']
};

const DEFAULT_CASE_STUDY_CONTENT: Record<string, any> = {
  title: '',
  topic: '',
  industry: '',
  date: '',
  description: '',
  image: '',
  challengeImage: '',
  overview: '',
  overviewImages: [''],
  challengeHtml: '',
  challengeTitle: '',
  challengeDescription: '',
  challengePoints: [{ title: '', description: '' }],
  solutionsTitle: '',
  solutionsDescription: '',
  solutionModules: [{ name: '', description: '', icon: '' }],
  resultsHtml: '',
  resultsTitle: '',
  resultsItems: ['']
};

const DEFAULT_BLOG_CONTENT: Record<string, any> = {
  title: '',
  category: '',
  authorName: '',
  authorAvatar: '',
  date: '',
  image: '',
  description: '',
  contentHtml: '',
  badgeText: '',
  headingText: '',
  subheadingText: '',
  bgImage: '',
  highlights: [{ title: '', content: '', icon: '' }],
  conclusionHtml: ''
};

const DEFAULT_TESTIMONIALS_CONTENT: Record<string, any> = {
  badgeText: '',
  headingText: '',
  subheadingText: '',
  bgImage: '',
  testimonials: [{ quote: '', author: '', role: '', company: '', image: '', rating: 5 }]
};

interface SectionEditorCardProps {
  section: PageSection;
  schema?: Record<string, unknown> | null;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onContentChange: (sectionId: string, keyPath: string, value: JsonValue) => void;
  onSave: (section: PageSection) => Promise<void>;
  onDelete: (sectionId: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  isSectionDirty: boolean;
}

export function SectionEditorCard({
  section,
  schema,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onContentChange,
  onSave,
  onDelete,
  onMove,
  isSectionDirty,
}: SectionEditorCardProps) {
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('basic');
  const meta = getSectionDefinition(section.type);

  const mergedContent = React.useMemo(() => {
    let baseSchema = schema as Record<string, JsonValue> | undefined;
    
    // Inject defaults if schema is missing or empty
    if (!baseSchema || Object.keys(baseSchema).length === 0) {
      if (section.type === 'case-study-detail') {
        baseSchema = DEFAULT_CASE_STUDY_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'blog-detail-block') {
        baseSchema = DEFAULT_BLOG_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'testimonials-block') {
        baseSchema = DEFAULT_TESTIMONIALS_CONTENT as Record<string, JsonValue>;
      }
    }

    return mergeSchemaWithContent(
      baseSchema,
      section.content as Record<string, JsonValue>
    );
  }, [schema, section.content, section.type]);

  const contentKeys = React.useMemo(() => {
    const keys = Object.keys(mergedContent);
    if (meta?.fieldOrder) {
      return keys.sort((a, b) => {
        const indexA = meta.fieldOrder!.indexOf(a);
        const indexB = meta.fieldOrder!.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }
    return keys;
  }, [mergedContent, meta]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(section);
    } finally {
      setSaving(false);
    }
  };

  const sectionPreview = getSectionPreview(section.content);

  return (
    <motion.div
      layout
      className={cn(
        'bg-white rounded-2xl border overflow-hidden shadow-sm transition-shadow',
        isExpanded ? 'border-[#4B2A63]/20 shadow-md' : 'border-slate-100',
        isSectionDirty && 'ring-2 ring-amber-200'
      )}
    >
      <div className="flex items-center gap-3 p-4 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <span
            className={cn(
              'text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shrink-0',
              meta?.color || 'bg-slate-100 text-slate-500'
            )}
          >
            {meta?.label || section.type}
          </span>
          {section.variant && section.variant !== 'default' && (
            <span className="text-[10px] font-bold text-[#4B2A63] bg-[#4B2A63]/5 px-2 py-0.5 rounded-md shrink-0">
              {section.variant}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-slate-900 truncate text-sm block">
              {section.name || section.type}
            </span>
            {sectionPreview && !isExpanded && (
              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                {sectionPreview}
              </span>
            )}
          </div>
          {isSectionDirty && (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 border border-amber-200">
              Modified
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          )}
        </button>
        <div className="flex gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-4">
              {contentKeys.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">
                    No content fields for this section.
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    This section may use default content from the template.
                  </p>
                </div>
              ) : section.type === 'blog-detail-block' || section.type === 'testimonials-block' || section.type === 'case-study-detail' ? (
                <div className="space-y-4">
                  {/* Tabs Navigation */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 rounded-t-xl shrink-0 -mx-5 -mt-5 px-3">
                    {(() => {
                      const tabs = section.type === 'testimonials-block' 
                        ? [
                            { id: 'hero', label: 'Hero Banner' },
                            { id: 'testimonials', label: 'Testimonials' },
                          ]
                        : section.type === 'case-study-detail'
                        ? [
                            { id: 'hero', label: 'Hero Section' },
                            { id: 'overview', label: 'Overview' },
                            { id: 'challenge', label: 'Challenge' },
                            { id: 'ess', label: 'ESS' },
                            { id: 'results', label: 'Results' },
                          ]
                        : [
                            { id: 'basic', label: 'Basic Info' },
                            { id: 'hero', label: 'Hero Banner' },
                            { id: 'highlights', label: 'Highlights & Conclusion' },
                          ];
                      // Fallback tab if currently activeTab is not valid for the switch
                      const tabsMap = section.type === 'testimonials-block' 
                        ? TESTIMONIALS_TABS 
                        : section.type === 'case-study-detail'
                        ? CASE_STUDY_DETAIL_TABS
                        : BLOG_DETAIL_TABS;
                      
                      const validTab = tabsMap[activeTab] 
                        ? activeTab 
                        : (section.type === 'testimonials-block' || section.type === 'case-study-detail' ? 'hero' : 'basic');
                      
                      return tabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                            validTab === tab.id
                              ? 'border-[#4B2A63] text-[#4B2A63] border-b-[#4B2A63]'
                              : 'border-transparent text-slate-400 hover:text-slate-600'
                          )}
                        >
                          {tab.label}
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Tab Content Fields */}
                  <div className="space-y-4 pt-2">
                    {(() => {
                      const tabsMap = section.type === 'testimonials-block' 
                        ? TESTIMONIALS_TABS 
                        : section.type === 'case-study-detail'
                        ? CASE_STUDY_DETAIL_TABS
                        : BLOG_DETAIL_TABS;
                      
                      const activeKeys = tabsMap[activeTab] || (section.type === 'testimonials-block' || section.type === 'case-study-detail' ? tabsMap.hero : tabsMap.basic);
                      return activeKeys.map((key) => {
                        if (!contentKeys.includes(key)) return null;
                        return (
                          <DynamicFieldRenderer
                            key={key}
                            keyPath={key}
                            fieldKey={key}
                            value={mergedContent[key] as JsonValue}
                            onChange={(kp, val) => onContentChange(section.id, kp, val)}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                contentKeys.map((key) => (
                  <DynamicFieldRenderer
                    key={key}
                    keyPath={key}
                    fieldKey={key}
                    value={mergedContent[key] as JsonValue}
                    onChange={(kp, val) => onContentChange(section.id, kp, val)}
                  />
                ))
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {section.isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <Eye className="w-3 h-3" /> Visible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !isSectionDirty}
                  className="bg-[#4B2A63] text-white rounded-full gap-1.5 px-5"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saving ? 'Saving…' : 'Save Section'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function getSectionPreview(content: Record<string, unknown>): string | null {
  const keys = ['title', 'heading', 'badge', 'name', 'label', 'sectionTitle'];
  for (const k of keys) {
    const val = content[k];
    if (typeof val === 'string' && val.trim()) return val.slice(0, 60);
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (typeof inner.title === 'string') return inner.title.slice(0, 60);
      if (typeof inner.text === 'string') return inner.text.slice(0, 60);
    }
  }
  return null;
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { humanLabel, createEmptyFromTemplate } from './field-utils';
import type { JsonValue } from './field-utils';

interface ArrayFieldEditorProps {
  fieldKey: string;
  value: JsonValue[];
  onChange: (value: JsonValue[]) => void;
  renderItem: (
    item: JsonValue,
    index: number,
    onItemChange: (index: number, newValue: JsonValue) => void,
    keyPathPrefix: string
  ) => React.ReactNode;
  keyPathPrefix: string;
  sectionType?: string;
}

export function ArrayFieldEditor({
  fieldKey,
  value,
  onChange,
  renderItem,
  keyPathPrefix,
  sectionType,
}: ArrayFieldEditorProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [collapsedItems, setCollapsedItems] = React.useState<Set<number>>(new Set());

  const updateItem = (index: number, newVal: JsonValue) => {
    const copy = [...value];
    copy[index] = newVal;
    onChange(copy);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setCollapsedItems((prev) => {
      const next = new Set<number>();
      for (const i of prev) {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      }
      return next;
    });
  };

  const duplicateItem = (index: number) => {
    const copy = [...value];
    copy.splice(index + 1, 0, structuredClone(value[index]));
    onChange(copy);
  };

  const addItem = () => {
    if (value.length > 0) {
      const template = createEmptyFromTemplate(value[0]);
      onChange([...value, template]);
    } else {
      // Fallback schemas based on typical field keys when array is empty
      let defaultObj: any = '';
      const lowerKey = fieldKey.toLowerCase();
      
      if (lowerKey === 'features' || lowerKey === 'tabs') {
        defaultObj = { 
          label: '', 
          desc: '', 
          icon: '', 
          contentTitle: '', 
          contentDescription: '', 
          contentImage: '', 
          benefits: [], 
          ctaText: 'Get started', 
          ctaUrl: '#',
          image: '', 
          title: '', 
          desc2: '',
          tabName: '',
          heading: '',
          subheading: '',
          questions: [],
          tag: '',
          points: [],
          buttonText: 'Case Studies',
          buttonUrl: '/case-studies'
        };
      } else if (lowerKey === 'modules') {
        defaultObj = { image: '', title: '', description: '', ctaLabel: 'READ MORE', ctaUrl: '#' };
      } else if (lowerKey === 'values') {
        defaultObj = { image: '', title: '', description: '' };
      } else if (lowerKey === 'faqs') {
        defaultObj = { quotation: '', question: '', answer: '', arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png' };
      } else if (lowerKey === 'locations') {
        defaultObj = { city: '', address: '', name: '', phone: '', email: '' };
      } else if (lowerKey === 'processes') {
        defaultObj = { title: '', description: '' };
      } else if (lowerKey === 'cards') {
        if (sectionType === 'fmcg-action') {
          defaultObj = { badge: '', image: '', title: '', description: '', badgeBorderColor: '', badgeTextColor: '', badgeBgColor: '' };
        } else if (sectionType === 'fmcg-impact' || sectionType === 'fmcg-integrations') {
          defaultObj = { image: '', title: '' };
        } else if (sectionType === 'fmcg-challenges' || sectionType === 'fmcg-empower') {
          defaultObj = { icon: '', title: '', description: '' };
        } else {
          defaultObj = { icon: '', title: '', description: '', contact: '' };
        }
      } else if (lowerKey === 'categories') {
        defaultObj = { name: '', items: [], tabs: [] };
      } else if (lowerKey === 'items') {
        defaultObj = { image: '', title: '', description: '', ctaText: '', ctaUrl: '' };
      } else if (lowerKey.includes('items')) {
        defaultObj = { icon: '', image: '', title: '', description: '', text: '' };
      } else if (lowerKey === 'sections') {
        defaultObj = { title: '', items: [''] };
      } else if (lowerKey === 'stats') {
        defaultObj = { value: '', label: '' };
      } else if (['blocks', 'steps'].includes(lowerKey)) {
        defaultObj = { image: '', title: '', description: '' };
      } else if (lowerKey === 'points') {
        defaultObj = '';
      }
      
      onChange([...value, defaultObj]);
    }
  };

  const moveItem = (from: number, direction: 'up' | 'down') => {
    const to = direction === 'up' ? from - 1 : from + 1;
    if (to < 0 || to >= value.length) return;
    const copy = [...value];
    [copy[from], copy[to]] = [copy[to], copy[from]];
    onChange(copy);
  };

  const toggleItemCollapse = (index: number) => {
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isPrimitive = value.length > 0 && typeof value[0] !== 'object';
  const singularLabel = humanLabel(fieldKey).replace(/s$/i, '');
  const isLocked = (sectionType === 'bi-highlight-strip') || 
                   (sectionType === 'bi-business-impact') ||
                   (sectionType === 'rpa-overview' && fieldKey === 'cards') ||
                   (sectionType === 'rpa-benefits' && fieldKey === 'benefits') ||
                   (sectionType === 'rpa-capabilities' && fieldKey === 'items');

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        {collapsed ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          {humanLabel(fieldKey)}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
          {value.length} {value.length === 1 ? 'item' : 'items'}
        </span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-4 pb-4 space-y-2">
              {value.map((item, idx) => {
                if (isPrimitive) {
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-6 text-right">{idx + 1}</span>
                      {renderItem(item, idx, updateItem, `${keyPathPrefix}[${idx}]`)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                }

                const isItemCollapsed = collapsedItems.has(idx);
                const itemTitle = getItemPreviewTitle(item, idx);

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 border-b border-slate-100">
                      <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" />
                      <button
                        type="button"
                        onClick={() => toggleItemCollapse(idx)}
                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                      >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {itemTitle}
                        </span>
                        {isItemCollapsed ? (
                          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" />
                        )}
                      </button>
                      <div className="flex gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === value.length - 1}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </Button>
                        {!isLocked && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400"
                              onClick={() => duplicateItem(idx)}
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => removeItem(idx)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {!isItemCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="p-4 space-y-3"
                        >
                          {renderItem(item, idx, updateItem, `${keyPathPrefix}[${idx}]`)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {!isLocked && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 mt-2 border-dashed"
                  onClick={addItem}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add {singularLabel}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getItemPreviewTitle(item: JsonValue, index: number): string {
  if (typeof item === 'string') return item.slice(0, 40) || `Item ${index + 1}`;
  if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
    const obj = item as Record<string, JsonValue>;
    const titleField = obj.title || obj.name || obj.label || obj.heading || obj.question || obj.text || obj.tabName;
    if (typeof titleField === 'string' && titleField.trim()) return titleField.slice(0, 50);
    for (const val of Object.values(obj)) {
      if (typeof val === 'string' && val.trim() && val.length > 2 && val.length < 60) {
        return val;
      }
    }
  }
  return `Item ${index + 1}`;
}

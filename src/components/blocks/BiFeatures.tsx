'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface BiFeatureRow {
  featureName?: string;
  standard?: 'yes' | 'no' | boolean | string;
  professional?: 'yes' | 'no' | boolean | string;
}

export interface BiFeaturesContent {
  sectionTitle?: string;
  sectionTitleColor?: string;
  column1Title?: string;
  column2Title?: string;
  column3Title?: string;
  rows?: BiFeatureRow[];
}

const DEFAULT_ROWS: BiFeatureRow[] = [
  { featureName: 'Interactive dashboards', standard: 'no', professional: 'yes' },
  { featureName: 'Real-time data visualization', standard: 'no', professional: 'yes' },
  { featureName: 'Drag & drop report builder', standard: 'no', professional: 'yes' },
  { featureName: 'Pre-built BI reports & KPIs', standard: 'yes', professional: 'yes' },
  { featureName: 'Ad-hoc reporting', standard: 'yes', professional: 'yes' },
  { featureName: 'Data drill-down & filtering', standard: 'yes', professional: 'yes' },
  { featureName: 'Multi-source data integration', standard: 'no', professional: 'yes' },
  { featureName: 'Advanced analytics & forecasting', standard: 'no', professional: 'yes' },
  { featureName: 'Custom metrics & calculated fields', standard: 'no', professional: 'yes' },
  { featureName: 'Scheduled reports & email delivery', standard: 'no', professional: 'yes' },
  { featureName: 'Mobile BI access', standard: 'no', professional: 'yes' },
  { featureName: 'Role-based access to insights', standard: 'yes', professional: 'yes' },
  { featureName: 'AI-powered insights & anomaly detection', standard: 'no', professional: 'yes' },
];

function isYes(val?: 'yes' | 'no' | boolean | string): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.toLowerCase() === 'yes' || val.toLowerCase() === 'true';
  return false;
}

export function BiFeatures({ content }: { content?: BiFeaturesContent }) {
  const sectionTitle = content?.sectionTitle || 'Features for BI';
  const column1Title = content?.column1Title || 'FEATURES';
  const column2Title = content?.column2Title || 'SAGE 200 STANDARD';
  const column3Title = content?.column3Title || 'SAGE 200 PROFESSIONAL';
  const rows = content?.rows?.length ? content.rows : DEFAULT_ROWS;

  return (
    <section className="w-full py-16 md:py-20 bg-white border-t border-b border-slate-200/80">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Title */}
        {sectionTitle && (
          <h2
            className="text-3xl md:text-4xl font-bold text-[#2e1065] tracking-tight mb-8"
            style={content?.sectionTitleColor ? { color: content.sectionTitleColor } : undefined}
          >
            {sectionTitle}
          </h2>
        )}

        {/* Table Container with Rounded Corners & Shadow */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-[#290d78] text-white text-xs sm:text-sm font-bold uppercase tracking-wider border-b-4 border-amber-400">
                  <th className="py-4 px-6 w-5/12 text-white">
                    {column1Title}
                  </th>
                  <th className="py-4 px-6 w-3.5/12 text-center text-white border-l border-white/10">
                    {column2Title}
                  </th>
                  <th className="py-4 px-6 w-3.5/12 text-center text-white border-l border-white/10">
                    {column3Title}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => {
                  const isStdYes = isYes(row.standard);
                  const isProYes = isYes(row.professional);
                  const isSecondRowGray = idx % 2 === 1;

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors hover:bg-purple-50/30 ${isSecondRowGray ? 'bg-[#f8fafc]' : 'bg-white'
                        }`}
                    >
                      {/* Feature Name Column */}
                      <td className="py-3.5 px-6 text-sm font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="w-1 h-4 bg-amber-400 rounded-full shrink-0" />
                          <span>{row.featureName}</span>
                        </div>
                      </td>

                      {/* Standard Column */}
                      <td className="py-3.5 px-6 text-center border-l border-slate-100">
                        <div className="flex items-center justify-center">
                          {isStdYes ? (
                            <div className="w-6 h-6 rounded-full bg-[#1e0a45] text-white flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#8e8e93] text-white flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Professional Column */}
                      <td className="py-3.5 px-6 text-center border-l border-slate-100">
                        <div className="flex items-center justify-center">
                          {isProYes ? (
                            <div className="w-6 h-6 rounded-full bg-[#1e0a45] text-white flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#8e8e93] text-white flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

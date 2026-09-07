'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

function stripHtml(content?: string | null): string {
  if (!content) return '';
  let str = String(content);
  // Unescape HTML entities first
  for (let i = 0; i < 3; i++) {
    if (!str.includes('&')) break;
    str = str
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#x2F;/gi, '/')
      .replace(/&#60;/gi, '<')
      .replace(/&#62;/gi, '>');
  }
  // Remove HTML tags
  return str.replace(/<[^>]*>/g, '').trim();
}

export interface FaqItem {
  question?: string;
  quotation?: string;
  qutation?: string;
  answer: string;
  arrowIcon?: string;
}

export interface Landing1FaqContent {
  badge?: string;
  title?: string;
  description?: string;
  faqs?: FaqItem[];
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'How long does an ESS ERP implementation take?',
    answer: "Most mid-market deployments go live in 6–12 weeks. The exact timeline depends on the number of modules, data migration volume and custom workflows. Our 7-step methodology includes a parallel-run safety net so there's zero disruption at cutover."
  },
  {
    question: 'Is ESS ERP cloud-based or on-premise',
    answer: 'Both options are available. We offer secure cloud hosting on AWS/Azure, as well as on-premise deployments for enterprises with strict compliance or local network requirements.'
  },
  {
    question: 'Which industries does ESS ERP support?',
    answer: 'We support Manufacturing, Retail, Chemicals, Automotive, Cosmetics, Pharmaceuticals, Steel, Logistics, Food & Beverage, and more with pre-built configurations.'
  },
  {
    question: 'How does the AI Copilot actually work?',
    answer: 'The AI Copilot integrates with your data to automate routine data entry, generate instant compliance reports, predict inventory shortages, and answer business queries using natural language.'
  },
  {
    question: 'Can ESS ERP integrate with our existing tools?',
    answer: 'Yes! We offer rich REST APIs and pre-built connectors for popular tools like Salesforce, HubSpot, QuickBooks, Tally, Gmail, Slack, and various logistics APIs.'
  },
  {
    question: "What is ebizframe ERP?",
    answer: "ebizframe is a Next-Gen ERP suite that empowers organizations with real-time operational visibility, AI-driven insights, and seamless workflow automation across finance, supply chain, HCM, and manufacturing."
  },
  {
    question: "How long does implementation take?",
    answer: "Implementation timelines vary by organization size and complexity. With our pre-configured rapid deployment methodologies, typical rollouts range between 6 to 16 weeks."
  },
  {
    question: "Is ebizframe available on Cloud?",
    answer: "Yes, ebizframe offers complete deployment flexibility including Multi-Tenant Cloud, Private Cloud, and On-Premise models with robust enterprise security."
  }
];

const DEFAULT_CONTENT: Landing1FaqContent = {
  badge: "FAQ'S",
  title: "Frequently Asked Questions",
  description: "Find clarity on how our Next-Gen ERP solutions transform operations.",
  faqs: DEFAULT_FAQS
};

export function Landing1Faq({ content }: { content?: Landing1FaqContent }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const data = content || DEFAULT_CONTENT;

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-[#FAFAFC] relative overflow-hidden border-b border-slate-100">
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
               {/* Header */}
        <div className="text-center space-y-4 mb-16">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>{stripHtml(data.badge)}</span>
            </span>
          )}
          {data.title && (
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-tight">
              {stripHtml(data.title)}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {stripHtml(data.description)}
            </p>
          )}
        </div>

        {/* Faqs List */}
        <div className="space-y-4">
          {data.faqs?.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const questionText = stripHtml((faq as any).quotation || (faq as any).qutation || faq.question);
            const answerText = stripHtml(faq.answer);

            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left group cursor-pointer"
                >
                  <span className="font-extrabold text-[#0F172A] text-sm md:text-base leading-snug pr-4">
                    {questionText}
                  </span>
                  {faq.arrowIcon || (faq as any).icon ? (
                    <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center p-1.5 transition-all duration-300 shrink-0 ${isOpen ? 'rotate-90 border-indigo-600 bg-indigo-50/50' : ''}`}>
                      <img
                        src={(faq.arrowIcon || (faq as any).icon || '').startsWith('/') || (faq.arrowIcon || (faq as any).icon || '').startsWith('http') ? (faq.arrowIcon || (faq as any).icon) : `/${faq.arrowIcon || (faq as any).icon}`}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-600 transition-all duration-300 shrink-0 ${isOpen ? 'rotate-90 text-indigo-600 border-indigo-600 bg-indigo-50/50' : ''}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
                
                {isOpen && answerText && (
                  <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-4">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

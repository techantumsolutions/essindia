'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

interface FaqItem {
  question?: string;
  answer?: string;
}

interface RpaFaqContent {
  title?: string;
  subtitle?: string;
  faqs?: FaqItem[];
}

export function RpaFaq({ content }: { content?: RpaFaqContent }) {
  const title = content?.title || 'Frequently Asked Questions';
  const subtitle = content?.subtitle || 'Find answers to common questions about our RPA services.';

  const defaultFaqs: FaqItem[] = [
    {
      question: 'What processes are best suited for RPA?',
      answer: 'Rule-based, repetitive, high-volume tasks like data entry, invoice processing, and report generation are ideal candidates for RPA automation.'
    },
    {
      question: 'How long does it take to implement RPA?',
      answer: 'Initial bot deployment can take anywhere from 2 to 6 weeks, depending on process complexity and integration requirements.'
    }
  ];

  const faqs = content?.faqs && content.faqs.length > 0 ? content.faqs : defaultFaqs;

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleIdx = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-12 bg-white font-sans border-b">
      <div className="container mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          {title && (
            <FormattedText content={title} as="h2" className="text-3xl sm:text-4xl font-bold text-[#27256b] tracking-tight" />
          )}
          {subtitle && (
            <FormattedText content={subtitle} className="text-slate-500 font-light text-base sm:text-lg" />
          )}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = idx === openIdx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#27256b]/20 bg-slate-50/50 shadow-sm' : 'border-slate-100 bg-white'
                  }`}
              >
                {/* Header Button */}
                <button
                  type="button"
                  onClick={() => toggleIdx(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-[#27256b] transition-colors focus:outline-none"
                >
                  <FormattedText
                    content={faq.question || (faq as any).quotation}
                    as="span"
                    className="text-base sm:text-lg font-bold pr-4"
                  />
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#27256b] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormattedText
                        content={faq.answer}
                        className="px-5 pb-5 pt-0 text-sm sm:text-base text-slate-500 font-light leading-relaxed border-t border-slate-100/50"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

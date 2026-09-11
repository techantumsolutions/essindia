'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FormattedText } from '@/components/ui/FormattedText';

interface FaqItem {
  question: string;
  answer: string;
  arrowIcon?: string;
}

interface FmcgFaqContent {
  title?: string;
  subtitle?: string;
  faqs?: FaqItem[];
}

export function FmcgFaq({ content }: { content?: FmcgFaqContent }) {
  const title = content?.title !== undefined ? content.title : 'Frequently Asked Questions';
  const subtitle = content?.subtitle !== undefined ? content.subtitle : 'Get the information you need with our frequently asked questions.';

  const defaultFaqs: FaqItem[] = [
    {
      question: 'What is Business Intelligence (BI)?',
      answer: 'Business Intelligence is how leaders turn raw data into clear, decision-ready insights. It connects data from across the business, explains what is happening and why, and highlights where attention is needed, so decisions are based on facts, not assumptions.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Which industries can benefit from Business Intelligence?',
      answer: 'Our BI solution caters extensively to FMCG, Retail, Manufacturing, Logistics, Healthcare, and Corporate Management, helping optimize routes, reduce stock-outs, and analyze sales performance.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Is Business Intelligence mobile-friendly?',
      answer: 'Yes! Our BI dashboards are completely responsive and accessible across all devices, including laptops, tablets, and smartphones, so you can track operations on the go.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Can Business Intelligence be customized to specific business needs?',
      answer: 'Absolutely. We design and tailor custom dashboards, metric calculations, and automated reports to fit the unique operational goals and data infrastructure of your business.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'What types of data sources does BI support?',
      answer: 'We integrate with a wide variety of data sources, including ERP systems (SAP, Oracle, Sage), POS terminals, CRM software, pricing engines, warehouse databases, and external flat files (CSV, Excel).',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Can Business Intelligence tell what happened, why it happened, and what steps we should take next?',
      answer: 'Yes, powered by EVA, our AI-powered assistant, the BI platform analyzes historical data to detect anomalies, explains key contributors, and automatically recommends action steps.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'How soon can I start seeing measurable ROI from this BI solution?',
      answer: 'Most organizations witness direct financial returns, such as reduced inventory holding costs and improved promotion ROI, within the first 4 to 8 weeks of full integration.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    }
  ];

  const faqs = content?.faqs && content.faqs.length > 0 ? content.faqs : defaultFaqs;

  // Track open state for each FAQ card
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-4xl text-center space-y-6">

        {/* Title Block */}
        {(title || subtitle) && (
          <div className="space-y-2 max-w-2xl mx-auto">
            {title && (
              <FormattedText content={title} as="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight" />
            )}
            {subtitle && (
              <FormattedText content={subtitle} className="text-slate-500 text-sm sm:text-base leading-relaxed" />
            )}
          </div>
        )}

        {/* FAQs List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = !!openIndexes[idx];
            const arrowSrc = faq.arrowIcon || '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png';
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300"
              >
                {/* Question Row */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-[#2a2b6a] hover:bg-slate-50/50 transition-colors text-left"
                >
                  <FormattedText
                    content={faq.question || (faq as any).quotation}
                    as="span"
                    className="text-sm sm:text-base font-bold pr-4"
                  />

                  {/* Arrow Icon */}
                  {arrowSrc && arrowSrc.trim() !== '' && (
                    <div className="w-6 h-6 relative shrink-0">
                      <Image
                        src={arrowSrc.startsWith('/') || arrowSrc.startsWith('http') ? arrowSrc : `/${arrowSrc}`}
                        alt="Toggle FAQ"
                        fill
                        className={`object-contain transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </div>
                  )}
                </button>

                {/* Answer Row */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] border-t border-slate-100' : 'max-h-0'
                    }`}
                >
                  <FormattedText
                    content={faq.answer}
                    className="p-6 sm:p-8 text-slate-500 text-xs sm:text-sm leading-relaxed [&_p]:!text-xs sm:[&_p]:!text-sm [&_p]:!leading-relaxed [&_p]:m-0"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

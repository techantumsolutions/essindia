'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LimitationItem {
  text: string;
}

interface FaqItem {
  question?: string;
  answer: string;
}

interface RoiUsageContent {
  usageTitle?: string;
  usageParagraphs?: string[];
  usageImage?: string;
  limitationsTitle?: string;
  limitationsDescription?: string;
  limitations?: LimitationItem[];
  faqTitle?: string;
  faqs?: FaqItem[];
}

export function RoiUsage({ content }: { content?: RoiUsageContent }) {
  const usageTitle = content?.usageTitle || 'How and when to use ROI';
  const usageParagraphs = content?.usageParagraphs || [
    'ROI is a valuable decision-making tool. Use it to evaluate the potential profitability of different investment decisions, such as a new product line, marketing campaign or equipment upgrade. Calculate ROI before making significant financial commitments to compare options and forecast which will yield the highest rate of return. Additionally, you can track ROI after an investment to measure its ongoing performance and success in terms of capital gains.',
    'Improving customer experiences: Salesforce provides businesses with tools to improve customer experiences, such as customer service, support, and loyalty programs. These tools can help businesses build relationships with customers and increase customer satisfaction.'
  ];
  const usageImage = content?.usageImage || '/BI-ROI caluculator/Frame 297.png';

  const limitationsTitle = content?.limitationsTitle || 'Limitations of ROI';
  const limitationsDescription = content?.limitationsDescription || 'ROI is a very useful tool for decision-making, but it has some limitations that are important to consider:';
  const limitations = content?.limitations || [
    { text: 'Benefit estimates are based on future projections. These projections are uncertain, meaning that ROI cannot predict with certainty the future performance of an investment.' },
    { text: 'ROI does not take risk into account, nor does it consider the possibility that an investment may lose money.' }
  ];

  const faqTitle = content?.faqTitle || "ROI FAQ's";
  const faqs = content?.faqs || [
    {
      answer: 'ROI is a valuable decision-making tool. Use it to evaluate the potential profitability of different investment decisions, such as a new product line, marketing campaign or equipment upgrade. Calculate ROI before making significant financial commitments to compare options and forecast which will yield the highest rate of return. Additionally, you can track ROI after an investment to measure its ongoing performance and success in terms of capital gains.\n\nImproving customer experiences: Salesforce provides businesses with tools to improve customer experiences, such as customer service, support, and loyalty programs. These tools can help businesses build relationships with customers and increase customer satisfaction.'
    }
  ];

  return (
    <section className="py-14 bg-white relative border-t border-slate-100">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 space-y-16">
        
        {/* Subsection 1: How and when to use ROI */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2b2a6c] tracking-tight">
              {usageTitle}
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              {usageParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Image */}
          {usageImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full max-w-lg lg:max-w-xl relative aspect-[4/3] lg:h-[380px] shrink-0 flex justify-center items-center"
            >
              <div className="w-full h-full relative">
                <Image
                  src={usageImage}
                  alt={usageTitle}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Subsection 2: Limitations of ROI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-left max-w-5xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2b2a6c] tracking-tight">
            {limitationsTitle}
          </h2>
          
          {limitationsDescription && (
            <p className="text-slate-700 text-sm sm:text-base font-medium">
              {limitationsDescription}
            </p>
          )}

          {limitations && limitations.length > 0 && (
            <ul className="space-y-4 pt-2">
              {limitations.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Subsection 3: FAQ's */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-left max-w-5xl pt-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2b2a6c] tracking-tight">
            {faqTitle}
          </h2>

          <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-3">
                {faq.question && (
                  <h4 className="font-bold text-slate-800 text-base">{faq.question}</h4>
                )}
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

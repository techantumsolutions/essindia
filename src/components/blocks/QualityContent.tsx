'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QualityContentData {
  title1?: string;
  isoTitle?: string;
  isoDescription?: string;
  cmmTitle?: string;
  cmmDescription1?: string;
  cmmDescription2?: string;
  title2?: string;
  policies?: string[];
}

interface QualityContentProps {
  content?: QualityContentData;
}

const defaultContent: QualityContentData = {
  title1: 'Our Quality Certifications',
  isoTitle: 'ISO – 9001:2000 (1999), upgraded to 2008 standards and further upgraded to 2015 standards.',
  isoDescription: 'ESS was awarded ISO 9001:1994 certification in August 1999 by BVQI(Bureau Veritas Quality International). In August 2002, ESS was re-certified against the new standards ISO 9001:2000, by BVQI. ESS is certified for ISO for the processes in Product Development and Maintenance, Project Implementation, Marketing, Human Resources, Finance and Support. In Aug 2009, ESS was successfully upgraded to 2008 standards post an audit by BVQI. Subsequently, it was further upgraded to ISO-9001: 2015 standard in October, 2017.',
  cmmTitle: 'SEI-CMM Level 5 (2002)',
  cmmDescription1: 'SEI-CMM stands for Capability Maturity Model from Software Engineering Institute from Carnegie Mellon University. A company can be assessed at any CMM level from Level 1 to Level 5 with Level 5 being the highest.',
  cmmDescription2: 'Eastern Software Solutions went in for CBA – IPI in April 2002 and our processes for product enhancement and customization operations were assessed at Level 5 of CMM (Ver 1.1). We are now in SEI’s list of High Maturity organizations. According to the Carnegie Mellon University Software Engineering Institute, CMM is a common-sense application of software or business process management and quality improvement concepts to software development and maintenance. The CMM is a framework that describes the key elements of an effective software process. The CMM helps to measure and establish an improvement path from an immature, out-of-control processes to a mature and in-control processes. The CMM helps establish measurable targets against which it is possible to judge and improve the maturity of an organization’s software processes.',
  title2: 'ESS’s Quality Policy',
  policies: [
    'To achieve a step by step improvement in whatever we do, by implementing our documented Quality System – a system that focuses on continuous improvement and is supported by various International Certifications.',
    'To discover better and better ways to serve our customers, shareholders and colleagues, with each incremental step bringing consistency in our work.',
    'To ensure that each interaction with our customers, shareholders and colleagues is a meaningful experience; an interaction that contributes to the growth of the organization as well as the individual.'
  ]
};

export function QualityContent({ content }: QualityContentProps) {
  const data = { ...defaultContent, ...content };

  const GoldCheckCircle = () => (
    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#E2A925]/10 border border-[#E2A925] text-[#E2A925] mt-1">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  return (
    <section className="py-20 bg-white text-slate-800 relative">
      <div className="container mx-auto px-6  max-w-7xl">
        <div className="space-y-12">

          {/* Section 1: Our Quality Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                {data.title1}
              </h2>
              <h3 className="text-xs md:text-md  font-normal text-slate-900 mt-0">
                {data.isoTitle}
              </h3>
            </div>

            {/* ISO */}
            <div className="space-y-3">

              <p className="text-slate-500 font-light leading-relaxed text-xs md:text-[15px]">
                {data.isoDescription}
              </p>
            </div>

            {/* SEI CMM */}
            <div className="space-y-4 pt-4">
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-bold text-slate-900">
                  {data.cmmTitle}
                </h3>
                <p className="text-slate-500 font-light leading-relaxed text-xs md:text-[15px]">
                  {data.cmmDescription1}
                </p>
              </div>
              <p className="text-slate-500 font-light leading-relaxed text-xs md:text-[15px]">
                {data.cmmDescription2}
              </p>
            </div>
          </motion.div>

          {/* Section 2: ESS's Quality Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 pt-6 border-t border-slate-100"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
              {data.title2}
            </h2>

            <div className="space-y-5">
              {data.policies?.map((policy, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <GoldCheckCircle />
                  <p className="text-slate-600 font-light leading-relaxed text-xs md:text-[15px] pt-0.5">
                    {policy}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

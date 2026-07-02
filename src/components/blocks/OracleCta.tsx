'use client';

import React, { useState } from 'react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface OracleCtaContent {
  title?: string;
  description?: string;
  buttonText?: string;
  pdfUrl?: string;
}

export function OracleCta({ content }: { content?: OracleCtaContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = content?.title || 'Future-Ready Oracle Database Strategy';
  const description = content?.description || 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.';
  const buttonText = content?.buttonText || 'Explore Your Upgrade Roadmap';
  const pdfUrl = content?.pdfUrl;

  return (
    <section className="py-14 bg-[#f0f2f7] ">
      <div className="container mx-auto max-w-4xl px-6 text-center space-y-6">

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-normal text-[#5e35b1] tracking-tight font-sans"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-700 font-semibold max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        {buttonText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <button onClick={() => setIsModalOpen(true)} className="bg-[#4B2A63] text-white hover:bg-[#3A1F4D] px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2">
                {buttonText}
              </button>
            </motion.div>
          </motion.div>
        )}

      </div>
    
      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}

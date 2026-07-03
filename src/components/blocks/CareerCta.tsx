'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';

export default function CareerCta({ content }: { content?: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    title = 'Ready To Start Your Career Journey?',
    subtitle = 'Join our team and be part of an innovative culture that values your growth and contributions.',
    ctaText = 'Join Us',
    pdfUrl
  } = content || {};

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D1A5C] mb-4">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-xl font-medium leading-none mb-6">
            {subtitle}
          </p>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#0D1A5C] text-white hover:bg-[#07103a] px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2">
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
      
      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}

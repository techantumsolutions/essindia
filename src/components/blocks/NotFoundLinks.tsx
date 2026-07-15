'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HelpfulLink {
  title?: string;
  description?: string;
  url?: string;
}

export interface NotFoundLinksContent {
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  links?: HelpfulLink[];
  bgColor?: string;
}

const DEFAULT_LINKS: HelpfulLink[] = [
  {
    title: 'Home',
    description: 'Return to the ESS India homepage',
    url: '/',
  },
  {
    title: 'Solutions',
    description: 'Explore ERP, BI, and digital transformation solutions',
    url: '/solutions',
  },
  {
    title: 'Careers',
    description: 'See open roles and join our team',
    url: '/careers',
  },
  {
    title: 'Contact',
    description: 'Get in touch with our experts',
    url: '/contact-us',
  },
];

export function NotFoundLinks({ content }: { content?: NotFoundLinksContent }) {
  const title = content?.title || 'Helpful links';
  const titleColor = content?.titleColor || '#0f172a';
  const description = content?.description || 'These popular pages may help you find what you need.';
  const descriptionColor = content?.descriptionColor || '#64748b';
  const links = content?.links?.length ? content.links : DEFAULT_LINKS;
  const bgColor = content?.bgColor || '#f8fafc';

  return (
    <section className="py-16" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-10 space-y-3">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: titleColor }}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base" style={{ color: descriptionColor }}>
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                href={link.url || '#'}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#4B2A63]/30 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors">
                    {link.title || 'Link'}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{link.description}</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-slate-400 group-hover:text-[#4B2A63] transition-colors" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

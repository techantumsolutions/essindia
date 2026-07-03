'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface FeatureItem {
  title?: string;
  description?: string;
  icon?: string;
}

export interface EuropeProductShowcaseContent extends EuropeCommonSettings {
  deviceImage?: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  buttonUrl?: string;
  features?: FeatureItem[];
}

const DEFAULT_FEATURES: FeatureItem[] = [
  { title: 'Real-time Dashboards', description: 'Monitor KPIs across finance, operations, and sales.' },
  { title: 'Mobile Access', description: 'Approve workflows and view reports on the go.' },
  { title: 'Multi-language Support', description: 'Built for European markets with localization.' },
  { title: 'Secure Cloud', description: 'Enterprise-grade security and compliance.' },
];

export function EuropeProductShowcase({ content }: { content?: EuropeProductShowcaseContent }) {
  const deviceImage = content?.deviceImage || '/industry-solution-Retail/banner-image.png';
  const badgeText = content?.badgeText || 'Mobile App';
  const badgeBgColor = content?.badgeBgColor || '#dbeafe';
  const badgeTextColor = content?.badgeTextColor || '#2563eb';
  const title = content?.title || 'Getting started with ebizframe is easier than ever';
  const titleColor = content?.titleColor || '#1e293b';
  const description =
    content?.description ||
    'Access your entire ERP from any device. Manage approvals, track inventory, and view analytics — wherever your European operations take you.';
  const descriptionColor = content?.descriptionColor || '#64748b';
  const buttonText = content?.buttonText || 'Download App';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonBgColor = content?.buttonBgColor || '#4B2A63';
  const buttonUrl = content?.buttonUrl || '/contact';
  const features = content?.features?.length ? content.features : DEFAULT_FEATURES;

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#f0f4f8' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative w-[260px] sm:w-[300px] aspect-[9/19]">
            <div className="absolute inset-0 rounded-[40px] border-8 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
              {deviceImage && (
                <Image
                  src={deviceImage}
                  alt="ebizframe mobile app"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              )}
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {badgeText && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
            >
              {badgeText}
            </span>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: titleColor }}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base leading-relaxed" style={{ color: descriptionColor }}>
              {description}
            </p>
          )}
          {buttonText && (
            <Link
              href={buttonUrl}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {buttonText}
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" aria-hidden="true" />
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
              >
                {feature.title && (
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{feature.title}</h4>
                )}
                {feature.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EuropeSectionShell>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';
import { CmsHeading } from '@/components/cms/CmsHeading';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface EuropePromoCtaContent extends EuropeCommonSettings {
  image?: string;
  smallTitle?: string;
  title?: string;
  headingTag?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonFormType?: string;
}

export function EuropePromoCta({ content }: { content?: EuropePromoCtaContent }) {
  const image = content?.image || '/About-Europe/image%20144.png';
  const smallTitle = content?.smallTitle || 'ESS AI';
  const title = content?.title || 'Monitor everything, so your brand is prepared for anything';
  const description =
    content?.description ||
    'Stay ahead of trends, safeguard your brand health, and uncover what your audience really cares about. Talkwalker by Hootsuite tracks billions of conversations and turns them into your competitive edge.';
  const buttonText = content?.buttonText || 'Meet our team';
  const buttonUrl = content?.buttonUrl || '/contact-us';
  const buttonFormType = (content?.buttonFormType || '') as CtaFormType;

  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: '#f4f7fa', sectionPaddingTop: 'pt-14', sectionPaddingBottom: 'pb-14' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-4 text-left flex flex-col justify-center">
          {smallTitle && (
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f61]">
              {smallTitle}
            </span>
          )}
          {title && (
            <CmsHeading tag={undefined} fallback="h2" className="text-3xl sm:text-[40px] leading-[1.15] font-bold text-[#111827]">
              {title}
            </CmsHeading>
          )}
          {description && (
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
          {buttonText && (
            <Link
              href={buttonUrl}
              onClick={buttonFormType ? (e) => { e.preventDefault(); handleBtnClick(); } : undefined}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-medium text-white bg-[#231f61] hover:bg-[#1a174d] transition-all shadow-md w-fit cursor-pointer"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
          {modalNode}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full aspect-[4/3] md:aspect-[5/4] shrink-0">
            {image && (
              <Image
                src={image}
                alt="AI Brand Monitoring Dashboard"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </motion.div>
      </div>
    </EuropeSectionShell>
  );
}

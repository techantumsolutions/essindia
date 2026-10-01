'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';
import { CmsHeading } from '@/components/cms/CmsHeading';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface SlideImage {
  image?: string;
  alt?: string;
}

export interface ShowcaseItem {
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  title?: string;
  headingTag?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonTextColor?: string;
  primaryButtonHoverTextColor?: string;
  primaryButtonBgColor?: string;
  primaryButtonHoverBgColor?: string;
  primaryButtonBorderColor?: string;
  primaryButtonUrl?: string;
  primaryButtonFormType?: string;
  primaryButtonPdfUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonHoverTextColor?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonHoverBgColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonUrl?: string;
  secondaryButtonFormType?: string;
  secondaryButtonPdfUrl?: string;
  image?: string;
}

export interface EuropeDarkShowcaseContent extends EuropeCommonSettings {
  badgeText?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  image?: string;
  items?: ShowcaseItem[];
}

const DEFAULT_ITEMS: ShowcaseItem[] = [
  {
    badgeText: 'APIS',
    title: 'Messaging, email, and voice APIs to help developers build better products',
    description: 'Start small or scale globally—our messaging, email, and voice APIs provide the secure, reliable foundation you need to connect with every handset worldwide.',
    primaryButtonText: 'Talk to an expert',
    primaryButtonUrl: '/contact-us',
    secondaryButtonText: 'View APIs',
    secondaryButtonUrl: '/contact-us',
    image: '/industry-solution-Retail/banner-image.png',
  },
  {
    badgeText: 'AUTOMATION',
    title: 'Streamlined operational workflows for scaling enterprises',
    description: 'Automate repetitive tasks, sync multi-location inventory, and empower your teams with real-time insights across departments.',
    primaryButtonText: 'Book a demo',
    primaryButtonUrl: '/contact-us',
    secondaryButtonText: 'Explore Features',
    secondaryButtonUrl: '/contact-us',
    image: '/industry-solution-Retail/process_ERP_Retail.png',
  },
  {
    badgeText: 'ANALYTICS',
    title: 'Real-time dashboards & predictive business intelligence',
    description: 'Gain complete visibility into business performance with interactive analytics, custom reporting, and executive alerts.',
    primaryButtonText: 'Get Started',
    primaryButtonUrl: '/contact-us',
    secondaryButtonText: 'Learn More',
    secondaryButtonUrl: '/contact-us',
    image: '/Business intilligence/image 44.png',
  },
];

function ShowcaseItemCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);

  const primaryButtonText = item.primaryButtonText;
  const primaryButtonTextColor = item.primaryButtonTextColor || '#ffffff';
  const primaryButtonHoverTextColor = item.primaryButtonHoverTextColor;
  const primaryButtonBgColor = item.primaryButtonBgColor || '#2563eb';
  const primaryButtonHoverBgColor = item.primaryButtonHoverBgColor || '#1d4ed8';
  const primaryButtonBorderColor = item.primaryButtonBorderColor || '#2563eb';
  const primaryButtonUrl = item.primaryButtonUrl || '/contact-us';
  const primaryButtonFormType = (item.primaryButtonFormType || '') as CtaFormType;

  const secondaryButtonText = item.secondaryButtonText;
  const secondaryButtonTextColor = item.secondaryButtonTextColor || '#ffffff';
  const secondaryButtonHoverTextColor = item.secondaryButtonHoverTextColor;
  const secondaryButtonBgColor = item.secondaryButtonBgColor || 'transparent';
  const secondaryButtonHoverBgColor = item.secondaryButtonHoverBgColor || 'rgba(255,255,255,0.1)';
  const secondaryButtonBorderColor = item.secondaryButtonBorderColor || 'rgba(255,255,255,0.4)';
  const secondaryButtonUrl = item.secondaryButtonUrl || '/contact-us';
  const secondaryButtonFormType = (item.secondaryButtonFormType || '') as CtaFormType;

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(
    primaryButtonUrl,
    primaryButtonFormType,
    item.primaryButtonPdfUrl
  );
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(
    secondaryButtonUrl,
    secondaryButtonFormType,
    item.secondaryButtonPdfUrl
  );

  return (
    <div className="py-12 border-b border-white/10 last:border-b-0 space-y-6 text-left">
      {item.badgeText && (
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20"
          style={{
            backgroundColor: item.badgeBgColor || 'transparent',
            color: item.badgeTextColor || '#ffffff',
          }}
        >
          {item.badgeText}
        </span>
      )}

      {item.title && (
        <CmsHeading
          tag={item.headingTag as any}
          fallback="h2"
          className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.15] whitespace-pre-line text-white"
          style={{ color: item.titleColor || '#ffffff' }}
        >
          {item.title}
        </CmsHeading>
      )}

      {item.description && (
        <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl" style={{ color: item.descriptionColor }}>
          {item.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        {primaryButtonText && (
          <Link
            href={primaryButtonUrl}
            onClick={primaryButtonFormType ? (e) => { e.preventDefault(); handlePrimaryClick(); } : undefined}
            onMouseEnter={() => setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
            className="px-7 py-3 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
            style={{
              backgroundColor: isPrimaryHovered && primaryButtonHoverBgColor ? primaryButtonHoverBgColor : primaryButtonBgColor,
              borderColor: primaryButtonBorderColor,
              color: isPrimaryHovered && primaryButtonHoverTextColor ? primaryButtonHoverTextColor : primaryButtonTextColor,
            }}
          >
            {primaryButtonText}
          </Link>
        )}

        {secondaryButtonText && (
          <Link
            href={secondaryButtonUrl}
            onClick={secondaryButtonFormType ? (e) => { e.preventDefault(); handleSecondaryClick(); } : undefined}
            onMouseEnter={() => setIsSecondaryHovered(true)}
            onMouseLeave={() => setIsSecondaryHovered(false)}
            className="px-7 py-3 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
            style={{
              backgroundColor: isSecondaryHovered && secondaryButtonHoverBgColor ? secondaryButtonHoverBgColor : secondaryButtonBgColor,
              borderColor: secondaryButtonBorderColor,
              color: isSecondaryHovered && secondaryButtonHoverTextColor ? secondaryButtonHoverTextColor : secondaryButtonTextColor,
            }}
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>

      {primaryModal}
      {secondaryModal}
    </div>
  );
}

export function EuropeDarkShowcase({ content }: { content?: EuropeDarkShowcaseContent }) {
  const items: ShowcaseItem[] = content?.items && content.items.length > 0
    ? content.items
    : (content?.title
        ? [
            {
              badgeText: content.badgeText,
              title: content.title,
              description: content.description,
              primaryButtonText: content.primaryButtonText,
              primaryButtonUrl: content.primaryButtonUrl,
              secondaryButtonText: content.secondaryButtonText,
              secondaryButtonUrl: content.secondaryButtonUrl,
              image: content.image || (content as any).dashboardImage,
            },
          ]
        : DEFAULT_ITEMS);

  const [activeIndex, setActiveIndex] = useState(0);
  const leftScrollRef = React.useRef<HTMLDivElement>(null);
  const rightPanelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rightEl = rightPanelRef.current;
    if (!rightEl) return;

    const handleRightWheel = (e: WheelEvent) => {
      if (!leftScrollRef.current) return;
      const leftEl = leftScrollRef.current;

      const isScrollable = leftEl.scrollHeight > leftEl.clientHeight;
      if (!isScrollable) return;

      const atTop = leftEl.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = Math.ceil(leftEl.scrollTop + leftEl.clientHeight) >= leftEl.scrollHeight && e.deltaY > 0;

      if (!atTop && !atBottom) {
        e.preventDefault();
      }

      // Trackpads send tiny pixel deltas (~1-5px per event), standard mice send ~100px.
      // Scaling factor: if deltaMode is pixel, scale up by 3.5x to match browser native wheel speed.
      let dy = e.deltaY;
      if (e.deltaMode === 1) {
        dy *= 40;
      } else if (e.deltaMode === 2) {
        dy *= leftEl.clientHeight;
      } else {
        dy *= 3.5;
      }

      leftEl.scrollBy({ top: dy, behavior: 'instant' as ScrollBehavior });
    };

    rightEl.addEventListener('wheel', handleRightWheel, { passive: false });
    return () => {
      rightEl.removeEventListener('wheel', handleRightWheel);
    };
  }, []);

  const handleLeftScroll = () => {
    if (!leftScrollRef.current) return;
    const container = leftScrollRef.current;
    const itemElements = container.querySelectorAll('.showcase-scroll-item');
    const containerTop = container.getBoundingClientRect().top;

    itemElements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      const relativeTop = rect.top - containerTop;
      if (relativeTop <= container.clientHeight * 0.4 && rect.bottom - containerTop >= container.clientHeight * 0.1) {
        setActiveIndex(idx);
      }
    });
  };

  const activeImage = items[activeIndex]?.image || items[0]?.image || '/industry-solution-Retail/banner-image.png';

  let formattedImage = activeImage.trim();
  if (!formattedImage.startsWith('/') && !formattedImage.startsWith('http://') && !formattedImage.startsWith('https://')) {
    formattedImage = `/${formattedImage}`;
  }

  return (
    <EuropeSectionShell
      content={{
        ...content,
        textAlignment: 'left',
        backgroundColor: '#0b0f19',
        sectionPaddingTop: 'pt-16',
        sectionPaddingBottom: 'pb-16',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto text-left">
        {/* Left Internally Scrollable Column (Sinch-style) */}
        <div
          ref={leftScrollRef}
          onScroll={handleLeftScroll}
          className="lg:col-span-6 max-h-[520px] overflow-y-auto no-scrollbar pr-2 sm:pr-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="showcase-scroll-item min-h-[460px] flex flex-col justify-center">
              <ShowcaseItemCard item={item} index={idx} />
            </div>
          ))}
        </div>

        {/* Right Sticky / Synchronized Image Panel */}
        <div
          ref={rightPanelRef}
          className="lg:col-span-6"
        >
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={formattedImage}
                  alt={items[activeIndex]?.title || 'Showcase Image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized={formattedImage.startsWith('http://') || formattedImage.startsWith('https://')}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick item navigation indicator dots */}
          {items.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    if (leftScrollRef.current) {
                      const itemEls = leftScrollRef.current.querySelectorAll('.showcase-scroll-item');
                      if (itemEls[idx]) {
                        itemEls[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to item ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </EuropeSectionShell>
  );
}

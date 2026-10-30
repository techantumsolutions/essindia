'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';
import { MotionSection } from '@/components/animations/MotionSection';
import { Check, Calendar, Zap, Layers, BarChart3 } from 'lucide-react';

interface ErpFeature {
  id?: string;
  icon?: string;
  image?: string;
  title?: string;
  desc?: string;
  desc2?: string;
}

interface ErpFeaturesTabContent {
  heading?: string;
  headingColor?: string;
  headingSecondaryColor?: string;
  highlightedWordIndices?: number[];
  subheading?: string;
  subheadingTextColor?: string;
  bgColor?: string;
  cardBgColor?: string;
  contentTextColor?: string;
  descriptionTextColor?: string;
  activeTabBgColor?: string;
  activeTabTextColor?: string;
  inactiveTabBgColor?: string;
  inactiveTabTextColor?: string;
  features?: ErpFeature[];
}

interface ErpFeaturesTabProps {
  content?: ErpFeaturesTabContent;
}

const defaultIcons = [Calendar, Zap, Layers, BarChart3];

export function ErpFeaturesTab({ content }: ErpFeaturesTabProps) {
  const heading = content?.heading || 'Why 1,500+ Enterprises Chose ebizframe.ai';
  const headingColor = content?.headingColor || '#0f172a';
  const headingSecondaryColor = content?.headingSecondaryColor || '#6B26D9';
  const highlightedWordIndices = Array.isArray(content?.highlightedWordIndices)
    ? content.highlightedWordIndices
    : undefined;
  const subheading = content?.subheading || 'Select standard version or customizable version';
  const bgColor = content?.bgColor || '#F8F5FE';
  const cardBgColor = content?.cardBgColor || '#ffffff';
  const subheadingTextColor = content?.subheadingTextColor || '#64748b';
  const descriptionTextColor =
    content?.descriptionTextColor || content?.contentTextColor || '#334155';
  const activeTabBgColor = content?.activeTabBgColor || '#c7d2fe';
  const activeTabTextColor = content?.activeTabTextColor || '#ffffff';
  const inactiveTabBgColor = content?.inactiveTabBgColor || '#ffffff';
  const inactiveTabTextColor = content?.inactiveTabTextColor || '#1e293b';

  const features: ErpFeature[] = (content?.features && content.features.length > 0)
    ? content.features
    : [
      {
        id: 'live-90-days',
        icon: '',
        image: '/ErpOverview/featureTav1.png',
        title: 'Go Live in 90 Days Industry average 9 months.',
        desc: 'Go Live in 90 Days; Industry average 9 months.',
        desc2: "Our average: 90 days. That's an entire quarter of ROI your competitors won't see until Q3. We've done this 1,500+ times.",
      },
      {
        id: 'shorten-adoption',
        icon: '',
        image: '/ErpOverview/ERP-2.png',
        title: 'Shorten Adoption. No Training Costs.',
        desc: 'Shorten Adoption & Eliminate Training Costs.',
        desc2: 'Intuitive AI-driven user experience ensures immediate user adoption without costly classroom training sessions.',
      },
      {
        id: 'built-for-business',
        icon: '',
        image: '/ErpOverview/ERP-3.png',
        title: 'Built to Your Business—not Against It',
        desc: 'Built to Your Business—not Against It.',
        desc2: 'Configurable workflows and modular architecture adapt directly to your enterprise operational flows.',
      },
      {
        id: 'proven-scale',
        icon: '',
        image: '/ErpOverview/ERP-4.png',
        title: 'Proven 1:1 Enterprise Scale',
        desc: 'Proven 1:1 Enterprise Scale.',
        desc2: 'Engineered for multi-entity conglomerates with multi-currency ledgers and high-velocity transaction volume.',
      },
    ];

  const [activeTabId, setActiveTabId] = useState(features[0]?.id || '0');
  const activeTab = features.find((f, idx) => (f.id || idx.toString()) === activeTabId) || features[0];

  return (
    <section
      className="relative w-full py-12 md:py-16 overflow-hidden border-b border-purple-100 font-sans"
      style={{ backgroundColor: bgColor, color: headingColor }}
    >
      {/* Background soft ambient glow */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight leading-tight mb-2.5" style={{ color: headingColor }}>
              {renderFormattedHeading(heading, headingSecondaryColor, highlightedWordIndices)}
            </h2>
          </MotionSection>

          <MotionSection variant="fadeUp" delay={0.15}>
            <p
              className="text-base md:text-lg font-normal leading-relaxed"
              style={{ color: subheadingTextColor }}
            >
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Main Card Container */}
        <div
          className="max-w-6xl mx-auto rounded-[28px] p-6 sm:p-7 lg:p-8 border border-purple-100/80 shadow-[0_15px_45px_rgba(147,51,234,0.06)] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
          style={{ backgroundColor: cardBgColor }}
        >

          {/* Left Column: Sidebar Tab Pill Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 w-full relative z-10">
            {features.map((feature, idx) => {
              const currentId = feature.id || idx.toString();
              const isActive = currentId === activeTabId;
              const iconSrc = typeof feature.icon === 'string' ? feature.icon.trim() : '';
              const DefaultIcon = defaultIcons[idx % defaultIcons.length] || Check;
              const tabTextColor = isActive ? activeTabTextColor : inactiveTabTextColor;

              return (
                <motion.button
                  key={currentId}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  onClick={() => setActiveTabId(currentId)}
                  className={`w-full text-left p-3 md:p-3.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-3 group border ${isActive
                      ? 'border-purple-200/50 shadow-md scale-[1.01]'
                      : 'border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:opacity-90'
                    }`}
                  style={{
                    backgroundColor: isActive ? activeTabBgColor : inactiveTabBgColor,
                    color: tabTextColor,
                  }}
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                        ? 'bg-white/20 backdrop-blur-xs'
                        : 'bg-purple-50 border border-purple-100 group-hover:scale-105'
                      }`}
                    style={{ color: tabTextColor }}
                  >
                    {iconSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={encodeURI(iconSrc)}
                        alt={feature.title || 'Tab Icon'}
                        className={`w-4 h-4 object-contain ${isActive ? 'invert brightness-200' : ''}`}
                      />
                    ) : isActive ? (
                      <Check className="w-4 h-4 stroke-[2.5]" style={{ color: activeTabTextColor }} />
                    ) : (
                      <DefaultIcon className="w-4 h-4" style={{ color: inactiveTabTextColor }} />
                    )}
                  </div>

                  {/* Tab Title Text */}
                  <span
                    className="font-bold text-xs md:text-sm leading-snug line-clamp-2"
                    style={{ color: tabTextColor }}
                  >
                    {feature.title}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Tab Active Content Pane */}
          <div className="lg:col-span-7 w-full border-t lg:border-t-0 lg:border-l border-purple-100/80 pt-6 lg:pt-0 lg:pl-10 flex flex-col justify-center min-h-[280px] relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id || activeTabId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Top Circular Illustration Container */}
                <div className="flex items-center justify-center mb-4 p-3 shrink-0">
                  <img
                    src={activeTab?.image || '/ErpOverview/featureTav1.png'}
                    alt={activeTab.title || 'Feature Illustration'}
                    className="w-20 h-20 md:w-26 md:h-26 object-contain"
                  />
                </div>

                {/* Content Descriptions */}
                <div
                  className="space-y-3 max-w-lg [&_*]:!text-inherit"
                  style={{ color: descriptionTextColor }}
                >
                  {activeTab.desc && (
                    <div className="text-sm md:text-base font-normal leading-relaxed">
                      {renderHighlightedText(activeTab.desc)}
                    </div>
                  )}
                  {activeTab.desc2 && (
                    <div className="text-sm md:text-base font-normal leading-relaxed opacity-90">
                      {renderHighlightedText(activeTab.desc2)}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Wave Decorative Background SVG Pattern */}
          <div className="absolute bottom-0 right-0 w-80 h-32 opacity-25 pointer-events-none -mb-4 -mr-4">
            <svg viewBox="0 0 400 160" fill="none" className="w-full h-full text-purple-300">
              <path d="M0 120C100 140 200 80 300 110C400 140 500 90 600 120V160H0V120Z" fill="currentColor" opacity="0.5" />
              <path d="M0 140C120 160 240 100 360 130C480 160 600 110 720 140V160H0V140Z" fill="currentColor" opacity="0.8" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}

function renderFormattedHeading(text: string, secondaryColor?: string, highlightedWordIndices?: number[]) {
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean);

  if (highlightedWordIndices && highlightedWordIndices.length > 0) {
    return (
      <>
        {words.map((word, idx) => {
          const isHighlight = highlightedWordIndices.includes(idx);
          return (
            <span
              key={idx}
              style={{ color: isHighlight ? (secondaryColor || '#6B26D9') : undefined }}
            >
              {word}{' '}
            </span>
          );
        })}
      </>
    );
  }

  if (text.toLowerCase().includes('ebizframe.ai')) {
    const parts = text.split(/(ebizframe\.ai)/i);
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === 'ebizframe.ai' ? (
            <span key={idx} style={{ color: secondaryColor || '#6B26D9' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }
  return text;
}

function renderHighlightedText(text: string) {
  if (!text) return null;
  return <FormattedText content={text} />;
}

export default ErpFeaturesTab;

'use client';

import React from 'react';
import { Target, Rocket, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MissionVisionItem {
  title?: string;
  description?: string;
  image?: string;
  subItems?: string[];
}

export interface AboutUsMissionVisionContent {
  badge?: string;
  title?: string;
  titlePrimaryColor?: string;
  titleSecondaryColor?: string;
  visionIcon?: string;
  visionTitle?: string;
  visionDescription?: string;
  visionPoints?: string[];
  missionIcon?: string;
  missionTitle?: string;
  missionDescription?: string;
  missionPoints?: string[];
  items?: MissionVisionItem[];
  bgGradientFrom?: string;
  bgGradientVia?: string;
  bgGradientTo?: string;
  badgeTextColor?: string;
  badgeLineColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardHoverBorderColor?: string;
  cardTitleTextColor?: string;
  cardDescriptionTextColor?: string;
  pointTextColor?: string;
  visionAccentColor?: string;
  missionAccentColor?: string;
  visionCheckColor?: string;
  missionCheckColor?: string;
  iconOuterBgFrom?: string;
  iconOuterBgTo?: string;
  iconInnerBgColor?: string;
}

export interface AboutUsMissionVisionProps {
  content?: AboutUsMissionVisionContent;
}

export function AboutUsMissionVision({ content }: AboutUsMissionVisionProps) {
  const badge = content?.badge || 'OUR PURPOSE';
  const title = content?.title || 'Building technology that transforms businesses.';
  const titlePrimaryColor = content?.titlePrimaryColor || '#1E1B4B';
  const titleSecondaryColor = content?.titleSecondaryColor || '#9333EA';

  const bgGradientFrom = content?.bgGradientFrom || '#F3E8FF';
  const bgGradientVia = content?.bgGradientVia || '#F8F3FF';
  const bgGradientTo = content?.bgGradientTo || '#FAF8FF';
  const badgeTextColor = content?.badgeTextColor || '#9333EA';
  const badgeLineColor = content?.badgeLineColor || '#d8b4fe';
  const cardBgColor = content?.cardBgColor || '#ffffff';
  const cardBorderColor = content?.cardBorderColor || 'rgba(243, 232, 255, 0.7)';
  const cardHoverBorderColor = content?.cardHoverBorderColor || 'rgba(168, 85, 247, 0.45)';
  const cardTitleTextColor = content?.cardTitleTextColor || '#1E1B4B';
  const cardDescriptionTextColor = content?.cardDescriptionTextColor || '#64748b';
  const pointTextColor = content?.pointTextColor || '#334155';
  const visionAccentColor = content?.visionAccentColor || '#a855f7';
  const missionAccentColor = content?.missionAccentColor || '#3b82f6';
  const visionCheckColor = content?.visionCheckColor || '#9333EA';
  const missionCheckColor = content?.missionCheckColor || '#2563eb';
  const iconOuterBgFrom = content?.iconOuterBgFrom || 'rgba(243, 232, 255, 0.8)';
  const iconOuterBgTo = content?.iconOuterBgTo || '#eef2ff';
  const iconInnerBgColor = content?.iconInnerBgColor || '#ffffff';

  const visionCard = {
    title: content?.visionTitle || content?.items?.[0]?.title || 'Our Vision',
    description:
      content?.visionDescription ||
      content?.items?.[0]?.description ||
      'To be the trusted digital transformation partner enabling enterprises globally to grow through smarter, adaptive, future-ready technology solutions.',
    icon: content?.visionIcon || content?.items?.[0]?.image,
    points: content?.visionPoints || content?.items?.[0]?.subItems || [
      'Leadership through technological excellence',
      'Foster a culture of collaboration and continuous learning',
      'Partner with clients to drive sustainable business growth',
    ],
  };

  const missionCard = {
    title: content?.missionTitle || content?.items?.[1]?.title || 'Our Mission',
    description:
      content?.missionDescription ||
      content?.items?.[1]?.description ||
      'We enable organizations run, scale, and transform their businesses by delivering AI-powered ERP solutions, BI, RPA, Mobility solutions on Cloud-ready technologies backed by our deep industry expertise.',
    icon: content?.missionIcon || content?.items?.[1]?.image,
    points: content?.missionPoints || content?.items?.[1]?.subItems || [
      'Focus on delivering measurable business value',
      'Commitment to continuous innovation and quality',
      'Customer-centric approach to software development',
    ],
  };

  const cards = [
    { ...visionCard, isVision: true },
    { ...missionCard, isVision: false },
  ];

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden font-sans border-b"
      style={{
        background: `linear-gradient(to bottom, ${bgGradientFrom}, ${bgGradientVia}, ${bgGradientTo})`,
      }}
    >
      <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-96 opacity-40 pointer-events-none bg-[radial-gradient(#a855f7_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-96 opacity-40 pointer-events-none bg-[radial-gradient(#a855f7_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 md:mb-20">
          {badge && (
            <div className="inline-flex items-center gap-3">
              <span className="w-6 h-[1px]" style={{ backgroundColor: badgeLineColor }} />
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: badgeTextColor }}
              >
                {badge}
              </span>
              <span className="w-6 h-[1px]" style={{ backgroundColor: badgeLineColor }} />
            </div>
          )}

          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight leading-tight"
            >
              {renderFormattedTitle(title, titlePrimaryColor, titleSecondaryColor)}
            </motion.h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto items-stretch">
          {cards.map((card, index) => {
            const isVision = card.isVision;
            const customIcon = card.icon && typeof card.icon === 'string' ? card.icon.trim() : '';
            const accentColor = isVision ? visionAccentColor : missionAccentColor;
            const checkColor = isVision ? visionCheckColor : missionCheckColor;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-[32px] p-8 sm:p-10 shadow-[0_15px_40px_-10px_rgba(147,51,234,0.07)] hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between group border"
                style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cardHoverBorderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = cardBorderColor;
                }}
              >
                <div className="w-full">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-150/60 relative mx-auto group-hover:scale-105 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to top right, ${iconOuterBgFrom}, ${iconOuterBgTo})`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner overflow-hidden p-2"
                      style={{ backgroundColor: iconInnerBgColor }}
                    >
                      {customIcon ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={encodeURI(customIcon)}
                          alt={card.title || ''}
                          className="w-10 h-10 object-contain"
                        />
                      ) : isVision ? (
                        <Target className="w-8 h-8" style={{ color: visionCheckColor }} />
                      ) : (
                        <Rocket className="w-8 h-8" style={{ color: missionCheckColor }} />
                      )}
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-extrabold mb-2"
                    style={{ color: cardTitleTextColor }}
                  >
                    {card.title}
                  </h3>
                  <div
                    className="w-8 h-1 rounded-full mb-6 mx-auto"
                    style={{ backgroundColor: accentColor }}
                  />
                  <p
                    className="font-normal text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto"
                    style={{ color: cardDescriptionTextColor }}
                  >
                    {card.description}
                  </p>
                </div>

                {card.points && card.points.length > 0 && (
                  <div className="w-full max-w-md mx-auto space-y-3.5 pt-6 border-t border-slate-100">
                    {card.points.map((subItem, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-left">
                        <CheckCircle2
                          className="w-5 h-5 shrink-0 mt-0.5"
                          style={{ color: checkColor }}
                        />
                        <span
                          className="text-xs sm:text-sm font-medium leading-snug"
                          style={{ color: pointTextColor }}
                        >
                          {subItem}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderFormattedTitle(titleText: string, primaryColor: string, secondaryColor: string) {
  if (!titleText) return null;
  if (typeof titleText === 'string' && titleText.includes('<') && titleText.includes('>')) {
    return <span dangerouslySetInnerHTML={{ __html: titleText }} />;
  }
  if (titleText.toLowerCase().includes('transforms')) {
    const regex = /(transforms)/i;
    const parts = titleText.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === 'transforms' ? (
            <span key={i} style={{ color: secondaryColor }}>
              {part}
            </span>
          ) : (
            <span key={i} style={{ color: primaryColor }}>
              {part}
            </span>
          )
        )}
      </>
    );
  }
  return <span style={{ color: primaryColor }}>{titleText}</span>;
}

export default AboutUsMissionVision;

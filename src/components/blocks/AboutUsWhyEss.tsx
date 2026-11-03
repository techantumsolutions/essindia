'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface TrustCard {
  image?: string;
  icon?: string;
  iconUrl?: string;
  title?: string;
  description?: string;
}

interface AboutUsWhyEssContent {
  badge?: string;
  title?: string;
  primaryTitleColor?: string;
  secondaryTitleColor?: string;
  titlePrimaryColor?: string;
  titleSecondaryColor?: string;
  description?: string;
  items?: TrustCard[];
  bgColor?: string;
  sectionBorderColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeTextColor?: string;
  badgeIconColor?: string;
  descriptionTextColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardTitleTextColor?: string;
  cardDescriptionTextColor?: string;
  cardIconBgColor?: string;
  cardIconBorderColor?: string;
  cardIconColor?: string;
}

interface AboutUsWhyEssProps {
  content?: AboutUsWhyEssContent;
}

const defaultTrustCards: TrustCard[] = [
  {
    title: 'Business-First Implementation',
    description:
      'We build around your business and not the other way around. Every solution starts with understanding your processes, goals, and the way your teams actually work.',
  },
  {
    title: 'Faster Deployment, Product-Focused',
    description:
      'We leverage proven frameworks and pre-built accelerators to shorten implementation timelines, reduce complexity, and help you realize value sooner.',
  },
  {
    title: 'Global Expertise with Local Support',
    description:
      'With 20+ years of experience across industries and geographies, we combine global best practices with responsive local support at every stage.',
  },
  {
    title: 'Designed for Securing Digital Future',
    description:
      'With state-of-the-art security frameworks (including SOC 2 and GDPR compliance), we build trust at every layer.',
  },
  {
    title: 'One Connected Technology Ecosystem',
    description:
      'From ERP and AI to BI, RPA, and mobile applications, we bring your business together on a unified digital foundation.',
  },
  {
    title: 'Proven Across Industries',
    description:
      'Having delivered solutions across 25+ industry verticals, we understand the operational realities behind every business.',
  },
];

export function AboutUsWhyEss({ content }: AboutUsWhyEssProps) {
  const badge = content?.badge || 'Trusted. Proven. Preferred.';
  const title = content?.title || 'Why Businesses Trust ESS';
  const primaryTitleColor = content?.primaryTitleColor || content?.titlePrimaryColor || '#FFFFFF';
  const secondaryTitleColor = content?.secondaryTitleColor || content?.titleSecondaryColor || '#C084FC';
  const description =
    content?.description ||
    'Trusted by organizations worldwide for practical expertise, enterprise technology, and a business-first approach to digital transformation.';
  const trustCards = content?.items && content.items.length > 0 ? content.items : defaultTrustCards;

  const bgColor = content?.bgColor || '#0B0424';
  const sectionBorderColor = content?.sectionBorderColor || 'rgba(59, 7, 100, 0.6)';
  const badgeBgColor = content?.badgeBgColor || 'rgba(28, 15, 69, 0.9)';
  const badgeBorderColor = content?.badgeBorderColor || 'rgba(168, 85, 247, 0.35)';
  const badgeTextColor = content?.badgeTextColor || '#D8C4FE';
  const badgeIconColor = content?.badgeIconColor || '#C084FC';
  const descriptionTextColor = content?.descriptionTextColor || 'rgba(255,255,255,0.8)';
  const cardBgColor = content?.cardBgColor || 'rgba(21, 10, 55, 0.8)';
  const cardBorderColor = content?.cardBorderColor || 'rgba(168, 85, 247, 0.25)';
  const cardTitleTextColor = content?.cardTitleTextColor || '#ffffff';
  const cardDescriptionTextColor = content?.cardDescriptionTextColor || 'rgba(255,255,255,0.75)';
  const cardIconBgColor = content?.cardIconBgColor || 'rgba(32, 13, 82, 0.8)';
  const cardIconBorderColor = content?.cardIconBorderColor || 'rgba(192, 132, 252, 0.4)';
  const cardIconColor = content?.cardIconColor || '#C084FC';

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden font-sans border-b"
      style={{ backgroundColor: bgColor, borderColor: sectionBorderColor }}
    >
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-600/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-600/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-96 opacity-15 pointer-events-none bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-96 opacity-15 pointer-events-none bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14 md:mb-18">
          {badge && (
            <div
              className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full shadow-sm mb-2 border"
              style={{ backgroundColor: badgeBgColor, borderColor: badgeBorderColor }}
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: badgeIconColor }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: badgeTextColor }}>
                {badge}
              </span>
            </div>
          )}

          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-tight leading-tight"
            >
              {renderFormattedTitle(title, primaryTitleColor, secondaryTitleColor)}
            </motion.h2>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto pt-1"
              style={{ color: descriptionTextColor }}
            >
              {description}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustCards.map((card, index) => {
            const rawIcon = card.image || card.icon || card.iconUrl || '';
            const iconSrc = typeof rawIcon === 'string' ? rawIcon.trim() : '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="backdrop-blur-xl rounded-[24px] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[240px] border"
                style={{ backgroundColor: cardBgColor, borderColor: cardBorderColor }}
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 relative border"
                    style={{
                      backgroundColor: cardIconBgColor,
                      borderColor: cardIconBorderColor,
                      color: cardIconColor,
                    }}
                  >
                    {iconSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={encodeURI(iconSrc)}
                        alt={card.title || 'Trust Card Icon'}
                        className="w-9 h-9 object-contain"
                      />
                    ) : (
                      <DefaultTrustIcon index={index} color={cardIconColor} />
                    )}
                  </div>

                  <h3
                    className="text-base sm:text-lg font-extrabold mb-2.5 leading-snug"
                    style={{ color: cardTitleTextColor }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-normal leading-relaxed"
                    style={{ color: cardDescriptionTextColor }}
                  >
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderFormattedTitle(titleText: string, primaryColor?: string, secondaryColor?: string) {
  if (!titleText) return null;
  if (typeof titleText === 'string' && titleText.includes('<') && titleText.includes('>')) {
    return <span dangerouslySetInnerHTML={{ __html: titleText }} />;
  }
  const pColor = primaryColor || '#FFFFFF';
  const sColor = secondaryColor || '#C084FC';
  const words = titleText.trim().split(/\s+/);
  if (words.length < 4) {
    return <span style={{ color: pColor }}>{titleText}</span>;
  }
  return (
    <>
      {words.map((word, i) => {
        const is4thWord = i === 3;
        return (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            <span style={{ color: is4thWord ? sColor : pColor }}>{word}</span>
          </React.Fragment>
        );
      })}
    </>
  );
}

function DefaultTrustIcon({ index, color }: { index: number; color: string }) {
  const stroke = color || '#C084FC';
  const icons = [
    <svg key="1" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="1.8" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12v3m-3-1.5h6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>,
    <svg key="2" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="2.5" strokeWidth="1.8" />
      <circle cx="18" cy="6" r="2.5" strokeWidth="1.8" />
      <circle cx="12" cy="18" r="2.5" strokeWidth="1.8" />
      <path d="M8.5 6h7M7.5 8.5l3 7M16.5 8.5l-3 7" strokeWidth="1.8" strokeLinecap="round" />
    </svg>,
    <svg key="3" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" strokeWidth="1.8" />
      <path d="M6 20v-1a5 5 0 0110 0v1" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 2v2m8 8h2M2 12h2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>,
    <svg key="4" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    <svg key="5" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
      <circle cx="12" cy="4" r="2" strokeWidth="1.8" />
      <circle cx="20" cy="12" r="2" strokeWidth="1.8" />
      <circle cx="12" cy="20" r="2" strokeWidth="1.8" />
      <circle cx="4" cy="12" r="2" strokeWidth="1.8" />
      <path d="M12 7v2m5 3h2m-7 5v2m-5-7H4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>,
    <svg key="6" className="w-8 h-8" fill="none" stroke={stroke} viewBox="0 0 24 24">
      <rect x="4" y="13" width="4" height="7" rx="1" strokeWidth="1.8" />
      <rect x="10" y="9" width="4" height="11" rx="1" strokeWidth="1.8" />
      <rect x="16" y="4" width="4" height="16" rx="1" strokeWidth="1.8" />
    </svg>,
  ];
  return icons[index % icons.length];
}

export default AboutUsWhyEss;

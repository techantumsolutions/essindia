'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

interface CapabilityItem {
  title: string;
  description: string;
  icon?: string;
}

export interface RpaCapabilitiesContent {
  title?: string;
  primaryTitleColor?: string;
  secondaryTitleColor?: string;
  description?: string;
  descriptionTextColor?: string;
  bgColor?: string;
  hubSubtitle?: string;
  hubSubtitleTextColor?: string;
  hubTitle?: string;
  hubTitleTextColor?: string;
  hubBgColor?: string;
  hubBorderColor?: string;
  mobileHubGradientFrom?: string;
  mobileHubGradientTo?: string;
  mobileHubSubtitleTextColor?: string;
  mobileHubTitleTextColor?: string;
  cardBgColor?: string;
  cardTitleTextColor?: string;
  cardDescriptionTextColor?: string;
  cardIconBgColor?: string;
  cardIconBorderColor?: string;
  cardAccentFrom?: string;
  cardAccentVia?: string;
  cardAccentTo?: string;
  connectorLineColor?: string;
  connectorDotColor?: string;
  connectorDotStrokeColor?: string;
  items?: CapabilityItem[];
}

interface CardColors {
  cardBgColor: string;
  cardTitleTextColor: string;
  cardDescriptionTextColor: string;
  cardIconBgColor: string;
  cardIconBorderColor: string;
  cardAccentFrom: string;
  cardAccentVia: string;
  cardAccentTo: string;
}

function renderFormattedTitle(titleText: string, primaryColor: string, secondaryColor: string) {
  if (!titleText) return null;
  if (typeof titleText === 'string' && (titleText.includes('<') && titleText.includes('>'))) {
    return <span dangerouslySetInnerHTML={{ __html: titleText }} />;
  }
  const words = titleText.trim().split(/\s+/);
  if (words.length <= 1) {
    return <span style={{ color: primaryColor }}>{titleText}</span>;
  }
  const splitIndex = words.length >= 4 ? 3 : Math.ceil(words.length / 2);
  const primaryText = words.slice(0, splitIndex).join(' ');
  const secondaryText = words.slice(splitIndex).join(' ');

  return (
    <>
      <span style={{ color: primaryColor }}>{primaryText}</span>{' '}
      <span style={{ color: secondaryColor }}>{secondaryText}</span>
    </>
  );
}

export function RpaCapabilities({ content }: { content?: RpaCapabilitiesContent }) {
  const title = content?.title || 'Our RPA Expertise Across the Automation Lifecycle';
  const primaryTitleColor = content?.primaryTitleColor || '#6B21A8';
  const secondaryTitleColor = content?.secondaryTitleColor || '#1E1B4B';
  const description =
    content?.description ||
    "We don't force your processes into a rigid automation template. Our AI automation solutions are built around the way you already work, where RPA and AI operate as a spectrum, not a choice.";
  const descriptionTextColor = content?.descriptionTextColor || '#64748b';
  const bgColor = content?.bgColor || '#FAFAFD';

  const hubSubtitle = content?.hubSubtitle !== undefined && content?.hubSubtitle !== '' ? content.hubSubtitle : 'ESS INDIA';
  const hubTitle = content?.hubTitle !== undefined && content?.hubTitle !== '' ? content.hubTitle : 'RPA Core Offerings';
  const hubSubtitleTextColor = content?.hubSubtitleTextColor || '#9333EA';
  const hubTitleTextColor = content?.hubTitleTextColor || '#1E1B4B';
  const hubBgColor = content?.hubBgColor || '#ffffff';
  const hubBorderColor = content?.hubBorderColor || '#f3e8ff';
  const mobileHubGradientFrom = content?.mobileHubGradientFrom || '#581c87';
  const mobileHubGradientTo = content?.mobileHubGradientTo || '#1e1b4b';
  const mobileHubSubtitleTextColor = content?.mobileHubSubtitleTextColor || '#d8b4fe';
  const mobileHubTitleTextColor = content?.mobileHubTitleTextColor || '#ffffff';

  const cardColors: CardColors = {
    cardBgColor: content?.cardBgColor || '#ffffff',
    cardTitleTextColor: content?.cardTitleTextColor || '#0f172a',
    cardDescriptionTextColor: content?.cardDescriptionTextColor || '#64748b',
    cardIconBgColor: content?.cardIconBgColor || '#faf5ff',
    cardIconBorderColor: content?.cardIconBorderColor || '#f3e8ff',
    cardAccentFrom: content?.cardAccentFrom || '#9333ea',
    cardAccentVia: content?.cardAccentVia || '#6366f1',
    cardAccentTo: content?.cardAccentTo || '#7e22ce',
  };

  const connectorLineColor = content?.connectorLineColor || '#C084FC';
  const connectorDotColor = content?.connectorDotColor || '#9333EA';
  const connectorDotStrokeColor = content?.connectorDotStrokeColor || '#F3E8FF';

  const defaultItems: CapabilityItem[] = [
    {
      title: 'ERP-Agnostic Execution',
      description: 'Works seamlessly across your ERP, CRM, and enterprise systems without requiring changes to your existing setup.',
      icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png',
    },
    {
      title: 'Enterprise Monitoring & Governance',
      description: 'Provides complete visibility with audit trails, executive dashboards, role-based access, and process analytics.',
      icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png',
    },
    {
      title: 'Business-First Automation Approach',
      description: 'Designed around real business processes, ensuring automation aligns with your goals, teams, and customers.',
      icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png',
    },
    {
      title: 'Scalable Automation',
      description: 'Deploy individual AI Agents or automate multiple business functions while maintaining consistency across operations.',
      icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png',
    },
    {
      title: 'AI-Enhanced Automation',
      description: 'Combines the reliability of rule-based automation with intelligent decision-making, delivering AI-powered workflow automation that keeps processes moving without manual intervention.',
      icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png',
    },
    {
      title: 'Proven Delivery Framework',
      description: 'From process discovery to implementation and scale, driven by a structured approach focused on measurable outcomes.',
      icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png',
    },
  ];

  const rawItems = content?.items && content.items.length > 0 ? content.items : defaultItems;
  const items = Array.from({ length: 6 }, (_, i) => rawItems[i] || defaultItems[i] || defaultItems[0]);

  const topCenterItem = items[0];
  const leftTopItem = items[1];
  const rightTopItem = items[2];
  const leftBottomItem = items[3];
  const bottomCenterItem = items[4];
  const rightBottomItem = items[5];

  return (
    <section
      className="py-14 font-sans border-t border-b border-slate-100 overflow-hidden relative"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">

        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14 md:mb-20">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-[38px] font-extrabold tracking-tight leading-tight"
            >
              {renderFormattedTitle(title, primaryTitleColor, secondaryTitleColor)}
            </motion.h2>
          )}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-normal text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto [&_*]:!text-inherit"
              style={{ color: descriptionTextColor }}
            >
              <FormattedText content={description} />
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block relative w-full max-w-[1020px] h-[680px] mx-auto select-none">

          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1020 680" fill="none">
              <line x1="510" y1="340" x2="510" y2="180" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="510" cy="180" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />

              <line x1="510" y1="340" x2="320" y2="210" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="320" cy="210" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />

              <line x1="510" y1="340" x2="700" y2="210" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="700" cy="210" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />

              <line x1="510" y1="340" x2="320" y2="470" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="320" cy="470" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />

              <line x1="510" y1="340" x2="510" y2="500" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="510" cy="500" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />

              <line x1="510" y1="340" x2="700" y2="470" stroke={connectorLineColor} strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="700" cy="470" r="4.5" fill={connectorDotColor} stroke={connectorDotStrokeColor} strokeWidth="2" />
            </svg>
          </div>

          <div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.12)] flex flex-col items-center justify-center p-4 text-center z-20 group hover:scale-105 transition-transform duration-300 border"
            style={{ backgroundColor: hubBgColor, borderColor: hubBorderColor }}
          >
            {hubSubtitle && (
              <span
                className="text-[10px] uppercase font-black tracking-widest mb-1"
                style={{ color: hubSubtitleTextColor }}
              >
                {hubSubtitle}
              </span>
            )}
            {hubTitle && (
              <h3
                className="text-lg font-black leading-tight text-center"
                style={{ color: hubTitleTextColor }}
              >
                {hubTitle}
              </h3>
            )}
          </div>

          <div className="absolute top-0 left-[50%] -translate-x-1/2 z-10 w-[340px] h-[180px]">
            <OrbitalCard item={topCenterItem} index={1} colors={cardColors} />
          </div>
          <div className="absolute top-[120px] left-0 z-10 w-[320px] h-[180px]">
            <OrbitalCard item={leftTopItem} index={2} colors={cardColors} />
          </div>
          <div className="absolute top-[120px] right-0 z-10 w-[320px] h-[180px]">
            <OrbitalCard item={rightTopItem} index={3} colors={cardColors} />
          </div>
          <div className="absolute bottom-[120px] left-0 z-10 w-[320px] h-[180px]">
            <OrbitalCard item={leftBottomItem} index={4} colors={cardColors} />
          </div>
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 z-10 w-[340px] h-[180px]">
            <OrbitalCard item={bottomCenterItem} index={5} colors={cardColors} />
          </div>
          <div className="absolute bottom-[120px] right-0 z-10 w-[320px] h-[180px]">
            <OrbitalCard item={rightBottomItem} index={6} colors={cardColors} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
          <div
            className="sm:col-span-2 rounded-2xl p-6 text-center shadow-lg mb-2"
            style={{
              backgroundImage: `linear-gradient(to right, ${mobileHubGradientFrom}, ${mobileHubGradientTo})`,
            }}
          >
            {hubSubtitle && (
              <span
                className="text-[10px] uppercase font-black tracking-widest block mb-1"
                style={{ color: mobileHubSubtitleTextColor }}
              >
                {hubSubtitle}
              </span>
            )}
            {hubTitle && (
              <h3
                className="text-xl font-extrabold"
                style={{ color: mobileHubTitleTextColor }}
              >
                {hubTitle}
              </h3>
            )}
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="h-[200px]">
              <OrbitalCard item={item} index={idx + 1} colors={cardColors} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function OrbitalCard({
  item,
  index,
  colors,
}: {
  item: CapabilityItem;
  index: number;
  colors: CardColors;
}) {
  const iconSrc = typeof item?.icon === 'string' ? item.icon.trim() : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl p-5 border shadow-[0_8px_25px_-5px_rgba(107,33,168,0.06)] relative overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_20px_40px_-5px_rgba(107,33,168,0.14)] hover:-translate-y-1 group z-10 h-full justify-between"
      style={{
        backgroundColor: colors.cardBgColor,
        borderColor: colors.cardIconBorderColor,
      }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0 border"
        style={{
          backgroundColor: colors.cardIconBgColor,
          borderColor: colors.cardIconBorderColor,
          color: colors.cardAccentFrom,
        }}
      >
        {iconSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={encodeURI(iconSrc)}
            alt={item.title || 'Capability Icon'}
            className="w-5 h-5 object-contain"
          />
        ) : (
          <DefaultCapabilityIcon index={index} color={colors.cardAccentFrom} />
        )}
      </div>

      <div className="space-y-1 mb-1 flex-1 flex flex-col justify-center">
        <h4
          className="text-sm font-extrabold leading-snug line-clamp-1"
          style={{ color: colors.cardTitleTextColor }}
        >
          {item.title}
        </h4>
        <div
          className="text-xs font-normal leading-relaxed line-clamp-3 [&_*]:!text-inherit"
          style={{ color: colors.cardDescriptionTextColor }}
        >
          <FormattedText content={item.description} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.cardAccentFrom}, ${colors.cardAccentVia}, ${colors.cardAccentTo})`,
        }}
      />
    </motion.div>
  );
}

function DefaultCapabilityIcon({ index, color }: { index: number; color: string }) {
  const iconPaths = [
    <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    <path key="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    <path key="5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    <path key="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  ];

  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color }}>
      {iconPaths[(index - 1) % iconPaths.length]}
    </svg>
  );
}

export default RpaCapabilities;

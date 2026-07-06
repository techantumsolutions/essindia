'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface EuropeCommonSettings {
  hideSection?: boolean;
  internalName?: string;
  anchorId?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  containerWidth?: string;
  sectionPaddingTop?: string;
  sectionPaddingBottom?: string;
  theme?: string;
  textAlignment?: string;
  customClasses?: string;
}

const CONTAINER_WIDTH_MAP: Record<string, string> = {
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

const PADDING_TOP_MAP: Record<string, string> = {
  'pt-24': 'pt-24',
  'pt-32': 'pt-32',
  'pt-40': 'pt-40',
  'pt-14': 'pt-14',
  none: 'pt-0',
};

const PADDING_BOTTOM_MAP: Record<string, string> = {
  'pb-14': 'pb-14',
  'pb-24': 'pb-24',
  'pb-32': 'pb-32',
  none: 'pb-0',
};

const ALIGNMENT_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function getEuropeSectionClasses(content?: EuropeCommonSettings) {
  return {
    sectionClass: cn(
      'relative overflow-hidden',
      PADDING_TOP_MAP[content?.sectionPaddingTop || ''] || content?.sectionPaddingTop || 'pt-14',
      PADDING_BOTTOM_MAP[content?.sectionPaddingBottom || ''] || content?.sectionPaddingBottom || 'pb-14',
      ALIGNMENT_MAP[content?.textAlignment || ''] || '',
      content?.customClasses || ''
    ),
    containerClass: cn(
      'container mx-auto px-4 md:px-6 lg:px-8',
      CONTAINER_WIDTH_MAP[content?.containerWidth || ''] || content?.containerWidth || 'max-w-7xl'
    ),
    sectionStyle: {
      backgroundColor: content?.backgroundColor || undefined,
      backgroundImage: content?.backgroundImage ? `url(${content.backgroundImage})` : undefined,
      backgroundSize: content?.backgroundImage ? 'cover' : undefined,
      backgroundPosition: content?.backgroundImage ? 'center' : undefined,
    } as React.CSSProperties,
  };
}

interface EuropeSectionShellProps {
  content?: EuropeCommonSettings;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function EuropeSectionShell({ content, className, style, children }: EuropeSectionShellProps) {
  if (content?.hideSection) return null;

  const { sectionClass, containerClass, sectionStyle } = getEuropeSectionClasses(content);

  return (
    <section
      id={content?.anchorId || undefined}
      data-internal-name={content?.internalName || undefined}
      data-theme={content?.theme || undefined}
      className={cn(sectionClass, className)}
      style={{ ...sectionStyle, ...style }}
    >
      <div className={containerClass}>{children}</div>
    </section>
  );
}

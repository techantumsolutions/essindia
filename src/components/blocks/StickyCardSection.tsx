'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, ExternalLink, X } from 'lucide-react';

export interface StickyCardContent {
  image?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  buttonText?: string;
  documentUrl?: string;
  redirectUrl?: string;
}

interface StickyCardSectionProps {
  content?: StickyCardContent;
}

export function StickyCardSection({ content }: StickyCardSectionProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const image = content?.image || '/ind-erp.png';
  const title = content?.title || 'Get started with Sage 200';
  const description =
    content?.description ||
    'Find out how Sage 200 can benefit your business and customers.';
  const buttonText = content?.buttonText || 'Download the Sage 200 brochure';
  const rawDocumentUrl = typeof content?.documentUrl === 'string' ? content.documentUrl.trim() : '';
  const rawRedirectUrl = typeof content?.redirectUrl === 'string'
    ? content.redirectUrl.trim()
    : (typeof (content as any)?.buttonUrl === 'string' ? (content as any).buttonUrl.trim() : '');

  const hasDocument = Boolean(rawDocumentUrl && rawDocumentUrl !== '#');
  const hasRedirect = Boolean(!hasDocument && rawRedirectUrl && rawRedirectUrl !== '#');

  const targetUrl = hasDocument ? rawDocumentUrl : (hasRedirect ? rawRedirectUrl : '#');
  const isExternal = rawRedirectUrl.startsWith('http://') || rawRedirectUrl.startsWith('https://');

  return (
    <aside
      aria-label="Featured Information"
      className="fixed bottom-3 right-3 md:bottom-5 md:right-5 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative flex flex-row items-center gap-2.5 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 text-slate-900 group">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1.5 -right-1.5 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-md z-10"
          title="Close card"
          aria-label="Close card"
        >
          <X className="w-2.5 h-2.5" />
        </button>

        {/* Image Thumbnail */}
        {image && (
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title || 'Sticky Card Image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between w-full min-w-0 pr-0.5">
          <div>
            {title && (
              <h3
                className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight mb-0.5 line-clamp-1"
                style={content?.titleColor ? { color: content.titleColor } : undefined}
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight mb-1.5">
                {description}
              </p>
            )}
          </div>

          {/* Action Button / Link */}
          {buttonText && (
            <div>
              {hasRedirect ? (
                <a
                  href={rawRedirectUrl}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 underline underline-offset-2 hover:text-purple-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{buttonText}</span>
                </a>
              ) : hasDocument ? (
                <a
                  href={rawDocumentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 underline underline-offset-2 hover:text-purple-700 transition-colors"
                >
                  <Download className="w-3 h-3 shrink-0" />
                  <span>{buttonText}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 underline underline-offset-2">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{buttonText}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default StickyCardSection;

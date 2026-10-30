'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormattedText } from '@/components/ui/FormattedText';
import { safeImageUrl } from '@/lib/utils';

export interface TestimonialCardItem {
  quote: string;
  author: string;
  role: string;
  image: string;
  videoUrl?: string;
}

export interface Landing2TestimonialsContent {
  title?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  testimonials?: TestimonialCardItem[];
}

const DEFAULT_TESTIMONIALS: TestimonialCardItem[] = [
  {
    quote: '“This is the best sales experience I have ever had!”',
    author: 'Dianne Russell',
    role: 'Founder, ExtendSales',
    image: '/Landing Page-2/assets/3ddf828267cb844171aaad94b1f6da3e7949acbd.png',
  },
  {
    quote: '“I can’t tell how easy it was to grow my small shop with it”',
    author: 'Jenny Wilson',
    role: 'Founder, ExtendSales',
    image: '/Landing Page-2/assets/BG.png',
  },
  {
    quote: '“ESS helped us scale operations across markets with clarity.”',
    author: 'Robert Fox',
    role: 'CEO, MarketHub',
    image: '/Landing Page-2/assets/3ddf828267cb844171aaad94b1f6da3e7949acbd.png',
  },
];

const DEFAULT_CONTENT: Landing2TestimonialsContent = {
  title: 'See what our customers are saying',
  badge: 'TESTIMONIALS',
  subtitle: '2,157 people have said how good we are',
  description: '',
  testimonials: DEFAULT_TESTIMONIALS,
};

function isVideoMedia(rawMedia: string) {
  if (!rawMedia) return false;
  const lower = rawMedia.toLowerCase();
  return Boolean(
    lower.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/) ||
      rawMedia.includes('youtube.com') ||
      rawMedia.includes('vimeo.com') ||
      rawMedia.includes('youtu.be')
  );
}

function TestimonialCard({
  item,
  onVideoClick,
}: {
  item: TestimonialCardItem;
  onVideoClick: (url: string) => void;
}) {
  const rawMedia = (item as any).mediaUrl || item.image || item.videoUrl || '';
  const isVideo = isVideoMedia(rawMedia);
  const imageSrc = safeImageUrl(
    rawMedia,
    '/Landing Page-2/assets/3ddf828267cb844171aaad94b1f6da3e7949acbd.png'
  );

  return (
    <div className="flex flex-col group h-full text-left">
      <div
        onClick={() => isVideo && onVideoClick(rawMedia)}
        className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm border border-slate-200/80 mb-3 bg-slate-200 ${
          isVideo ? 'cursor-pointer group-hover:shadow-md' : ''
        } transition-all duration-300`}
      >
        {isVideo && rawMedia.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/) ? (
          <video
            src={rawMedia}
            className="w-full h-full object-cover"
            controlsList="nodownload"
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <Image
            src={imageSrc}
            alt={item.author || 'Testimonial Image'}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        )}

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {item.quote && (
        <FormattedText
          content={item.quote}
          className="text-slate-900 text-sm md:text-base font-normal leading-snug tracking-tight mb-2"
        />
      )}

      {item.author && (
        <p className="text-slate-900 font-bold text-xs md:text-sm mb-0.5">{item.author}</p>
      )}

      {item.role && (
        <p className="text-slate-500 font-medium text-[11px] md:text-xs">{item.role}</p>
      )}
    </div>
  );
}

export function Landing2Testimonials({ content }: { content?: Landing2TestimonialsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const items =
    data.testimonials && data.testimonials.length > 0 ? data.testimonials : DEFAULT_TESTIMONIALS;

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      clearTimeout(timer);
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement | null;
      const cardWidth = card ? card.offsetWidth + 24 : 340;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-[#f1f3f5] font-sans select-none relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 text-center">
        {data.title && (
          <h2 className="text-slate-900 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.15] mb-2">
            {data.title}
          </h2>
        )}

        {(data.description || data.subtitle) && (
          <p className="text-slate-600 text-sm md:text-base font-medium mb-8 md:mb-10">
            {data.description || data.subtitle}
          </p>
        )}

        {/* Carousel Container with Left/Right Arrows — same pattern as IndustrySection */}
        <div className="relative group/carousel">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll Left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 lg:-translate-x-8 xl:-translate-x-14 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-slate-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll Right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 lg:translate-x-8 xl:translate-x-14 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-slate-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div
            ref={scrollRef}
            className={`flex items-stretch gap-6 overflow-x-auto scroll-smooth py-4 px-1 no-scrollbar snap-x snap-mandatory ${
              items.length < 3 ? 'justify-center' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 w-full sm:w-[280px] md:w-[300px] lg:w-[calc((100%-3rem)/3)] snap-start"
              >
                <TestimonialCard item={item} onVideoClick={setActiveVideoUrl} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
            <iframe
              src={activeVideoUrl}
              title="Customer Testimonial Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

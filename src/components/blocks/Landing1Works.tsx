'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface WorkItem {
  category: string;
  title: string;
  date: string;
  image: string;
  link?: string;
}

export interface Landing1WorksContent {
  badge?: string;
  title?: string;
  description?: string;
  works?: WorkItem[];
}

const DEFAULT_WORKS: WorkItem[] = [
  {
    category: 'Category Name',
    title: "Ghana's leading Producer of Wood Products opts ebizframe ERP",
    date: 'December 18, 2025',
    image: '/Landing page1/assets/image 103.png',
    link: '#'
  },
  {
    category: 'Category Name',
    title: 'Top Cosmetics Manufacturers in DRC opts for ebizframe ERP',
    date: 'December 18, 2025',
    image: '/Landing page1/assets/image 103-1.png',
    link: '#'
  },
  {
    category: 'Category Name',
    title: 'Thika Motors, Kenya chooses ebizframe ERP for their country wide operations',
    date: 'December 18, 2025',
    image: '/Landing page1/assets/image 103-2.png',
    link: '#'
  }
];

const DEFAULT_CONTENT: Landing1WorksContent = {
  badge: 'OUR WORKS',
  title: 'Built For Every Industry',
  description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
  works: DEFAULT_WORKS
};

function getSlideStep(el: HTMLElement) {
  const card = el.firstElementChild as HTMLElement | null;
  const next = card?.nextElementSibling as HTMLElement | null;
  if (card && next) return next.offsetLeft - card.offsetLeft;
  return card?.offsetWidth || el.clientWidth;
}

export function Landing1Works({ content }: { content?: Landing1WorksContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const works = data.works || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const loopingRef = useRef(false);
  const [perView, setPerView] = useState(3);
  const [canScroll, setCanScroll] = useState(false);

  const shouldLoop = works.length > perView;
  loopingRef.current = shouldLoop;
  const slides = shouldLoop ? [...works, ...works] : works;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth - el.clientWidth > 8);
  }, []);

  const normalizeLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !loopingRef.current || works.length === 0) return;
    const cycle = getSlideStep(el) * works.length;
    if (cycle <= 0 || el.scrollLeft < cycle - 1) return;
    const previous = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = el.scrollLeft - cycle;
    el.style.scrollBehavior = previous;
  }, [works.length]);

  const scrollByCard = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getSlideStep(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 8 || step <= 0) return;

    if (direction === 'left' && loopingRef.current && el.scrollLeft <= 8) {
      const cycle = step * works.length;
      const previous = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = el.scrollLeft + cycle;
      el.style.scrollBehavior = previous;
    }

    el.scrollBy({ left: direction === 'right' ? step : -step, behavior: 'smooth' });
  }, [works.length]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setPerView(media.matches ? 3 : 1);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    let settleTimer = 0;
    const onScroll = () => {
      checkScroll();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => normalizeLoop(), 80);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      window.clearTimeout(settleTimer);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, normalizeLoop, slides.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !shouldLoop) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollWidth - el.clientWidth <= 8) return;
      el.scrollBy({ left: getSlideStep(el), behavior: 'smooth' });
    }, 4500);

    return () => window.clearInterval(id);
  }, [shouldLoop, works.length]);

  return (
    <section className="py-20 bg-slate-50 text-slate-900 font-sans select-none border-b border-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {data.badge}
            </span>
          )}
          {data.title && (
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Works carousel — one card on small screens, three from md up, matching the previous grid */}
        <div
          className="relative"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('left')}
              aria-label="Previous works"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-600 shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('right')}
              aria-label="Next works"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-600 shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-stretch gap-8 overflow-x-auto snap-x snap-mandatory py-3 -my-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Works carousel"
          >
          {slides.map((item, idx) => (
            <Link
              key={`${item.title}-${idx}`}
              href={item.link || '#'}
              aria-hidden={shouldLoop && idx >= works.length ? true : undefined}
              tabIndex={shouldLoop && idx >= works.length ? -1 : undefined}
              className="snap-start shrink-0 w-full md:w-[calc((100%-4rem)/3)] bg-white rounded-[32px] overflow-hidden p-5 border border-indigo-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer group"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col flex-grow">
                {/* Category Pill */}
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-semibold text-indigo-600 bg-indigo-55/10 border border-indigo-100/50 uppercase w-fit mb-3.5 tracking-wide">
                  {item.category}
                </span>

                {/* Title */}
                <h4 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight mb-4 flex-grow line-clamp-3">
                  {item.title}
                </h4>

                {/* Footer with date and arrow */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 shrink-0">
                  <span className="text-xs text-slate-400 font-medium tracking-wide">
                    {item.date}
                  </span>
                  <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>

      </div>
    </section>
  );
}

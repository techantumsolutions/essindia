'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { FormattedText } from '@/components/ui/FormattedText';

export interface TestimonialItem {
  avatar: string;
  name: string;
  designation?: string;
  companyName?: string;
  rating: number; // 1-5 rating
  quote: string;
}

export interface Landing1TestimonialsContent {
  badge?: string;
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    avatar: '/Landing page1/assets/unsplash_OhKElOkQ3RE.png',
    name: 'James Pattinson',
    rating: 4,
    quote: '"Lobortis leo pretium facilisis amet nisl at nec. Scelerisque risus tortor donec ipsum consequat semper consequat adipiscing ultrices."'
  },
  {
    avatar: '/Landing page1/assets/unsplash_WMD64tMfc4k.png',
    name: 'Greg Stuart',
    rating: 5,
    quote: '"Vestibulum, cum nam non amet consectetur morbi aenean condimentum eget. Ultricies integer nunc neque accumsan laoreet. Viverra nibh ultrices."'
  },
  {
    avatar: '/Landing page1/assets/unsplash_6anudmpILw4.png',
    name: 'Trevor Mitchell',
    rating: 3,
    quote: '"Ut tristique viverra sed porttitor senectus. A facilisis metus pretium ut habitant lorem. Velit vel bibendum eget aliquet sem nec, id sed. Tincidunt."'
  }
];

const DEFAULT_CONTENT: Landing1TestimonialsContent = {
  badge: 'TESTIMONIALS',
  title: 'Built For Every Industry',
  description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
  testimonials: DEFAULT_TESTIMONIALS
};

function getSlideStep(el: HTMLElement) {
  const card = el.firstElementChild as HTMLElement | null;
  const next = card?.nextElementSibling as HTMLElement | null;
  if (card && next) return next.offsetLeft - card.offsetLeft;
  return card?.offsetWidth || el.clientWidth;
}

export function Landing1Testimonials({ content }: { content?: Landing1TestimonialsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const testimonials = data.testimonials || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const loopingRef = useRef(false);
  const [perView, setPerView] = useState(3);
  const [canScroll, setCanScroll] = useState(false);

  const shouldLoop = testimonials.length > perView;
  loopingRef.current = shouldLoop;
  const slides = shouldLoop ? [...testimonials, ...testimonials] : testimonials;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth - el.clientWidth > 8);
  }, []);

  const normalizeLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !loopingRef.current || testimonials.length === 0) return;
    const cycle = getSlideStep(el) * testimonials.length;
    if (cycle <= 0 || el.scrollLeft < cycle - 1) return;
    const previous = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = el.scrollLeft - cycle;
    el.style.scrollBehavior = previous;
  }, [testimonials.length]);

  const scrollByCard = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getSlideStep(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 8 || step <= 0) return;

    if (direction === 'left' && loopingRef.current && el.scrollLeft <= 8) {
      const cycle = step * testimonials.length;
      const previous = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = el.scrollLeft + cycle;
      el.style.scrollBehavior = previous;
    }

    el.scrollBy({ left: direction === 'right' ? step : -step, behavior: 'smooth' });
  }, [testimonials.length]);

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
  }, [shouldLoop, testimonials.length]);

  return (
    <section className="py-20 bg-slate-50 text-slate-900 font-sans select-none border-b border-slate-200">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {data.badge}
            </span>
          )}
          {data.title && (
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('left')}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-600 shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('right')}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-600 shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory py-3 -my-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Testimonials carousel"
          >
          {slides.map((test, idx) => (
            <div
              key={`${test.name}-${idx}`}
              aria-hidden={shouldLoop && idx >= testimonials.length ? true : undefined}
              className="snap-start shrink-0 w-full md:w-[calc((100%-3rem)/3)] bg-white p-5 md:p-6 rounded-[24px] border border-[#FF9F1C] shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Avatar */}
              {test.avatar && (
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-slate-50 shadow-inner shrink-0 relative bg-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Name */}
              <h4 className={`text-base font-extrabold text-[#49288a] tracking-wide ${test.designation || test.companyName ? 'mb-1' : 'mb-1.5'}`}>
                {test.name}
              </h4>

              {(test.designation || test.companyName) && (
                <div className="flex flex-col items-center gap-1 mb-2.5 max-w-full">
                  {test.designation && (
                    <span className="text-xs font-semibold text-slate-600 leading-tight">
                      {test.designation}
                    </span>
                  )}
                  {test.companyName && (
                    <span className="inline-flex max-w-full items-center rounded-full bg-[#f6f1fc] px-2.5 py-0.5 text-[11px] font-semibold leading-tight text-[#49288a]">
                      <span className="truncate">{test.companyName}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, starIdx) => {
                  const active = starIdx < test.rating;
                  return (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${active ? 'fill-[#FF8A00] text-[#FF8A00]' : 'fill-[#E2E8F0] text-[#E2E8F0]'}`}
                    />
                  );
                })}
              </div>

              {/* Quote */}
              <FormattedText
                content={test.quote}
                className="text-slate-600 text-xs leading-relaxed font-medium"
              />

            </div>
          ))}
          </div>
        </div>

      </div>
    </section>
  );
}

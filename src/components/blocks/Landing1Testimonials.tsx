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
    designation: 'Operations Director',
    rating: 4,
    quote: '"Lobortis leo pretium facilisis amet nisl at nec. Scelerisque risus tortor donec ipsum consequat semper consequat adipiscing ultrices."'
  },
  {
    avatar: '/Landing page1/assets/unsplash_WMD64tMfc4k.png',
    name: 'Greg Stuart',
    designation: 'Supply Chain Head',
    rating: 5,
    quote: '"Vestibulum, cum nam non amet consectetur morbi aenean condimentum eget. Ultricies integer nunc neque accumsan laoreet. Viverra nibh ultrices."'
  },
  {
    avatar: '/Landing page1/assets/unsplash_6anudmpILw4.png',
    name: 'Trevor Mitchell',
    designation: 'Managing Director',
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

export function Landing1Testimonials({ content }: { content?: Landing1TestimonialsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const testimonials = data.testimonials || [];
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
  }, [checkScroll, testimonials]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement | null;
      const next = card?.nextElementSibling as HTMLElement | null;
      const cardWidth = card && next
        ? next.offsetLeft - card.offsetLeft
        : card
          ? card.offsetWidth + 32
          : 340;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-slate-50 text-slate-900 font-sans select-none border-t border-b border-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#462294] bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#462294] animate-pulse" />
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

        {/* Testimonials carousel — same arrow placement / scroll logic as Landing1Works */}
        <div className="relative group/carousel">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 lg:-translate-x-14 xl:-translate-x-16 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-[#462294] shadow-md flex items-center justify-center hover:bg-[#462294] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 lg:translate-x-14 xl:translate-x-16 z-20 w-10 h-10 rounded-full bg-white border border-indigo-100 text-[#462294] shadow-md flex items-center justify-center hover:bg-[#462294] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex items-stretch gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 -my-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Testimonials carousel"
          >
            {testimonials.map((test, idx) => (
              <div
                key={`${test.name}-${idx}`}
                className="snap-start shrink-0 w-full md:w-[calc((100%-4rem)/3)] bg-white p-5 md:p-6 rounded-[24px] border border-[#FF9F1C] shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* Avatar */}
                {test.avatar && (
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 shrink-0 relative">
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-full h-full object-cover object-center rounded-full"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Name & Designation */}
                {(() => {
                  const designation = test.designation || (
                    test.name === 'James Pattinson' ? 'Operations Director' :
                    test.name === 'Greg Stuart' ? 'Supply Chain Head' :
                    test.name === 'Trevor Mitchell' ? 'Managing Director' :
                    ''
                  );
                  return (
                    <>
                      <h4 className={`text-base font-extrabold text-[#49288a] tracking-wide ${designation || test.companyName ? 'mb-1' : 'mb-1.5'}`}>
                        {test.name}
                      </h4>

                      {(designation || test.companyName) && (
                        <div className="flex flex-col items-center gap-1 mb-2.5 max-w-full">
                          {designation && (
                            <span className="text-xs font-semibold text-slate-600 leading-tight">
                              {designation}
                            </span>
                          )}
                          {test.companyName && (
                            <span className="inline-flex max-w-full items-center rounded-full bg-[#f6f1fc] px-2.5 py-0.5 text-[11px] font-semibold leading-tight text-[#49288a]">
                              <span className="truncate">{test.companyName}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

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

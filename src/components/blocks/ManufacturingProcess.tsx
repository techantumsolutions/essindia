'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultSteps = [
  { image: '/Modules-manufacturing/Production flow-1.png', label: 'DEMAND', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { image: '/Modules-manufacturing/Production flow-2.png', label: 'PLAN', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { image: '/Modules-manufacturing/Production flow-3.png', label: 'EXECUTE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { image: '/Modules-manufacturing/Production flow-4.png', label: 'IMPROVE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
];

function getSlideStep(el: HTMLElement) {
  const card = el.firstElementChild as HTMLElement | null;
  const next = card?.nextElementSibling as HTMLElement | null;
  if (card && next) return next.offsetLeft - card.offsetLeft;
  return card?.offsetWidth || el.clientWidth;
}

export default function ManufacturingProcess({ content }: { content?: any }) {
  const sectionTitle = content?.sectionTitle || 'Process ipsum';
  const sectionSubtitle = content?.sectionSubtitle || 'Lorem ipsum dolor sit amet, consectetur.';
  const sectionSubtitleColor = content?.sectionSubtitleColor;
  const sectionDescription = content?.sectionDescription || 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliquip';
  const steps = content?.processes || defaultSteps;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [perView, setPerView] = useState(4);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const slides = steps;
  const canScroll = canScrollLeft || canScrollRight;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(maxScroll > 8 && el.scrollLeft < maxScroll - 8);
  }, []);

  const scrollByCard = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getSlideStep(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 8 || step <= 0) return;
    if (direction === 'left' && el.scrollLeft <= 8) return;
    if (direction === 'right' && el.scrollLeft >= maxScroll - 8) return;

    el.scrollBy({ left: direction === 'right' ? step : -step, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const sm = window.matchMedia('(min-width: 640px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    const update = () => setPerView(lg.matches ? 4 : sm.matches ? 2 : 1);
    update();
    sm.addEventListener('change', update);
    lg.addEventListener('change', update);
    return () => {
      sm.removeEventListener('change', update);
      lg.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => checkScroll();
    const frame = window.requestAnimationFrame(checkScroll);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(checkScroll) : null;
    ro?.observe(el);

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      ro?.disconnect();
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, slides.length]);

  return (
    <section className="py-14 bg-white px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 space-y-2">
          <div className="text-[14px] font-bold text-slate-900">
            {sectionTitle}
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#000000] tracking-tight"
            style={sectionSubtitleColor ? { color: sectionSubtitleColor } : undefined}
          >
            {sectionSubtitle}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-[15px]">
            {sectionDescription}
          </p>
        </div>

        <div className="relative">
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('left')}
              disabled={!canScrollLeft}
              aria-label="Previous process steps"
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-[#27256b]/15 text-[#27256b] shadow-md flex items-center justify-center transition-colors ${canScrollLeft ? 'hover:bg-[#27256b] hover:text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScroll && (
            <button
              type="button"
              onClick={() => scrollByCard('right')}
              disabled={!canScrollRight}
              aria-label="Next process steps"
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 z-20 w-10 h-10 rounded-full bg-white border border-[#27256b]/15 text-[#27256b] shadow-md flex items-center justify-center transition-colors ${canScrollRight ? 'hover:bg-[#27256b] hover:text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className={`flex items-stretch gap-8 overflow-x-auto snap-x snap-mandatory py-3 -my-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${steps.length <= perView ? 'justify-center' : ''}`}
            role="region"
            aria-label="Process steps carousel"
          >
            {slides.map((step: any, i: number) => {
              return (
                <div
                  key={`${step.label}-${i}`}
                  className="snap-start shrink-0 w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)] flex justify-center relative group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % Math.max(steps.length, 1)) * 0.1 }}
                    className="flex flex-col items-center text-center w-full max-w-[280px]"
                  >
                    <div className="relative mb-2 z-10 transition-transform group-hover:scale-105">
                      <img src={step.image || '/Modules-manufacturing/Production flow-1.png'} alt={step.label} className="w-[160px] max-w-full h-[160px] object-contain mx-auto" />
                    </div>

                    <h3 className="text-[16px] font-semibold text-black uppercase mb-2">{step.label}</h3>
                    <p className="text-[12.5px] text-slate-500 leading-snug max-w-[210px]">
                      {step.desc}
                    </p>
                  </motion.div>

                  {i < slides.length - 1 && (
                    <div className="hidden lg:block absolute top-[79px] left-[calc(50%+50px)] w-[calc(100%-50px)] border-t-[1.5px] border-[#b0b4d4] z-0 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

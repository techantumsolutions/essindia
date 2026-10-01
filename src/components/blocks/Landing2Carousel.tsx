'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

export interface CarouselSlide {
  badge?: string;
  title: string;
  description: string;
  mediaUrl: string;
  videoUrl?: string;
}

export interface Landing2CarouselContent {
  slides?: CarouselSlide[];
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    badge: 'THE ENTERPRISE ADVANTAGE',
    title: 'Work smarter.\nGrow faster.',
    description: 'Business growth shouldn\'t mean more manual work. With ESS India ERP, AI-powered automation, real-time insights, and connected business processes help your organization operate efficiently, reduce costs, and scale with confidence.',
    mediaUrl: '/Landing Page-2/assets/63e39c93deb059f6e6a6bccf_Bsh.svg.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    badge: 'AUTOMATED WORKFLOWS',
    title: 'Streamline.\nAccelerate.',
    description: 'Eliminate departmental silos and manual entry errors with unified real-time data flows across inventory, sales, finance, and human resources.',
    mediaUrl: '/Landing Page-2/assets/63e39c93deb059f6e6a6bccf_Bsh.svg.png',
  },
  {
    badge: 'REAL-TIME ANALYTICS',
    title: 'Predictable.\nProfitable.',
    description: 'Gain complete operational visibility with interactive dashboards, automated executive alerts, and predictive business intelligence tools.',
    mediaUrl: '/Landing Page-2/assets/63e39c93deb059f6e6a6bccf_Bsh.svg.png',
  }
];

export function Landing2Carousel({ content }: { content?: Landing2CarouselContent }) {
  const slides = content?.slides && content.slides.length > 0 ? content.slides : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const activeSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const isVideoFile = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return Boolean(
      lower.match(/\.(mp4|webm|mov|ogg|m4v)$/) ||
      lower.includes('/video/') ||
      lower.includes('/videos/') ||
      lower.includes('youtube.com') ||
      lower.includes('youtu.be') ||
      lower.includes('vimeo.com')
    );
  };

  return (
    <section className="py-14 bg-white font-sans select-none px-6">
      <div className="container mx-auto max-w-6xl relative flex items-center justify-center">
        {/* Previous Arrow Button */}
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="w-12 h-12 rounded-full bg-[#5d2bb9] hover:bg-[#4d229e] text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-105 shrink-0 z-20 cursor-pointer mr-4 md:mr-8"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-12 h-12 shrink-0 mr-4 md:mr-8 invisible" aria-hidden="true" />
        )}

        {/* Main Card Container */}
        <div className="w-full max-w-4xl relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#6e22d9] to-[#8c2bee] shadow-2xl border border-purple-400/20 grid grid-cols-1 md:grid-cols-12 min-h-[380px] md:min-h-[420px]">
          {/* Left Side: Media Upload (Image/Video) - Embedded Inline */}
          <div className="md:col-span-7 relative p-6 sm:p-8 flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-[420px]">
            {(() => {
              const video = ((activeSlide as any).youtubeUrl || activeSlide.videoUrl || '').trim();
              const media = (activeSlide.mediaUrl || '').trim();
              const activeUrl = video || media;

              const isYouTube = activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be');
              const isVimeo = activeUrl.includes('vimeo.com');

              let embedUrl = activeUrl;
              if (isYouTube) {
                let videoId = '';
                if (activeUrl.includes('watch?v=')) {
                  videoId = activeUrl.split('watch?v=')[1]?.split('&')[0] || '';
                } else if (activeUrl.includes('youtu.be/')) {
                  videoId = activeUrl.split('youtu.be/')[1]?.split('?')[0] || '';
                } else if (activeUrl.includes('youtube.com/shorts/')) {
                  videoId = activeUrl.split('youtube.com/shorts/')[1]?.split('?')[0] || '';
                } else if (activeUrl.includes('youtube.com/embed/')) {
                  videoId = activeUrl.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                }
                if (videoId) {
                  embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
              } else if (isVimeo) {
                const id = activeUrl.split('vimeo.com/')[1]?.split('?')[0];
                if (id) {
                  embedUrl = `https://player.vimeo.com/video/${id}`;
                }
              }

              if (isYouTube || isVimeo) {
                return (
                  <div className="w-full h-full min-h-[240px] md:min-h-[340px] rounded-xl overflow-hidden shadow-md bg-black">
                    <iframe
                      src={embedUrl}
                      title={activeSlide.title || 'Carousel Video'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }

              if (isVideoFile(activeUrl)) {
                return (
                  <video
                    src={activeUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain max-h-[340px] drop-shadow-xl"
                  />
                );
              }

              return (
                <div className="relative w-full h-full min-h-[240px] md:min-h-[340px] flex items-center justify-center">
                  <Image
                    src={
                      media &&
                      !media.includes('<iframe') &&
                      (media.startsWith('/') || media.startsWith('http://') || media.startsWith('https://'))
                        ? media
                        : '/Landing Page-2/assets/63e39c93deb059f6e6a6bccf_Bsh.svg.png'
                    }
                    alt={activeSlide.title || 'Carousel Media'}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              );
            })()}
          </div>

          {/* Right Side: Yellow Content Box */}
          <div className="md:col-span-5 bg-[#ffcc29] p-6 sm:p-8 rounded-2xl md:rounded-l-2xl flex flex-col justify-center text-slate-900 shadow-lg my-2 mr-2 md:my-3 md:mr-3 overflow-hidden min-w-0">
            {/* Small Badge */}
            {activeSlide.badge && (
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900/90 mb-3 block break-words">
                {activeSlide.badge}
              </span>
            )}

            {/* Big Title */}
            {activeSlide.title && (
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight whitespace-pre-line break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                {activeSlide.title}
              </h3>
            )}

            {/* Subtitle / Description */}
            {activeSlide.description && (
              <p className="text-slate-900 font-semibold text-xs sm:text-[13px] leading-relaxed opacity-95 break-words">
                {activeSlide.description}
              </p>
            )}
          </div>
        </div>

        {/* Next Arrow Button */}
        {currentIndex < slides.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="w-12 h-12 rounded-full bg-[#5d2bb9] hover:bg-[#4d229e] text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-105 shrink-0 z-20 cursor-pointer ml-4 md:ml-8"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-12 h-12 shrink-0 ml-4 md:ml-8 invisible" aria-hidden="true" />
        )}
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-4 h-4 bg-[#5d2bb9] shadow-sm'
                  : 'w-3 h-3 bg-purple-200 hover:bg-purple-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

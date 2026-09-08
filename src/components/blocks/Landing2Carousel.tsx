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
    return url?.endsWith('.mp4') || url?.endsWith('.webm') || url?.endsWith('.mov');
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
          {/* Left Side: Media Upload (Image/Video) & Overlay Play Button */}
          <div className="md:col-span-7 relative p-6 sm:p-8 flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-[420px]">
            {/* Background Graphic or Uploaded Media */}
            {isVideoFile(activeSlide.mediaUrl) ? (
              <video
                src={activeSlide.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain max-h-[340px] drop-shadow-xl"
              />
            ) : (
              <div className="relative w-full h-full min-h-[240px] md:min-h-[340px] flex items-center justify-center">
                <Image
                  src={
                    activeSlide.mediaUrl &&
                    !activeSlide.mediaUrl.includes('<iframe') &&
                    (activeSlide.mediaUrl.startsWith('/') || activeSlide.mediaUrl.startsWith('http://') || activeSlide.mediaUrl.startsWith('https://'))
                      ? activeSlide.mediaUrl
                      : '/Landing Page-2/assets/63e39c93deb059f6e6a6bccf_Bsh.svg.png'
                  }
                  alt={activeSlide.title || 'Carousel Media'}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            )}

            {/* Central Play Button Badge */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <button
                type="button"
                onClick={() => activeSlide.videoUrl && setIsVideoModalOpen(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/60 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-auto transition-transform hover:scale-110 cursor-pointer"
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#462294] flex items-center justify-center pl-1 shadow-inner">
                  <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-white text-white" />
                </div>
              </button>
            </div>
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

      {/* Video Popup Modal */}
      {isVideoModalOpen && activeSlide.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {activeSlide.videoUrl.includes('youtube') || activeSlide.videoUrl.includes('vimeo') ? (
              <iframe
                src={activeSlide.videoUrl}
                title="Video Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={activeSlide.videoUrl} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

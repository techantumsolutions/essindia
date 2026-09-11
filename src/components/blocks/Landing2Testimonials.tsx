'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
];

const DEFAULT_CONTENT: Landing2TestimonialsContent = {
  title: 'See what our customers are saying',
  badge: 'TESTIMONIALS',
  subtitle: '2,157 people have said how good we are',
  description: '',
  testimonials: DEFAULT_TESTIMONIALS,
};

export function Landing2Testimonials({ content }: { content?: Landing2TestimonialsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const items = data.testimonials && data.testimonials.length > 0 ? data.testimonials : DEFAULT_TESTIMONIALS;

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <section className="py-14 bg-[#f8f9fa] font-sans select-none px-6">
      <div className="container mx-auto max-w-5xl text-center">
        {/* Section Title */}
        {data.title && (
          <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-3">
            {data.title}
          </h2>
        )}

        {/* Description / Subtitle */}
        {(data.description || data.subtitle) && (
          <p className="text-slate-600 text-base md:text-lg font-medium mb-12">
            {data.description || data.subtitle}
          </p>
        )}

        {/* Testimonial Cards Grid (2-column on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left">
          {items.map((item, idx) => {
            const rawMedia = (item as any).mediaUrl || item.image || item.videoUrl || '';
            const isVideo = Boolean(
              rawMedia &&
              (rawMedia.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/) ||
                rawMedia.includes('youtube.com') ||
                rawMedia.includes('vimeo.com') ||
                rawMedia.includes('youtu.be'))
            );
            const imageSrc = safeImageUrl(rawMedia, '/Landing Page-2/assets/3ddf828267cb844171aaad94b1f6da3e7949acbd.png');

            return (
              <div key={idx} className="flex flex-col group">
                {/* Image & Video Box */}
                <div
                  onClick={() => isVideo && setActiveVideoUrl(rawMedia)}
                  className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 mb-6 bg-slate-200 ${
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
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  )}

                  {/* Play Button Badge for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Quote */}
                {item.quote && (
                  <FormattedText
                    content={item.quote}
                    className="text-slate-900 text-xl md:text-2xl font-bold leading-snug tracking-tight mb-3"
                  />
                )}

                {/* Customer Author Name */}
                {item.author && (
                  <p className="text-slate-900 font-bold text-sm md:text-base mb-0.5">
                    {item.author}
                  </p>
                )}

                {/* Customer Role & Company */}
                {item.role && (
                  <p className="text-slate-500 font-medium text-xs md:text-sm">
                    {item.role}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Lightbox */}
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

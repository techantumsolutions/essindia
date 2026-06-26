'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';

interface AssExperienceContent {
  title?: string;
  mediaUrl?: string; // Image or Video URL shown in the section
  videoUrl?: string; // Optional video URL to play in a popup modal
}

export function AssExperience({ content }: { content?: AssExperienceContent }) {
  const title = content?.title || 'Improve Customer Experience and Loyalty with our After-Sales Service App';
  const mediaUrl = content?.mediaUrl || '/App-After Sales Service/Rectangle 193.png';
  const videoUrl = content?.videoUrl || '';

  const [isOpen, setIsOpen] = useState(false);

  const isVideoDirect = mediaUrl && (mediaUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || mediaUrl.includes('video'));
  const hasVideo = isVideoDirect || !!videoUrl;

  const handlePlayClick = () => {
    if (hasVideo) {
      setIsOpen(true);
    }
  };

  return (
    <section className="p-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-[#0a1128] text-2xl sm:text-3xl font-extrabold max-w-3xl mx-auto mb-10 text-center leading-tight tracking-tight">
          {title}
        </h2>

        {/* Media Container */}
        <div
          onClick={handlePlayClick}
          className={`w-full max-w-4xl mx-auto rounded-3xl border border-slate-100 overflow-hidden shadow-2xl shadow-indigo-100/60 bg-[#f8fafc] relative group ${hasVideo ? 'cursor-pointer' : ''
            }`}
        >
          {isVideoDirect ? (
            <div className="w-full aspect-video relative">
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                controls={false}
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            </div>
          ) : (
            <div className="w-full aspect-video relative">
              <Image
                src={mediaUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/15" />
            </div>
          )}

          {/* Play Button Overlay (Show if there is a video and it's not already baked into the default image) */}
          {hasVideo && mediaUrl !== '/App-After Sales Service/Rectangle 193.png' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#513beb] to-[#6d5bfb] text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border-2 border-white/20">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 hover:scale-105 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="w-full aspect-video">
              <video
                src={videoUrl || mediaUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

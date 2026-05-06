'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';

// Mocking the logos with text/SVG shapes to approximate the screenshot
const brands = [
  { name: 'Spotify', logo: 'Spotify' },
  { name: 'Nike', logo: 'Nike' },
  { name: 'AMD', logo: 'AMD' },
  { name: 'apper', logo: 'apper' },
  { name: 'logitech', logo: 'logitech' },
  { name: 'LEVI\'S', logo: 'LEVI\'S' },
];

export function TrustedBrands() {
  return (
    <section className="py-12 bg-white mt-4 mb-8 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <MotionSection variant="fadeUp">
          <h3 className="text-center text-lg md:text-xl font-bold text-slate-400 mb-10 tracking-tight uppercase">
            Trusted by 1,500+ Businesses Across India & Overseas
          </h3>
        </MotionSection>
        
        <StaggerContainer className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="text-xl md:text-2xl font-bold text-slate-500 hover:text-[#4B2A63] transition-colors cursor-pointer"
            >
              {/* Fallback text if user doesn't use images */}
              <div className="flex items-center gap-2">
                {/* SVG placeholders approximating brand logos from screenshot */}
                {brand.name === 'Spotify' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zM19.32 14.1c-.3.42-.84.54-1.26.24-3.36-2.04-8.52-2.64-12.54-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.56-1.32 10.2-1.02 14.1 1.68.48.3.54.84.24 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.2-1.26 11.28-1.02 15.96 1.8.54.3.72 1.02.42 1.56-.24.54-1.02.72-1.5-.42z"/></svg>
                )}
                <span>{brand.name}</span>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

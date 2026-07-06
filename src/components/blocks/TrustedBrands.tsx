'use client';

import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface Brand {
  image?: string;
}

interface TrustedBrandsContent {
  title?: string;
  brands?: Brand[];
}

interface TrustedBrandsProps {
  content?: TrustedBrandsContent;
}

const defaultBrands: Brand[] = [
  { image: '' },
  { image: '' },
  { image: '' },
  { image: '' },
  { image: '' },
  { image: '' },
];

export function TrustedBrands({ content }: TrustedBrandsProps) {
  const title = content?.title || "Trusted by 1,500+ Businesses Across India & Overseas";
  const brands = content?.brands || defaultBrands;
  
  // Duplicate array 3 times for a seamless infinite scroll loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 bg-white mt-4 mb-8 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <MotionSection variant="fadeUp">
          <h3 className="text-center text-lg md:text-xl font-bold text-slate-400 mb-10 tracking-tight uppercase">
            {title}
          </h3>
        </MotionSection>
        
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-white after:to-transparent">
          <div 
            className="flex w-max items-center gap-10 md:gap-16 lg:gap-24"
            style={{ animation: 'trusted-brands-marquee 15s linear infinite' }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {duplicatedBrands.map((brand, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center w-32 h-16">
                {brand.image ? (
                  <img src={brand.image} alt="Brand" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-slate-500">Brand</span>
                )}
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes trusted-brands-marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-33.333333%); }
            }
          `}} />
        </div>
      </div>
    </section>
  );
}

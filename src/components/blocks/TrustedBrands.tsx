'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';

interface Brand {
  name: string;
  logo?: string;
}

interface TrustedBrandsContent {
  title?: string;
  brands?: Brand[];
}

interface TrustedBrandsProps {
  content?: TrustedBrandsContent;
}

const defaultBrands: Brand[] = [
  { name: 'Spotify' },
  { name: 'Nike' },
  { name: 'AMD' },
  { name: 'apper' },
  { name: 'logitech' },
  { name: 'LEVI\'S' },
];

export function TrustedBrands({ content }: TrustedBrandsProps) {
  const title = content?.title || "Trusted by 1,500+ Businesses Across India & Overseas";
  const brands = content?.brands || defaultBrands;

  return (
    <section className="py-12 bg-white mt-4 mb-8 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <MotionSection variant="fadeUp">
          <h3 className="text-center text-lg md:text-xl font-bold text-slate-400 mb-10 tracking-tight uppercase">
            {title}
          </h3>
        </MotionSection>
        
        <StaggerContainer className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name + i}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              className="text-xl md:text-2xl font-bold text-slate-500 hover:text-[#4B2A63] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain" />
                ) : (
                  <span>{brand.name}</span>
                )}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

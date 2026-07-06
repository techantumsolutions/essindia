'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ManufacturingHero({ content }: { content?: any }) {
  const bgColor = content?.bgColor || '#27256b';
  const badgeBgColor = content?.badgeBgColor || '#391781';
  const badgeText = content?.badgeText || 'Lorem ipsum ERP';
  const badgeTextColor = content?.badgeTextColor || '#ffffff';
  const title = content?.title || 'Loremipsum <br />Loremipsum <br />Lorem ipsum <br />Loremipsum';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.';
  const descriptionColor = content?.descriptionColor || 'rgba(255,255,255,0.8)';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#FFD600';
  const primaryButtonText = content?.primaryButtonText || 'Lorem ipsum';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#29245C';
  const primaryButtonUrl = content?.primaryButtonUrl || '/about';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || '#ffffff';
  const secondaryButtonText = content?.secondaryButtonText || 'Lorem ipsum';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#29245C';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/contact';
  const image = content?.image || '/Modules-manufacturing/Banner-image.png';

  return (
    <section className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6 overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            {badgeText && (
              <div 
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold mb-8"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
              >
                {badgeText}
              </div>
            )}

             {title.includes('<p>') ? (
              <div 
                className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-light tracking-tight mb-6 prose prose-invert max-w-none" 
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }} 
              />
            ) : (
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-light tracking-tight mb-6" 
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }} 
              />
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-base sm:text-lg max-w-xl leading-relaxed mb-8 prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-8" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={primaryButtonUrl} 
                className="px-6 py-3 cursor-pointer rounded-full text-sm font-bold transition-all shadow-md inline-block text-center hover:brightness-95 min-w-[140px]"
                style={{ backgroundColor: primaryButtonBgColor, color: primaryButtonTextColor }}
              >
                {primaryButtonText}
              </Link>
              <Link 
                href={secondaryButtonUrl} 
                className="px-6 py-3 cursor-pointer rounded-full text-sm font-bold transition-all inline-block text-center hover:brightness-95 min-w-[140px]"
                style={{ backgroundColor: secondaryButtonBgColor, color: secondaryButtonTextColor }}
              >
                {secondaryButtonText}
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Visuals */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0 w-full"
          >
            <div className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image}
                alt="Manufacturing ERP Automation"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

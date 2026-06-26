'use client';

import React from 'react';
import Image from 'next/image';

interface AssWhyChooseContent {
  badgeText?: string;
  title?: string;
  description?: string;
  image?: string;
}

export function AssWhyChoose({ content }: { content?: AssWhyChooseContent }) {
  const badgeText = content?.badgeText || 'Apps & integrations';
  const title = content?.title || 'Simplify Scheduling.\nAccelerate Productivity.';
  const description = content?.description || 'Integrate Calendly with your business tools to automate meeting management, reduce back-and-forth communication, and create a more efficient workflow.';
  const image = content?.image || '/App-After Sales Service/Frame 295.png';

  return (
    <section 
      className="p-14 px-6"
      style={{
        background: 'radial-gradient(57.37% 101.99% at 50% 50%, rgba(0, 162, 184, 0) 0%, rgba(0, 161, 185, 0.00154486) 1.52%, rgba(0, 161, 187, 0.00308972) 3.03%, rgba(0, 161, 189, 0.00463458) 4.55%, rgba(0, 161, 191, 0.00617944) 6.06%, rgba(0, 161, 193, 0.0077243) 7.58%, rgba(0, 161, 194, 0.00926916) 9.09%, rgba(0, 161, 196, 0.010814) 10.61%, rgba(0, 161, 198, 0.0123589) 12.12%, rgba(0, 161, 200, 0.0139037) 13.64%, rgba(0, 161, 201, 0.0154486) 15.15%, rgba(0, 160, 203, 0.0169935) 16.67%, rgba(0, 160, 205, 0.0185383) 18.18%, rgba(0, 160, 206, 0.0200832) 19.7%, rgba(0, 160, 208, 0.021628) 21.21%, rgba(0, 160, 209, 0.0231729) 22.73%, rgba(0, 159, 211, 0.0247178) 24.24%, rgba(0, 159, 212, 0.0262626) 25.76%, rgba(0, 159, 214, 0.0278075) 27.27%, rgba(0, 159, 215, 0.0293523) 28.79%, rgba(0, 158, 216, 0.0308972) 30.3%, rgba(0, 158, 218, 0.0324421) 31.82%, rgba(0, 158, 219, 0.0339869) 33.33%, rgba(0, 157, 220, 0.0355318) 34.85%, rgba(0, 157, 222, 0.0370767) 36.36%, rgba(0, 157, 223, 0.0386215) 37.88%, rgba(0, 156, 224, 0.0401664) 39.39%, rgba(0, 156, 226, 0.0417112) 40.91%, rgba(0, 156, 227, 0.0432561) 42.42%, rgba(0, 155, 228, 0.044801) 43.94%, rgba(0, 155, 229, 0.0463458) 45.45%, rgba(0, 154, 230, 0.0478907) 46.97%, rgba(0, 154, 231, 0.0494355) 48.48%, rgba(0, 154, 232, 0.0509804) 50%, rgba(0, 153, 233, 0.0525253) 51.52%, rgba(0, 153, 234, 0.0540701) 53.03%, rgba(0, 152, 235, 0.055615) 54.55%, rgba(0, 152, 236, 0.0571598) 56.06%, rgba(0, 151, 237, 0.0587047) 57.58%, rgba(0, 151, 238, 0.0602496) 59.09%, rgba(0, 150, 239, 0.0617944) 60.61%, rgba(0, 150, 240, 0.0633393) 62.12%, rgba(0, 149, 240, 0.0648841) 63.64%, rgba(0, 149, 241, 0.066429) 65.15%, rgba(0, 148, 242, 0.0679739) 66.67%, rgba(0, 147, 243, 0.0695187) 68.18%, rgba(0, 147, 243, 0.0710636) 69.7%, rgba(0, 146, 244, 0.0726084) 71.21%, rgba(0, 146, 245, 0.0741533) 72.73%, rgba(0, 145, 245, 0.0756982) 74.24%, rgba(0, 144, 246, 0.077243) 75.76%, rgba(0, 144, 246, 0.0787879) 77.27%, rgba(0, 143, 247, 0.0803327) 78.79%, rgba(0, 142, 247, 0.0818776) 80.3%, rgba(0, 142, 248, 0.0834225) 81.82%, rgba(0, 141, 248, 0.0849673) 83.33%, rgba(0, 140, 249, 0.0865122) 84.85%, rgba(0, 139, 249, 0.088057) 86.36%, rgba(0, 139, 249, 0.0896019) 87.88%, rgba(0, 138, 250, 0.0911468) 89.39%, rgba(0, 137, 250, 0.0926916) 90.91%, rgba(0, 136, 250, 0.0942365) 92.42%, rgba(0, 136, 250, 0.0957813) 93.94%, rgba(0, 135, 250, 0.0973262) 95.45%, rgba(0, 134, 250, 0.0988711) 96.97%, rgba(0, 133, 250, 0.100416) 98.48%, rgba(0, 133, 251, 0.101961) 100%)'
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* Left Content */}
          <div className="text-left">
            {badgeText && (
              <span className="text-sm md:text-base font-bold text-[#171C76] mb-2 block">
                {badgeText}
              </span>
            )}

            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-light text-[#171C76] leading-tight mb-2 whitespace-pre-line">
              {title}
            </h2>

            {description && (
              description.includes('<p>') ? (
                <div className="text-base md:text-[17px] text-slate-600 leading-relaxed max-w-xl prose" dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <p className="text-base md:text-[17px] text-slate-600 leading-relaxed max-w-xl">{description}</p>
              )
            )}
          </div>

          {/* Right Image (Wheel) */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-[460px] aspect-square transition-all hover:scale-[1.02] duration-500">
              <Image
                src={image}
                alt="Apps and integrations"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import { Button } from '@/components/ui/button';

interface AboutUsCtaContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface AboutUsCtaProps {
  content?: AboutUsCtaContent;
}

export function AboutUsCta({ content }: AboutUsCtaProps) {
  const title =
    content?.title || 'Schedule Your Free Demo';

  const description =
    content?.description ||
    'Discover how our ERP, BI, and automation solutions can streamline operations, improve visibility, and solve real business challenges with a personalized demo from our experts.';

  const buttonText =
    content?.buttonText || 'Book a Free Demo';

  const buttonLink =
    content?.buttonLink || '/demo';

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#0D2C84] leading-[1.1] mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="max-w-4xl mx-auto text-lg leading-[1.7] text-[#1F2A44] mb-6">
          {description}
        </p>

        {/* CTA */}
        <Button
          onClick={() => (window.location.href = buttonLink)}
          className="
            bg-[#0D2C84]
            hover:bg-[#0B2570]
            text-white
            font-semibold
            text-base
            px-6
            py-4
            rounded-full
            border-0
            shadow-none
          "
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
import React from 'react';
import Image from 'next/image';

import { FormattedText } from '@/components/ui/FormattedText';

interface FeatureData {
  title: string;
  description: string;
  icon: string;
}

interface JudicialFeaturesContent {
  heading?: string;
  description?: string;
  desc?: string;
  sideImage?: string;
  features?: FeatureData[];
}

interface JudicialFeaturesProps {
  content?: JudicialFeaturesContent;
}

export function JudicialFeatures({ content }: JudicialFeaturesProps) {
  const c = (content || {}) as Record<string, any>;
  const heading = c.heading || "ebizframeJustice – Key features";
  const rawDesc = c.description ?? c.desc ?? c.descriptionText ?? c.desc1;
  const description = (typeof rawDesc === 'string' && rawDesc.trim().length > 0)
    ? rawDesc
    : "ebizframeJustice makes available most of the elegant, sophisticated and context specific search features. ebizframeJustice is born out of the understanding that Law is a serious subject and getting to relevant results in the shortest time and most convenient way is essential to the law professionals.";
  const sideImage = c.sideImage || "/Judicial Automation/image 78.png";
  
  const defaultFeatures = [
    {
      title: "Intuitive & Sophisticated Search",
      description: "on Full Text, Subject, Section/Act, Title, Key-Words & Key-Phrases, and Statutes referred, Coram of Judges, Name of the Court, Date of Decision, and Equivalent Citations etc.",
      icon: "/Judicial Automation/Container/search_svgrepo.com.png"
    },
    {
      title: "Backward & Forward links",
      description: "to the judgment (to the extent feasible) through hyperlinks.",
      icon: "/Judicial Automation/Container/Vector.png"
    },
    {
      title: "Store your expertise with ebizframejustice",
      description: "by attaching notes, reminders, and keywords - and search them in consonance with a search on the database at any later time.",
      icon: "/Judicial Automation/Container/server_svgrepo.com.png"
    },
    {
      title: "Assisted Querying using ebizframejustice",
      description: "When you can't do your research yourself, send your query to Jura Assistant and our team of researchers will provide answers. (Conditions and charges apply)",
      icon: "/Judicial Automation/Container/query_svgrepo.com.png"
    },
    {
      title: "Tamper-proof",
      description: "printing of results such that the results cannot be altered when being printed.",
      icon: "/Judicial Automation/Container/print_svgrepo.com.png"
    }
  ];

  const features = content?.features || defaultFeatures;

  const isValidImageSrc = (s?: string) => {
    if (!s || typeof s !== 'string' || s.trim() === '') return false;
    return s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:');
  };

  const validSideImage = isValidImageSrc(sideImage) ? sideImage : "/Judicial Automation/image 78.png";

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-stretch gap-16">
          {/* Left Image */}
          <div className="lg:w-1/2 w-full hidden lg:block relative min-h-[600px]">
            <Image
              src={validSideImage}
              alt="Features Side Graphic"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:hidden w-full relative h-[300px]">
            <Image
              src={validSideImage}
              alt="Features Side Graphic"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Features List */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4 justify-center">
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-4">
                {heading}
              </h2>
              <FormattedText
                content={description}
                className="text-gray-500 text-sm leading-relaxed"
              />
            </div>
            {features.map((feature, idx) => {
              const defaultIcon = defaultFeatures[idx]?.icon || defaultFeatures[0].icon;
              const iconSrc = isValidImageSrc(feature.icon) ? feature.icon : defaultIcon;
              const featObj = (feature || {}) as Record<string, any>;
              const featureDesc = featObj.description ?? featObj.desc ?? featObj.descriptionText;

              return (
                <div key={idx} className="bg-white p-5 md:p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] flex items-start gap-6 border border-gray-50">
                  <div className="flex-shrink-0 pt-1 relative w-[40px] h-[40px]">
                    <Image src={iconSrc} alt={feature.title || ''} fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-800 font-normal mb-1">{feature.title}</h4>
                    <FormattedText
                      content={featureDesc}
                      className="text-gray-500 text-sm leading-relaxed"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

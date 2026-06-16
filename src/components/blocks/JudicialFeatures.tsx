import React from 'react';
import Image from 'next/image';

interface FeatureData {
  title: string;
  description: string;
  icon: string;
}

interface JudicialFeaturesContent {
  heading?: string;
  description?: string;
  sideImage?: string;
  features?: FeatureData[];
}

interface JudicialFeaturesProps {
  content?: JudicialFeaturesContent;
}

export function JudicialFeatures({ content }: JudicialFeaturesProps) {
  const heading = content?.heading || "ebizframeJustice – Key features";
  const description = content?.description || "ebizframeJustice makes available most of the elegant, sophisticated and context specific search features. ebizframeJustice is born out of the understanding that Law is a serious subject and getting to relevant results in the shortest time and most convenient way is essential to the law professionals.";
  const sideImage = content?.sideImage || "/Judicial Automation/image 78.png";
  
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

  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6">
            {heading}
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Image */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={sideImage}
                alt="Features Side Graphic"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Features List */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 pt-1 relative w-[32px] h-[32px]">
                  <Image src={feature.icon} alt={feature.title} fill className="object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

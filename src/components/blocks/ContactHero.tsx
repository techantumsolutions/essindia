import { getHeroBackgroundStyles } from '@/lib/utils';
export interface ContactHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  badgeTitle?: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  heading?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  bgColor?: string;
  backgroundImageUrl?: string;
}

export function ContactHero({ content }: { content?: ContactHeroContent }) {
  const badgeTitle = content?.badgeText || content?.badgeTitle || "Contact Our Team";
  const badgeBgColor = content?.badgeBgColor || "#ffffff";
  const badgeTextColor = content?.badgeTextColor || "#5C2B6A";
  const heading = content?.title || content?.heading || "How can we help you\nsucceed?";
  const titleColor = content?.titleColor || "#ffffff";
  const description = content?.description || "Have questions about our platform or need a custom solution? Our experts are here to help your business scale with Finspring.";
  const descriptionColor = content?.descriptionColor || "#d1d5db";
  const bgColor = content?.bgColor || "#000000";
  const backgroundImageUrl = content?.backgroundImageUrl || "/Contact us/banner.png";

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: bgColor });

  return (
    <div className="w-full flex flex-col">
      {/* Dark Banner */}
      <div 
        className="relative w-full min-h-[45vh] flex flex-col items-center justify-center py-14"
        style={bgStyles}
      >
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <div 
            className="rounded-full px-6 py-2 shadow-md"
            style={{ backgroundColor: badgeBgColor }}
          >
            <span 
              className="font-semibold text-sm"
              style={{ color: badgeTextColor }}
            >
              {badgeTitle}
            </span>
          </div>

          <h1 
            className="text-5xl md:text-6xl font-light tracking-tight whitespace-pre-line"
            style={{ color: titleColor }}
          >
            {heading}
          </h1>

          <div 
            className="text-gray-300 text-sm md:text-base max-w-2xl font-light prose prose-invert"
            style={{ color: descriptionColor }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
}

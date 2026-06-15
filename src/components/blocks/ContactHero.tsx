export interface ContactHeroContent {
  badgeTitle?: string;
  heading?: string;
  description?: string;
  backgroundImageUrl?: string;
}

export function ContactHero({ content }: { content?: ContactHeroContent }) {
  const badgeTitle = content?.badgeTitle || "Contact Our Team";
  const heading = content?.heading || "How can we help you\nsucceed?";
  const description = content?.description || "Have questions about our platform or need a custom solution? Our experts are here to help your business scale with Finspring.";
  const backgroundImageUrl = content?.backgroundImageUrl || "/Contact us/banner.png";

  return (
    <div className="w-full flex flex-col">
      {/* Dark Banner */}
      <div className="relative bg-black w-full min-h-[50vh] flex flex-col items-center justify-center pt-40 pb-14">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <div className="bg-white rounded-full px-6 py-2 shadow-md">
            <span className="text-[#5C2B6A] font-semibold text-sm">{badgeTitle}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight whitespace-pre-line">
            {heading}
          </h1>

          <p className="text-gray-300 text-sm md:text-base max-w-2xl font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

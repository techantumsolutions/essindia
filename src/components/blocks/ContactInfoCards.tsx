import { MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
};

export interface ContactInfoCard {
  title: string;
  description: string;
  linkText: string | null;
  iconName: string;
  badge: string | null;
}

export interface ContactInfoCardsContent {
  cards?: ContactInfoCard[];
}

export function ContactInfoCards({ content }: { content?: ContactInfoCardsContent }) {
  const cards = content?.cards || [
    {
      title: 'Chat to Sales',
      description: 'Speak to our friendly team about plans and pricing.',
      linkText: 'marketing@essindia.com',
      iconName: 'MessageSquare',
      badge: null
    },
    {
      title: 'Phone Support',
      description: 'Mon - Fri from 8am to 6pm. We\'re here to help.',
      linkText: '+91 120 4016020 - 39',
      iconName: 'Phone',
      badge: null
    },
    {
      title: 'Email Us',
      description: 'For general inquiries and tsupport requests.',
      linkText: 'marketing@essindia.com',
      iconName: 'Mail',
      badge: null
    },
    {
      title: 'Visit Us',
      description: '3rd floor, Tower B, Lotus Business Sector - 127, Noida - 201313, U.P, India',
      linkText: null,
      iconName: 'MapPin',
      badge: 'HEAD OFFICE'
    }
  ];

  return (
    <div className="w-full bg-white py-14 px-6 border-b">
      <div className=" max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const IconComponent = iconMap[card.iconName] || MessageSquare;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#04247D] flex flex-col h-full relative group hover:border-[#5C2B6A] transition-colors duration-300">
                <div className="w-12 h-12 bg-[#f4f7ff] rounded-lg flex items-center justify-center mb-6 text-[#2A2B6E] group-hover:bg-[#2A2B6E] group-hover:text-white transition-colors duration-300">
                  <IconComponent size={24} strokeWidth={1.5} />
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{card.description}</p>
                </div>

                {card.linkText && (
                  <a href="#" className="text-[#2A2B6E] font-medium text-sm hover:underline mt-auto block">
                    {card.linkText}
                  </a>
                )}

                {card.badge && (
                  <div className="absolute top-8 right-8">
                    <span className="bg-[#4a2c5a] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                      {card.badge}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

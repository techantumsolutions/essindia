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
  contact?: string | null;
  icon?: string | null;
  linkText?: string | null;
  iconName?: string | null;
  badge?: string | null;
}

export interface ContactInfoCardsContent {
  cards?: ContactInfoCard[];
}

export function ContactInfoCards({ content }: { content?: ContactInfoCardsContent }) {
  const cards = content?.cards || [
    {
      title: 'Chat to Sales',
      description: 'Speak to our friendly team about plans and pricing.',
      contact: 'marketing@essindia.com',
      icon: '/Contact us/Frame 192.png'
    },
    {
      title: 'Phone Support',
      description: 'Mon - Fri from 8am to 6pm. We\'re here to help.',
      contact: '+91 120 4016020 - 39',
      icon: '/Contact us/Frame 194.png'
    },
    {
      title: 'Email Us',
      description: 'For general inquiries and support requests.',
      contact: 'marketing@essindia.com',
      icon: '/Contact us/Frame 196.png'
    },
    {
      title: 'Visit Us',
      description: '3rd floor, Tower B, Lotus Business Sector - 127, Noida - 201313, U.P, India',
      contact: 'Noida, India',
      icon: '/Contact us/Frame 217.png'
    }
  ];

  return (
    <div className="w-full bg-white py-14 px-6 border-b">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const contactVal = card.contact || card.linkText;
            const iconUrl = card.icon;
            const IconComponent = (card.iconName && iconMap[card.iconName]) || MessageSquare;

            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#04247D] flex flex-col h-full relative group hover:border-[#5C2B6A] transition-colors duration-300">
                <div className="w-12 h-12 bg-[#f4f7ff] rounded-lg flex items-center justify-center mb-6 text-[#2A2B6E] group-hover:bg-[#2A2B6E] group-hover:text-white transition-colors duration-300 p-2.5 overflow-hidden">
                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt={card.title} 
                      className="w-full h-full object-contain filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
                    />
                  ) : (
                    <IconComponent size={24} strokeWidth={1.5} />
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{card.description}</p>
                </div>

                {contactVal && (
                  <div className="mt-auto">
                    {contactVal.includes('@') ? (
                      <a href={`mailto:${contactVal}`} className="text-[#2A2B6E] font-semibold text-sm hover:underline block truncate">
                        {contactVal}
                      </a>
                    ) : contactVal.match(/[+0-9]/) ? (
                      <a href={`tel:${contactVal.replace(/\s+/g, '')}`} className="text-[#2A2B6E] font-semibold text-sm hover:underline block truncate">
                        {contactVal}
                      </a>
                    ) : (
                      <span className="text-[#2A2B6E] font-semibold text-sm block">
                        {contactVal}
                      </span>
                    )}
                  </div>
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

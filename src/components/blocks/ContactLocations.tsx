import { User, Phone, Mail } from 'lucide-react';

export interface ContactLocation {
  city: string;
  address: string;
  name?: string;
  person?: string;
  phone: string;
  email: string;
  pinImageUrl?: string;
}

export interface ContactLocationsContent {
  title?: string;
  description?: string;
  backgroundImageUrl?: string;
  locations?: ContactLocation[];
}

export function ContactLocations({ content }: { content?: ContactLocationsContent }) {
  const title = content?.title || "Our Global Footprint";
  const description = content?.description || "Headquartered in India with a strategic presence across Africa, the Middle East, USA, and Europe to support our global client base.";
  const backgroundImageUrl = content?.backgroundImageUrl || "/Contact us/world-map.png";

  const locations = content?.locations || [
    {
      city: 'Mumbai',
      address: '6th & 7th Floor, The Corporate Park, Sector 15, Vashi, Navi Mumbai-400705',
      person: 'Mr. Hariom Ram Patil',
      phone: '+91-9987817004',
      email: 'hariom.patil@essindia.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    },
    {
      city: 'Noida',
      address: '3rd floor, Tower B, Lotus Business Park, Sector 127, Noida - 201313, U.P, India',
      person: 'Mr. Gaurav Gupta',
      phone: '+91-9999059798',
      email: 'gaurav.gupta@essindia.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    },
    {
      city: 'Middle East',
      address: 'ESS FZE\nSaif Plus R5-20/B PO Box No. 121481 Sharjah, UAE',
      person: 'Mr. Gaurav Gupta',
      phone: '+91-9999059798',
      email: 'gaurav.gupta@essindia.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    },
    {
      city: 'Uganda',
      address: 'POB 7233 Millennium plaza, 2nd floor right wing 24 Pt, Spring Rd, Kampala, Uganda.',
      person: 'Mr. Bharat Gupta',
      phone: '+256 701 556 788 / +91 852788882',
      email: 'bharat.gupta@rebsolafrica.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    },
    {
      city: 'USA',
      address: '100 Church Street Suite 800 New York, NY 10007',
      person: 'Jacky',
      phone: '201-988-1222',
      email: 'jacky.hunter@essindia.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    },
    {
      city: 'Zambia',
      address: 'P.O. Box 50222 Ridgeway Lusaka, Zambia 10101 Unit 21, Mipeli Plaza, Plot 23203, Alick Nkhata Road',
      person: 'Swapnil Singh Rathore',
      phone: '+260 97 2723047',
      email: 'swapnil.rathore@esszambia.com',
      pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
    }
  ];

  return (
    <div className="relative w-full py-14 px-6 bg-[#F8F9FA] overflow-hidden">
      {/* Background Map Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
        style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={loc.pinImageUrl || "/Contact us/location-pin-alt-1_svgrepo.com.png"} alt="Location Pin" className="w-4 h-4 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{loc.city}</h3>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                  {loc.address}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <User size={16} className="shrink-0 mt-0.5 text-blue-500" strokeWidth={1.5} />
                  <span>{loc.name || loc.person}</span>
                </div>

                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <Phone size={16} className="shrink-0 mt-0.5 text-blue-500" strokeWidth={1.5} />
                  <span>{loc.phone}</span>
                </div>

                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <Mail size={16} className="shrink-0 mt-0.5 text-blue-500" strokeWidth={1.5} />
                  <a href={`mailto:${loc.email}`} className="hover:text-blue-600 hover:underline break-all">
                    {loc.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

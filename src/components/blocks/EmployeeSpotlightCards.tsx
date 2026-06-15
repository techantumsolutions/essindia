'use client';

import React from 'react';
import { motion } from 'framer-motion';

const EMPLOYEES = [
  {
    id: 'sunjay',
    name: 'SUNJAY PETKAR',
    subtitle: '100 Days, 1116 Km, One Inspiring Run',
    description: 'Before Dawn Breaks Over Navi Mumbai, While The City Still Sleeps, Mr. Sanjay Petkar Laces Up His Running Shoes And Steps Into The Quiet Streets, Turning Every Stride Into A Pledge For Both Personal Fitness And A Greener Planet.',
    quote: '“Every Run Is A Step Towards A Healthier Me\nAnd A Cleaner Planet.”',
    image: '/About-employee spot light/image 112.png',
    nameColor: 'text-[#4a2c5a]',
    stats: [
      { icon: '/About-employee spot light/Container/Vector.png', value: '100 DAYS', label: 'No Days Missed' },
      { icon: '/About-employee spot light/Container/Frame 213.png', value: '1,116 KM', label: 'Total Distance Covered' },
      { icon: '/About-employee spot light/Container/weight-dumbbells_svgrepo.com.png', value: '12 Kg', label: 'Weight Lost' },
      { icon: '/About-employee spot light/Container/Group.png', value: '500M TO 5KM', label: 'Struggle Into Strength' }
    ],
    pills: [
      { icon: '/About-employee spot light/Container/Frame 210.png', title: '280th', subtitle: 'out of 10,806 participants' },
      { icon: '/About-employee spot light/Container/Frame 214.png', title: '73rd', subtitle: 'in his age group' },
      { icon: '/About-employee spot light/Container/Frame 215.png', title: 'Finisher Medal', subtitle: 'Proudly earned from his coach' }
    ]
  },
  {
    id: 'nitin',
    name: 'NITIN SHUKLA',
    subtitle: 'The Man Turning Waste Into Life\nNitin Shukla – An Eco Warrior Employee',
    description: 'Every Morning At 5 AM, Nitin Shukla Begins His Day Not With E-Mails Or Meetings—But With His 100+ Beloved Plants Spread Across His Four Balconies. From Tall Ashoka And Bael Trees To Graceful Bamboo Shoots, Each Plant Tells A Story Of Care, Love, And One Man\'s Dedication To A Greener World.',
    quote: '“Every Small Action Matters For A Cleaner Future.”',
    image: '/About-employee spot light/image 113.png',
    nameColor: 'text-[#5C2B6A]',
    stats: [
      { icon: '/About-employee spot light/Container/plant-pot-plant_svgrepo.com.png', value: '100+', label: 'Plants' },
      { icon: '/About-employee spot light/Container/calendar-tick_svgrepo.com-1.png', value: '10', label: 'Years Composting' },
      { icon: '/About-employee spot light/Vector.png', value: '50 KG', label: 'Organic Manure / Year' },
      { icon: '/About-employee spot light/Container/recycle-3_svgrepo.com.png', value: '2-3 KG', label: 'Waste Recycled Daily' }
    ]
  },
  {
    id: 'lalit',
    name: 'LALIT KUMAR',
    subtitle: 'Lalit Rides His Way To A Cleaner Tomorrow\nA Small Ride. A Big Impact.',
    description: 'We Would Like You To Meet Mr Lalit Kumar, Our Eco-Conscious Champion Who Pedals 42km For Work Every Day Proving How Small Contributions Can Make A Big Impact To The Environment. What Started As A Practical Solution To Avoid Traffic Jams Has Transformed Into A Lifestyle Choice That Promotes Health, Reduces Carbon Footprint And Raises Environmental Awareness. Lalit Is A Part Of The RPA Delivery Team At ESS.',
    quote: '“Every Little Ride Today, Leads To A Cleaner Tomorrow.”',
    image: '/About-employee spot light/image 115.png',
    nameColor: 'text-[#4a2c5a]',
    stats: [
      { icon: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '42 Km', label: 'Every Day Rides To Work' },
      { icon: '/About-employee spot light/Container/calendar-tick_svgrepo.com-1.png', value: '3 Years', label: 'Of Consistent Cyclingt' },
      { icon: '/About-employee spot light/Container/co2_svgrepo.com.png', value: '2 Tons', label: 'Reducing CO₂ Every Year' },
      { icon: '/About-employee spot light/Container/eco-ecology-nature-4_svgrepo.com.png', value: '2-3 KG', label: 'Healthier Lifestyle' }
    ]
  },
  {
    id: 'omendra',
    name: 'OMENDRA',
    subtitle: '22,000 KM ON PEDALS –\nOMENDRA’S UNSTOPPABLE GREEN JOURNEY',
    description: 'Pedaling For Fitness. Driving For A Greener Planet.\n\nLet Us Introduce You To Omendra — A Driving Force In Our Accounts Team And A Passionate Cyclist Who\'s Not Only Balancing Numbers But Also Championing A Greener Planet! Covering 25 Km Daily From Home To Office And Back, He Proves That Fitness And Sustainability Can Go Hand In Hand.',
    quote: '“When You\'re Cycling In The Morning, Feeling The Breeze, And Soaking In Nature, It\'s A Different Kind Of Happiness.”',
    image: '/About-employee spot light/Rectangle 4306.png',
    nameColor: 'text-[#5C2B6A]',
    stats: [
      { icon: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '22,000+ KM', label: 'Cycled In 3 Years' },
      { icon: '/About-employee spot light/Container/route_svgrepo.com.png', value: '25 KM', label: 'Daily Commute\n(Home To Office & Back)' },
      { icon: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '150 KM', label: 'Every Week' },
      { icon: '/About-employee spot light/Container/co2_svgrepo.com.png', value: '100 KM', label: 'Reducing CO₂ Every Year' }
    ]
  }
];

export function EmployeeSpotlightCards({ content }: { content?: any }) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-16">
          {EMPLOYEES.map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-md overflow-hidden p-8 border border-gray-300"
            >
              <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h2 className={`text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight mb-1 uppercase ${emp.nameColor}`}>
                      {emp.name}
                    </h2>
                    <h3 className="text-xl md:text-2xl lg:text-[28px] text-gray-800 font-normal leading-snug whitespace-pre-line">
                      {emp.subtitle}
                    </h3>
                  </div>

                  <p className="text-gray-500 leading-relaxed text-sm md:text-[15px] font-medium max-w-3xl whitespace-pre-line">
                    {emp.description}
                  </p>

                  <div className="font-bold text-black text-xl md:text-2xl pt-2">
                    {emp.quote.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < emp.quote.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-6">
                    {emp.stats.map((stat, i) => (
                      <div key={i} className="bg-white border border-[#4a2c5a] rounded-2xl py-4 px-1 flex flex-col items-center justify-center text-center">
                        <div className="h-[33px] flex items-center justify-center mb-3">
                          <img src={stat.icon} alt={stat.label} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="font-light text-[#333333] text-[12px] lg:text-[15px] leading-none mb-1.5 uppercase whitespace-nowrap">{stat.value}</div>
                        <div className="text-[10px] text-black font-bold tracking-tight leading-none whitespace-pre-line">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pills if any */}
                  {emp.pills && (
                    <div className="w-full md:w-fit max-w-full flex flex-wrap md:flex-nowrap gap-4 lg:gap-8 items-center justify-start bg-white rounded-2xl px-4 lg:px-6 py-4 border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] mt-4">
                      {emp.pills.map((pill, i) => (
                        <div key={i} className="flex items-center gap-2 min-w-0">
                          <img src={pill.icon} alt={pill.subtitle} className="w-8 h-8 lg:w-11 lg:h-11 object-contain shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] lg:text-[18px] font-light text-[#333333] leading-none mb-1 whitespace-nowrap">{pill.title}</span>
                            <span className="text-[12px] text-[#666666] leading-[1.2] whitespace-normal">{pill.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                  <div className="relative w-full">
                    {/* Circle Background Pattern (simulated if image doesn't have it natively, but assuming the image has it) */}
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-full h-auto object-contain relative z-10 max-h-[800px]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FormattedText } from '@/components/ui/FormattedText';

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
      { iconImage: '/About-employee spot light/Container/Vector.png', value: '100 DAYS', label: 'No Days Missed' },
      { iconImage: '/About-employee spot light/Container/Frame 213.png', value: '1,116 KM', label: 'Total Distance Covered' },
      { iconImage: '/About-employee spot light/Container/weight-dumbbells_svgrepo.com.png', value: '12 Kg', label: 'Weight Lost' },
      { iconImage: '/About-employee spot light/Container/Group.png', value: '500M TO 5KM', label: 'Struggle Into Strength' }
    ],
    pills: [
      { iconImage: '/About-employee spot light/Container/Frame 210.png', title: '280th', subtitle: 'out of 10,806 participants' },
      { iconImage: '/About-employee spot light/Container/Frame 214.png', title: '73rd', subtitle: 'in his age group' },
      { iconImage: '/About-employee spot light/Container/Frame 215.png', title: 'Finisher Medal', subtitle: 'Proudly earned from his coach' }
    ]
  },
  {
    id: 'nitin',
    name: 'NITIN SHUKLA',
    subtitle: 'Turning Everyday Waste Into\nTomorrow\'s Green Spaces',
    description: 'Every Morning At 5 AM, Nitin Shukla Begins His Day Not With E-Mails Or Meetings—But With His 100+ Beloved Plants Spread Across His Four Balconies. From Tall Ashoka And Bael Trees To Graceful Bamboo Shoots, Each Plant Tells A Story Of Care, Love, And One Man\'s Dedication To A Greener World.',
    quote: '“Every Small Action Matters For A Cleaner Future.”',
    image: '/About-employee spot light/image 113.png',
    nameColor: 'text-[#5C2B6A]',
    stats: [
      { iconImage: '/About-employee spot light/Container/plant-pot-plant_svgrepo.com.png', value: '100+', label: 'Plants' },
      { iconImage: '/About-employee spot light/Container/calendar-tick_svgrepo.com-1.png', value: '10', label: 'Years Composting' },
      { iconImage: '/About-employee spot light/Vector.png', value: '50 KG', label: 'Organic Manure / Year' },
      { iconImage: '/About-employee spot light/Container/recycle-3_svgrepo.com.png', value: '2-3 KG', label: 'Waste Recycled Daily' }
    ]
  },
  {
    id: 'lalit',
    name: 'LALIT KUMAR',
    subtitle: 'Not Every Hero Drives,\nSome Pedal.',
    description: 'We Would Like You To Meet Mr Lalit Kumar, Our Eco-Conscious Champion Who Pedals 42km For Work Every Day Proving How Small Contributions Can Make A Big Impact To The Environment. What Started As A Practical Solution To Avoid Traffic Jams Has Transformed Into A Lifestyle Choice That Promotes Health, Reduces Carbon Footprint And Raises Environmental Awareness. Lalit Is A Part Of The RPA Delivery Team At ESS.',
    quote: '“Every Little Ride Today, Leads To A Cleaner Tomorrow.”',
    image: '/About-employee spot light/image 115.png',
    nameColor: 'text-[#4a2c5a]',
    stats: [
      { iconImage: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '42 Km', label: 'Every Day Rides To Work' },
      { iconImage: '/About-employee spot light/Container/calendar-tick_svgrepo.com-1.png', value: '3 Years', label: 'Of Consistent Cyclingt' },
      { iconImage: '/About-employee spot light/Container/co2_svgrepo.com.png', value: '2 Tons', label: 'Reducing CO₂ Every Year' },
      { iconImage: '/About-employee spot light/Container/eco-ecology-nature-4_svgrepo.com.png', value: '2-3 KG', label: 'Healthier Lifestyle' }
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
      { iconImage: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '22,000+ KM', label: 'Cycled In 3 Years' },
      { iconImage: '/About-employee spot light/Container/route_svgrepo.com.png', value: '25 KM', label: 'Daily Commute\n(Home To Office & Back)' },
      { iconImage: '/About-employee spot light/Container/bicycle_svgrepo.com.png', value: '150 KM', label: 'Every Week' },
      { iconImage: '/About-employee spot light/Container/co2_svgrepo.com.png', value: '100 KM', label: 'Reducing CO₂ Every Year' }
    ]
  }
];

export function EmployeeSpotlightCards({ content }: { content?: any }) {
  const employees = content?.employees || EMPLOYEES;
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [hoveredEmpIdx, setHoveredEmpIdx] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 15) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setActiveIndex(0);
      return;
    }

    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < maxScroll - 15);

    const index = Math.round(scrollLeft / (clientWidth / 3 || 1));
    setActiveIndex(Math.min(Math.max(index, 0), employees.length - 1));
  }, [employees.length]);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
    }
    const t1 = setTimeout(updateScrollState, 100);
    const t2 = setTimeout(updateScrollState, 400);
    return () => {
      if (el) {
        el.removeEventListener('scroll', updateScrollState);
      }
      window.removeEventListener('resize', updateScrollState);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateScrollState, employees]);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth / 3;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardStep = firstCard ? firstCard.offsetWidth + 24 : el.clientWidth / 3;
    const scrollAmount = direction === 'left' ? -cardStep : cardStep;
    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateScrollState, 100);
    setTimeout(updateScrollState, 350);
    setTimeout(updateScrollState, 500);
  };

  return (
    <section className="py-16 bg-[#fcfbfe] border-b relative">
      <div className="container mx-auto px-4 max-w-7xl relative">
        
        <div className="relative group/carousel">
          {/* Scroll Left Button - Outside on left, conditionally visible */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll Left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-2 lg:-translate-x-4 xl:-translate-x-14 2xl:-translate-x-16 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-purple-700 shadow-md border border-purple-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Scroll Right Button - Outside on right, conditionally visible */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll Right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-2 lg:translate-x-4 xl:translate-x-14 2xl:translate-x-16 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-purple-700 shadow-md border border-purple-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth py-4 px-2 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {employees.map((emp: any, index: number) => {
              const isSelected = selectedEmp?.id === emp.id || selectedEmp?.name === emp.name;
              const isBtnHovered = hoveredEmpIdx === index;
              return (
                <motion.div
                  key={emp.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start shadow-sm hover:shadow-md transition-all duration-300 relative group ${
                    isSelected ? 'border-purple-400 ring-2 ring-purple-400/20' : 'border-slate-200'
                  }`}
                >
                  {/* Left Side: Name, Subtitle, Divider & Expand Button */}
                  <div className="flex-1 space-y-3 pr-2 w-full text-left">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#2e2640] tracking-tight uppercase">
                        {emp.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug mt-1 whitespace-pre-line line-clamp-2">
                        {emp.subtitle}
                      </p>
                    </div>

                    {/* Expand button */}
                    <div className="pt-1">
                      <button
                        onClick={() => setSelectedEmp(isSelected ? null : emp)}
                        onMouseEnter={() => setHoveredEmpIdx(index)}
                        onMouseLeave={() => setHoveredEmpIdx(null)}
                        style={
                          isBtnHovered && (emp.buttonHoverBgColor || emp.buttonHoverTextColor)
                            ? {
                                backgroundColor: emp.buttonHoverBgColor || undefined,
                                color: emp.buttonHoverTextColor || undefined,
                                borderColor: emp.buttonHoverBgColor || undefined,
                              }
                            : undefined
                        }
                        className={`inline-flex items-center gap-0.5 border border-purple-300 text-purple-800 ${
                          emp.buttonHoverBgColor ? '' : 'hover:bg-purple-50'
                        } text-[8px] font-medium leading-none px-1.5 py-[2px] rounded-sm transition-all duration-200 cursor-pointer tracking-tight`}
                      >
                        <span>{isSelected ? 'Collapse' : 'Expand to see more'}</span>
                        <ArrowRight className={`w-1.5 h-1.5 transition-transform duration-200 ${isSelected ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Image with Circular Gradient Graphic */}
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 mt-4 sm:mt-0 flex items-center justify-center">
                    {/* Outer Circular Gradient Background */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50/60 via-purple-50/30 to-slate-100/40" />

                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Full View Inline Expanded Card (below carousel, not a popup) */}
      <AnimatePresence>
        {selectedEmp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-4 max-w-7xl mt-12 overflow-hidden"
          >
            {/* Top Indicator Triangle pointing to selected card */}
            <div className="flex justify-center -mb-2 z-10 relative">
              <div className="w-4 h-4 bg-white border-t border-l border-purple-300 transform rotate-45" />
            </div>

            <div className="relative w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 border border-purple-200">
              {/* Close / Collapse Button */}
              <button
                onClick={() => setSelectedEmp(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Collapse view"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6 text-left">
                  <div>
                    <h2 className={`text-3xl sm:text-4xl lg:text-[48px] font-black tracking-tight mb-1 uppercase ${selectedEmp.nameColor || 'text-[#4a2c5a]'}`}>
                      {selectedEmp.name}
                    </h2>
                    <h3 className="text-lg sm:text-xl lg:text-[24px] text-gray-800 font-normal leading-snug whitespace-pre-line">
                      {selectedEmp.subtitle}
                    </h3>
                  </div>

                  <FormattedText
                    content={selectedEmp.description}
                    className="text-gray-500 leading-relaxed text-sm md:text-[15px] font-medium max-w-3xl whitespace-pre-line"
                  />

                  {selectedEmp.quote && (
                    <div className="font-bold text-black text-lg md:text-xl pt-2 border-l-4 border-purple-400 pl-4">
                      {selectedEmp.quote.split('\n').map((line: string, idx: number) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < selectedEmp.quote.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Stats Grid */}
                  {selectedEmp.stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-4">
                      {selectedEmp.stats.map((stat: any, i: number) => (
                        <div key={i} className="bg-white border border-[#4a2c5a] rounded-2xl py-3 px-1 flex flex-col items-center justify-center text-center">
                          <div className="h-[30px] flex items-center justify-center mb-2">
                            <img src={stat.iconImage || stat.icon} alt={stat.label} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="font-light text-[#333333] text-[12px] lg:text-[14px] leading-none mb-1 uppercase whitespace-nowrap">{stat.value}</div>
                          <div className="text-[10px] text-black font-bold tracking-tight leading-none whitespace-pre-line">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pills */}
                  {selectedEmp.pills && (
                    <div className="w-full flex flex-wrap gap-4 items-center justify-start bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 mt-4">
                      {selectedEmp.pills.map((pill: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 min-w-0">
                          <img src={pill.iconImage || pill.icon} alt={pill.subtitle} className="w-8 h-8 lg:w-10 lg:h-10 object-contain shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[12px] lg:text-[16px] font-medium text-[#333333] leading-none mb-1 whitespace-nowrap">{pill.title}</span>
                            <span className="text-[11px] text-[#666666] leading-[1.2] whitespace-normal">{pill.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 flex justify-center relative">
                  <div className="relative w-full max-w-[450px]">
                    <img
                      src={selectedEmp.image}
                      alt={selectedEmp.name}
                      className="w-full h-auto object-contain max-h-[600px] mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

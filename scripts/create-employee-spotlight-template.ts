import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Employee Spotlight Template';

  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.name, templateName)
  });

  if (existingTemplate) {
    console.log(`Template "${templateName}" already exists with ID:`, existingTemplate.id);
    console.log('Deleting existing template to recreate it with fields...');
    await db.delete(templates).where(eq(templates.slug, existingTemplate.slug));
  }

  const sectionsData = [
    { 
      name: 'Employee Spotlight Hero', 
      type: 'employee-spotlight-hero',
      contentJson: {
        badge: 'Employee Spotlight',
        title: 'Everyday Heroes. Greener<br />Tomorrow.',
        description: 'At ESS, sustainability isn\'t just a choice—it\'s a lifestyle. Meet the trailblazers among us who are leading the charge for a cleaner planet. From daily cycles to inspiring runs, discover how our team is turning eco-conscious choices into habits that matter.',
        image: '/About-employee spot light/banner.png'
      }
    },
    { 
      name: 'Employee Spotlight Cards', 
      type: 'employee-spotlight-cards',
      contentJson: {
        employees: [
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
            subtitle: 'The Man Turning Waste Into Life\nNitin Shukla – An Eco Warrior Employee',
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
            subtitle: 'Lalit Rides His Way To A Cleaner Tomorrow\nA Small Ride. A Big Impact.',
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
        ]
      }
    }
  ];

  const targetSections = [];
  for (const s of sectionsData) {
    const existingSection = await db.query.sections.findFirst({
      where: eq(sections.name, s.name)
    });

    if (existingSection) {
      console.log(`Section "${s.name}" already exists. Using existing ID.`);
      await db.update(sections)
        .set({ contentJson: s.contentJson })
        .where(eq(sections.id, existingSection.id));
        
      targetSections.push(existingSection);
    } else {
      const hash = crypto.randomBytes(16).toString('hex');
      const [created] = await db.insert(sections).values({
        name: s.name,
        type: s.type,
        variant: 'default',
        identityHash: hash,
        contentJson: s.contentJson,
        status: 'published',
      }).returning();
      console.log(`Created new section "${s.name}".`);
      targetSections.push(created);
    }
  }

  const slug = slugify(templateName) + '-' + Date.now();
  
  const [template] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'A template for showcasing employee spotlights with hero and interactive cards.',
    status: 'active',
  }).returning();

  await db.insert(templateSections).values(
    targetSections.map((s, i) => ({
      templateId: template.id,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant || 'default',
      contentJson: sectionsData[i].contentJson,
      orderIndex: i,
    }))
  );

  console.log('Template created with ID:', template.id);
  console.log('Sections added to library:', targetSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));

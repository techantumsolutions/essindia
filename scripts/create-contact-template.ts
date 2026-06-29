import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Contact Page Template';

  // Check if template already exists
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
      name: 'Contact Hero Section', 
      type: 'contact-hero',
      contentJson: {
        bgColor: "#000000",
        badgeBgColor: "#ffffff",
        badgeText: "Contact Our Team",
        badgeTextColor: "#5C2B6A",
        title: "How can we help you\nsucceed?",
        titleColor: "#ffffff",
        description: "Have questions about our platform or need a custom solution? Our experts are here to help your business scale with Finspring.",
        descriptionColor: "#d1d5db",
        backgroundImageUrl: "/Contact us/banner.png"
      }
    },
    { 
      name: 'Contact Info Cards', 
      type: 'contact-info-cards',
      contentJson: {
        cards: [
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
        ]
      }
    },
    { 
      name: 'Contact Form & FAQ', 
      type: 'contact-form-faq',
      contentJson: {
        formTitle: "Send us a Message",
        formDescription: "Fill out the form below and our team will get back to you within 24 hours. For urgent security matters, please use our emergency support line.",
        faqTitle: "Common Questions",
        faqs: [
          {
            quotation: "How fast do you respond?",
            answer: "We aim to respond to all inquiries within 24 hours during business days. Priority support is available for Enterprise customers."
          },
          {
            quotation: "Do you offer 24/7 support?",
            answer: "Yes, our technical support team is available 24/7 for critical system issues for our Platinum and Enterprise plan members."
          },
          {
            quotation: "How can I get started with ESS solutions?",
            answer: "Simply submit your inquiry through our Contact Us page, and our team will connect with you to understand your requirements."
          },
          {
            quotation: "Can I request a product demo?",
            answer: "Yes, you can contact our team to schedule a free product demo and consultation."
          },
          {
            quotation: "Do you provide post-implementation support?",
            answer: "Yes, ESS offers ongoing technical support, maintenance, upgrades, and managed services after deployment."
          }
        ]
      }
    },
    { 
      name: 'Contact Global Footprint', 
      type: 'contact-locations',
      contentJson: {
        title: "Our Global Footprint",
        description: "Headquartered in India with a strategic presence across Africa, the Middle East, USA, and Europe to support our global client base.",
        backgroundImageUrl: "/Contact us/world-map.png",
        locations: [
          {
            city: 'Mumbai',
            address: '6th & 7th Floor, The Corporate Park, Sector 15, Vashi, Navi Mumbai-400705',
            name: 'Mr. Hariom Ram Patil',
            phone: '+91-9987817004',
            email: 'hariom.patil@essindia.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          },
          {
            city: 'Noida',
            address: '3rd floor, Tower B, Lotus Business Park, Sector 127, Noida - 201313, U.P, India',
            name: 'Mr. Gaurav Gupta',
            phone: '+91-9999059798',
            email: 'gaurav.gupta@essindia.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          },
          {
            city: 'Middle East',
            address: 'ESS FZE\nSaif Plus R5-20/B PO Box No. 121481 Sharjah, UAE',
            name: 'Mr. Gaurav Gupta',
            phone: '+91-9999059798',
            email: 'gaurav.gupta@essindia.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          },
          {
            city: 'Uganda',
            address: 'POB 7233 Millennium plaza, 2nd floor right wing 24 Pt, Spring Rd, Kampala, Uganda.',
            name: 'Mr. Bharat Gupta',
            phone: '+256 701 556 788 / +91 852788882',
            email: 'bharat.gupta@rebsolafrica.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          },
          {
            city: 'USA',
            address: '100 Church Street Suite 800 New York, NY 10007',
            name: 'Jacky',
            phone: '201-988-1222',
            email: 'jacky.hunter@essindia.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          },
          {
            city: 'Zambia',
            address: 'P.O. Box 50222 Ridgeway Lusaka, Zambia 10101 Unit 21, Mipeli Plaza, Plot 23203, Alick Nkhata Road',
            name: 'Swapnil Singh Rathore',
            phone: '+260 97 2723047',
            email: 'swapnil.rathore@esszambia.com',
            pinImageUrl: '/Contact us/location-pin-alt-1_svgrepo.com.png'
          }
        ]
      }
    },
    { 
      name: 'Contact Map Section', 
      type: 'contact-map',
      contentJson: {
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.3523498808546!2d77.3371900742881!3d28.528456687050516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5cf518a24bd%3A0x6b7fa4366eb4fcd3!2sLotus%20Business%20Park%2C%20Sector%20127%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
      
      // Update existing section with content schema
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
    description: 'A dedicated template for the Contact Us page, featuring a hero, message form, FAQs, global footprint, and location map.',
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

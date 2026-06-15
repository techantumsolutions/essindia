import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/blocks/ContactHero';
import { ContactInfoCards } from '@/components/blocks/ContactInfoCards';
import { ContactFormFaq } from '@/components/blocks/ContactFormFaq';
import { ContactLocations } from '@/components/blocks/ContactLocations';
import { ContactMap } from '@/components/blocks/ContactMap';

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="bg-white min-h-screen">
        <ContactHero />
        <ContactInfoCards />
        <ContactFormFaq />
        <ContactLocations />
        <ContactMap />
      </div>
    </MainLayout>
  );
}

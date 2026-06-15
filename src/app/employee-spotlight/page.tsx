import { MainLayout } from '@/components/layout/MainLayout';
import { EmployeeSpotlightHero } from '@/components/blocks/EmployeeSpotlightHero';
import { EmployeeSpotlightCards } from '@/components/blocks/EmployeeSpotlightCards';

export const metadata = {
  title: 'Employee Spotlight | ESS India',
  description: 'Meet the trailblazers among us who are leading the charge for a cleaner planet.',
};

export default function EmployeeSpotlightPage() {
  return (
    <MainLayout>
      <EmployeeSpotlightHero />
      <EmployeeSpotlightCards />
    </MainLayout>
  );
}

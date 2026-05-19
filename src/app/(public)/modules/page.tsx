import { MainLayout } from '@/components/layout/MainLayout';

export const metadata = {
  title: 'ERP Modules | ESS India',
  description: 'Explore our comprehensive ERP modules designed for manufacturing, finance, HR, and more.',
};

export default function ModulesPage() {
  return (
    <MainLayout>
      <div className="w-full bg-[#f8f9fa] pt-24 md:pt-32">
        <div className="w-full max-w-[1920px] mx-auto overflow-hidden shadow-2xl">
          <img 
            src="/modules-page.png" 
            alt="Modules Overview" 
            className="w-full h-auto block"
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </MainLayout>
  );
}

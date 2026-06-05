import { BlogDetailSection } from '@/components/blocks/BlogDetailSection';
import { MainLayout } from '@/components/layout/MainLayout';
import { pageRepository } from '@/repositories/page.repository';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { defaultBlogs } from '@/lib/blogs-data';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const fullPath = `/blog/${slug}`;
  const page = await pageRepository.getPageByPath(fullPath);

  if (page) {
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
    };
  }

  const blogItem = defaultBlogs.find(b => b.slug === slug);
  if (blogItem) {
    return {
      title: `${blogItem.title} | ESS India Blog`,
      description: blogItem.description,
    };
  }

  return {};
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const fullPath = `/blog/${slug}`;

  // 1. Try to load from database CMS page
  const page = await pageRepository.getPageByPath(fullPath);
  if (page && page.sections && page.sections.length > 0) {
    return (
      <MainLayout>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </MainLayout>
    );
  }

  // 2. Fall back to static mock data if it matches any of our 9 default blogs
  const blogItem = defaultBlogs.find(b => b.slug === slug);
  if (blogItem) {
    // If it's the specific Power BI blog post, render with custom diagram / highlights
    if (slug === 'how-power-bi-services-fix-multi-system-data-mismatches' || slug === 'how-power-bi-services-help-fix-multi-system-data-mismatches') {
      return (
        <MainLayout>
          <BlogDetailSection />
        </MainLayout>
      );
    }

    // For other blogs, render default details using card parameters
    return (
      <MainLayout>
        <BlogDetailSection content={{
          category: blogItem.topic,
          title: blogItem.title,
          authorName: blogItem.author.name,
          authorAvatar: blogItem.author.avatar,
          date: blogItem.date,
          image: blogItem.image,
          description: blogItem.description,
          contentHtml: `<p class="text-slate-600 leading-relaxed mb-6">${blogItem.description}</p><p class="text-slate-600 leading-relaxed">This article is currently a template placeholder. You can customize and publish this page with full contents inside the CMS admin editor.</p>`
        }} />
      </MainLayout>
    );
  }

  return notFound();
}

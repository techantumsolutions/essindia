import { BlogDetailSection } from '@/components/blocks/BlogDetailSection';
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

  const page = await pageRepository.getPageByPath(fullPath);
  if (page && page.sections && page.sections.length > 0) {
    return (
      <>
        {page.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  const blogItem = defaultBlogs.find(b => b.slug === slug);
  if (blogItem) {
    if (slug === 'how-power-bi-services-fix-multi-system-data-mismatches' || slug === 'how-power-bi-services-help-fix-multi-system-data-mismatches') {
      return <BlogDetailSection />;
    }

    return (
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
    );
  }

  return notFound();
}

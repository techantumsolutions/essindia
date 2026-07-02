import React from 'react';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { careers } from '@/lib/db/schema';
import CareerDetailClient from './CareerDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  let job;
  try {
    job = await db.query.careers.findFirst({
      where: eq(careers.slug, slug),
    });
  } catch (e) {
    // Ignore database fetch errors in metadata generator
  }

  if (job && job.status === 'active') {
    return {
      title: `${job.title} | Careers at ESS India`,
      description: job.description || `Apply for the ${job.title} position in the ${job.department} department at ESS India.`,
    };
  }

  return {
    title: 'Career Opening | ESS India',
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;

  let job;
  try {
    job = await db.query.careers.findFirst({
      where: eq(careers.slug, slug),
    });
  } catch (e) {
    console.error('Error fetching career opening:', e);
  }

  if (!job || job.status !== 'active') {
    return notFound();
  }

  // Format array fields for type safety
  const formattedJob = {
    id: job.id,
    title: job.title,
    slug: job.slug,
    department: job.department,
    description: job.description,
    type: job.type,
    experience: job.experience,
    location: job.location,
    aboutText: job.aboutText,
    requirements: Array.isArray(job.requirements) ? (job.requirements as string[]) : [],
    responsibilities: Array.isArray(job.responsibilities) ? (job.responsibilities as string[]) : [],
    niceToHave: Array.isArray(job.niceToHave) ? (job.niceToHave as string[]) : [],
    whatWeOffer: Array.isArray(job.whatWeOffer) ? (job.whatWeOffer as string[]) : [],
    status: job.status,
    jdUrl: job.jdUrl || null,
  };

  return (
    <MainLayout>
      <CareerDetailClient job={formattedJob} />
    </MainLayout>
  );
}

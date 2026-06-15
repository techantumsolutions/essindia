import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { db } from '@/lib/db';
import { applications, careers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    // List all candidate applications with job titles
    const list = await db
      .select({
        id: applications.id,
        fullName: applications.fullName,
        email: applications.email,
        phone: applications.phone,
        experience: applications.experience,
        currentCompany: applications.currentCompany,
        noticePeriod: applications.noticePeriod,
        linkedInProfile: applications.linkedInProfile,
        portfolioUrl: applications.portfolioUrl,
        resumeUrl: applications.resumeUrl,
        coverLetter: applications.coverLetter,
        status: applications.status,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
        jobTitle: careers.title,
        jobDepartment: careers.department,
      })
      .from(applications)
      .innerJoin(careers, eq(applications.careerId, careers.id))
      .orderBy(desc(applications.createdAt));

    return NextResponse.json(list);
  } catch (error) {
    return serverError(error);
  }
}

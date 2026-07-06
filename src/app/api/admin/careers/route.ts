import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { db } from '@/lib/db';
import { careers, applications } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { serverError, unauthorized, badRequest } from '@/lib/cms/api-response';
import { uniqueSlug } from '@/lib/slugify';

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    // List all careers along with count of applications
    const list = await db
      .select({
        id: careers.id,
        title: careers.title,
        slug: careers.slug,
        department: careers.department,
        description: careers.description,
        type: careers.type,
        experience: careers.experience,
        location: careers.location,
        aboutText: careers.aboutText,
        requirements: careers.requirements,
        responsibilities: careers.responsibilities,
        niceToHave: careers.niceToHave,
        whatWeOffer: careers.whatWeOffer,
        status: careers.status,
        jdUrl: careers.jdUrl,
        budgetRange: careers.budgetRange,
        createdAt: careers.createdAt,
        updatedAt: careers.updatedAt,
        applicantCount: sql<number>`count(${applications.id})::int`,
      })
      .from(careers)
      .leftJoin(applications, eq(applications.careerId, careers.id))
      .groupBy(careers.id)
      .orderBy(desc(careers.createdAt));

    return NextResponse.json(list);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const {
      title,
      department,
      description,
      type,
      experience,
      location,
      aboutText,
      requirements,
      responsibilities,
      niceToHave,
      whatWeOffer,
      status,
      jdUrl,
      budgetRange,
    } = body;

    if (!title || !department || !description || !experience || !location || !aboutText) {
      return badRequest('Missing required fields');
    }

    // Auto-generate a unique slug from the title
    const slug = await uniqueSlug(title, async (candidate) => {
      const existing = await db.query.careers.findFirst({
        where: eq(careers.slug, candidate),
      });
      return !!existing;
    });

    const [created] = await db
      .insert(careers)
      .values({
        title,
        slug,
        department,
        description,
        type: type || 'Full-Time',
        experience,
        location,
        aboutText,
        requirements: requirements || [],
        responsibilities: responsibilities || [],
        niceToHave: niceToHave || [],
        whatWeOffer: whatWeOffer || [],
        status: status || 'active',
        jdUrl: jdUrl || null,
        budgetRange: budgetRange || null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

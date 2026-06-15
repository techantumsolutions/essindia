import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { careers, applications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, serverError, badRequest } from '@/lib/cms/api-response';
import { StorageService } from '@/lib/storage/r2';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: careerId } = await params;
    const job = await db.query.careers.findFirst({
      where: eq(careers.id, careerId),
    });
    if (!job) return notFound('Position not found');

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const experience = formData.get('experience') as string | null;
    const currentCompany = formData.get('currentCompany') as string | null;
    const noticePeriod = formData.get('noticePeriod') as string | null;
    const linkedInProfile = formData.get('linkedInProfile') as string | null;
    const portfolioUrl = formData.get('portfolioUrl') as string | null;
    const coverLetter = formData.get('coverLetter') as string | null;
    const file = formData.get('resume') as File | null;

    if (!fullName || !email || !phone || !experience || !noticePeriod || !file) {
      return badRequest('Required fields are missing');
    }

    // Process file upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'pdf';
    const key = `resumes/${randomUUID()}.${ext}`;
    let resumeUrl: string;

    const hasR2 =
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME;

    if (hasR2) {
      resumeUrl = await StorageService.uploadFile(key, buffer, file.type);
    } else {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
      await mkdir(uploadDir, { recursive: true });
      const filename = `${randomUUID()}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);
      resumeUrl = `/uploads/resumes/${filename}`;
    }

    const [app] = await db
      .insert(applications)
      .values({
        careerId,
        fullName,
        email,
        phone,
        experience,
        currentCompany: currentCompany || null,
        noticePeriod,
        linkedInProfile: linkedInProfile || null,
        portfolioUrl: portfolioUrl || null,
        resumeUrl,
        coverLetter: coverLetter || null,
        status: 'applied',
      })
      .returning();

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

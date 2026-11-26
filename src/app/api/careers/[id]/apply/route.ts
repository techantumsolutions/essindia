import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { careers, applications, careersSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, badRequest } from '@/lib/cms/api-response';
import { StorageService } from '@/lib/storage/r2';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { sendApplicationEmails } from '@/lib/email';
import { validateAndFormatPhone } from '@/lib/phone-validation';
import {
  FORM_RATE_LIMIT_ERROR,
  FORM_SUBMIT_ERROR,
  validateCompany,
  validateEmail,
  validateName,
  validateUrl,
} from '@/lib/form-validation';
import { consumeFormRateLimit, getRequestIp } from '@/lib/form-rate-limit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: careerId } = await params;
    const job = await db.query.careers.findFirst({
      where: eq(careers.id, careerId),
    });
    if (!job || job.status !== 'active') return notFound('Position not found');

    const ip = getRequestIp(request);
    if (!consumeFormRateLimit(`career-apply:${ip}`)) {
      return NextResponse.json({ error: FORM_RATE_LIMIT_ERROR }, { status: 429 });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const countryCode = formData.get('countryCode') as string | null;
    const experience = formData.get('experience') as string | null;
    const currentCompany = formData.get('currentCompany') as string | null;
    const noticePeriod = formData.get('noticePeriod') as string | null;
    const linkedInProfile = formData.get('linkedInProfile') as string | null;
    const portfolioUrl = formData.get('portfolioUrl') as string | null;
    const coverLetter = formData.get('coverLetter') as string | null;
    const file = formData.get('resume') as File | null;

    if (!experience?.trim() || !noticePeriod?.trim() || !file) {
      return badRequest('Required fields are missing');
    }

    const nameCheck = validateName(fullName || '');
    if (!nameCheck.isValid) {
      return badRequest(nameCheck.message);
    }
    const emailCheck = validateEmail(email || '');
    if (!emailCheck.isValid) {
      return badRequest(emailCheck.message);
    }
    const phoneResult = validateAndFormatPhone(phone || '', countryCode || '');
    if (!phoneResult.isValid) {
      return badRequest(phoneResult.message);
    }
    const e164Phone = phoneResult.e164;

    const companyCheck = validateCompany(currentCompany || '', true);
    if (!companyCheck.isValid) {
      return badRequest(companyCheck.message);
    }
    const linkedInCheck = validateUrl(
      linkedInProfile || '',
      'Please enter your LinkedIn profile URL.',
      'Please enter a valid LinkedIn profile URL.',
      false
    );
    if (!linkedInCheck.isValid) {
      return badRequest(linkedInCheck.message);
    }
    const portfolioCheck = validateUrl(
      portfolioUrl || '',
      'Please enter your Portfolio or GitHub URL.',
      'Please enter a valid Portfolio or GitHub URL.',
      false
    );
    if (!portfolioCheck.isValid) {
      return badRequest(portfolioCheck.message);
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
      const uploadDir = join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads', 'resumes');
      await mkdir(/* turbopackIgnore: true */ uploadDir, { recursive: true });
      const filename = `${randomUUID()}.${ext}`;
      const filePath = join(/* turbopackIgnore: true */ uploadDir, /* turbopackIgnore: true */ filename);
      await writeFile(/* turbopackIgnore: true */ filePath, buffer);
      resumeUrl = `/uploads/resumes/${filename}`;
    }

    const [app] = await db
      .insert(applications)
      .values({
        careerId,
        fullName: (fullName || '').trim(),
        email: (email || '').trim(),
        phone: e164Phone,
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

    // Fetch configured HR emails (job-specific list, fall back to global default)
    let hrEmail = 'hr@example.com';
    try {
      if (job.hrEmails && Array.isArray(job.hrEmails) && job.hrEmails.length > 0) {
        hrEmail = (job.hrEmails as string[]).join(', ');
      } else {
        const configs = await db.select().from(careersSettings).limit(1);
        const config = configs[0];
        if (config?.hrEmail) {
          hrEmail = config.hrEmail;
        }
      }
    } catch (dbErr) {
      console.error('Failed to fetch HR settings from database:', dbErr);
    }

    // Send application emails asynchronously
    try {
      await sendApplicationEmails({
        candidateEmail: (email || '').trim(),
        candidateName: (fullName || '').trim(),
        jobTitle: job.title,
        hrEmail,
        jdUrl: job.jdUrl,
        applicantDetails: {
          phone: e164Phone,
          experience,
          currentCompany: currentCompany || null,
          noticePeriod,
          linkedInProfile: linkedInProfile || null,
          portfolioUrl: portfolioUrl || null,
          coverLetter: coverLetter || null,
          resumeUrl,
        },
      });
    } catch (emailErr) {
      console.error('Failed to send application confirmation/notification emails:', emailErr);
    }

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error('[Career apply error]:', error);
    return NextResponse.json({ error: FORM_SUBMIT_ERROR }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional(),
  formType: z.string().optional(),
  pageName: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues?.[0]?.message || 'Validation error' }, { status: 400 });
    }

    const { name, email, phone, company, country, message, formType, pageName, pdfUrl } = parsed.data;

    await db.insert(formSubmissions).values({
      name,
      email,
      phone,
      company,
      country,
      message,
      formType: formType || 'contact',
      pageName,
      pdfUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}

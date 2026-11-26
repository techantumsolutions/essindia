import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';
import { z } from 'zod';
import { validateAndFormatPhone } from '@/lib/phone-validation';
import {
  FORM_RATE_LIMIT_ERROR,
  FORM_SUBMIT_ERROR,
  validateCompany,
  validateEmail,
  validateMessage,
  validateName,
  validateRequiredText,
  validateService,
} from '@/lib/form-validation';
import { consumeFormRateLimit, getRequestIp } from '@/lib/form-rate-limit';

const contactSchema = z.object({
  name: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
  formType: z.string().optional(),
  pageName: z.string().optional(),
  pdfUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getRequestIp(req);
    if (!consumeFormRateLimit(`contact:${ip}`)) {
      return NextResponse.json({ error: FORM_RATE_LIMIT_ERROR }, { status: 429 });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: FORM_SUBMIT_ERROR }, { status: 400 });
    }

    const { name, email, phone, countryCode, company, country, service, message, formType, pageName, pdfUrl } = parsed.data;
    const type = formType || 'contact';
    const phoneRequired = true;
    const companyRequired = type === 'landing-1' || type === 'landing-2' || type === 'contact';
    const serviceRequired = type !== 'career-cta';
    const messageRequired = type === 'contact';
    const skipMessageContentRules = ['landing-1', 'landing-2', 'blog-lead', 'cta', 'career-cta'].includes(type);

    const nameCheck = validateName(name);
    if (!nameCheck.isValid) {
      return NextResponse.json({ error: nameCheck.message }, { status: 400 });
    }
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return NextResponse.json({ error: emailCheck.message }, { status: 400 });
    }

    let storedPhone: string | undefined;
    if (phoneRequired || (phone && phone.trim())) {
      const result = validateAndFormatPhone(phone || '', countryCode || '', phoneRequired);
      if (!result.isValid) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      storedPhone = result.e164 || undefined;
    }

    if (companyRequired || (company && company.trim())) {
      const companyCheck = validateCompany(company || '', companyRequired);
      if (!companyCheck.isValid) {
        return NextResponse.json({ error: companyCheck.message }, { status: 400 });
      }
    }

    if (serviceRequired || (service && service.trim())) {
      const serviceCheck = validateService(service || '', serviceRequired);
      if (!serviceCheck.isValid) {
        return NextResponse.json({ error: serviceCheck.message }, { status: 400 });
      }
    }

    if (messageRequired || (!skipMessageContentRules && message && message.trim())) {
      const messageCheck = validateMessage(message || '', messageRequired);
      if (!messageCheck.isValid) {
        return NextResponse.json({ error: messageCheck.message }, { status: 400 });
      }
    }

    if (type === 'landing-1' || type === 'landing-2') {
      let extra: Record<string, string> = {};
      try {
        extra = message ? JSON.parse(message) : {};
      } catch {
        extra = {};
      }
      const industryCheck = validateRequiredText(extra.industry || '', 'Please enter your industry.');
      if (!industryCheck.isValid) {
        return NextResponse.json({ error: industryCheck.message }, { status: 400 });
      }
      if (type === 'landing-1') {
        const employeesCheck = validateRequiredText(extra.employees || '', 'Please enter the number of employees.');
        if (!employeesCheck.isValid) {
          return NextResponse.json({ error: employeesCheck.message }, { status: 400 });
        }
        const currentErpCheck = validateRequiredText(extra.currentErp || '', 'Please enter your current ERP.');
        if (!currentErpCheck.isValid) {
          return NextResponse.json({ error: currentErpCheck.message }, { status: 400 });
        }
        const requirementCheck = validateRequiredText(extra.requirement || '', 'Please enter your business requirement.');
        if (!requirementCheck.isValid) {
          return NextResponse.json({ error: requirementCheck.message }, { status: 400 });
        }
      }
    }

    await db.insert(formSubmissions).values({
      name: name.trim(),
      email: email.trim(),
      phone: storedPhone,
      company,
      country,
      service: service?.trim() || null,
      message,
      formType: type,
      pageName,
      pdfUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json({ error: FORM_SUBMIT_ERROR }, { status: 500 });
  }
}

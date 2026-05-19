import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { templateRepository } from '@/repositories/template.repository';
import { templateSchema } from '@/lib/cms/validators';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET() {
  try {
    const templates = await templateRepository.findAll();
    return NextResponse.json(templates);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();

    if (body.sourcePageId) {
      const template = await templateRepository.createFromPage(
        body.sourcePageId,
        body.name
      );
      return NextResponse.json(template, { status: 201 });
    }

    const parsed = templateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const template = await templateRepository.create({
      ...parsed.data,
      sections: body.sections,
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Page not found') {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { templateRepository } from '@/repositories/template.repository';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, name } = body;

    if (action === 'publish') {
      const page = await pageAdminRepository.update(id, { status: 'published' });
      if (!page) return notFound('Page not found');
      return NextResponse.json(page);
    }

    if (action === 'unpublish') {
      const page = await pageAdminRepository.update(id, { status: 'draft' });
      if (!page) return notFound('Page not found');
      return NextResponse.json(page);
    }

    if (action === 'duplicate') {
      const page = await pageAdminRepository.duplicate(id);
      if (!page) return notFound('Page not found');
      return NextResponse.json(page, { status: 201 });
    }

    if (action === 'convert-template') {
      const template = await templateRepository.createFromPage(id, name);
      return NextResponse.json(template, { status: 201 });
    }

    return badRequest('Invalid action');
  } catch (error) {
    return serverError(error);
  }
}

import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { updatePageSchema, seoSchema } from '@/lib/cms/validators';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await pageAdminRepository.getById(id);
    if (!page) return notFound('Page not found');
    return NextResponse.json(page);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.seo) {
      const seoParsed = seoSchema.safeParse(body.seo);
      if (!seoParsed.success) return badRequest(seoParsed.error.message);
      const page = await pageAdminRepository.updateSeo(id, seoParsed.data);
      if (!page) return notFound('Page not found');
      return NextResponse.json(page);
    }

    const parsed = updatePageSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const page = await pageAdminRepository.update(id, {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
    });
    if (!page) return notFound('Page not found');
    return NextResponse.json(page);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    await pageAdminRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}

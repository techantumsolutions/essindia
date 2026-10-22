import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { pageSectionSchema, reorderSectionsSchema } from '@/lib/cms/validators';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const sections = await pageAdminRepository.listPageSections(id);
    if (sections === null) return notFound('Page not found');
    return NextResponse.json({ pageId: id, sections });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id: pageId } = await params;
    const body = await request.json();

    if (body.reorder) {
      const parsed = reorderSectionsSchema.safeParse(body);
      if (!parsed.success) return badRequest(parsed.error.message);
      const page = await pageAdminRepository.reorderSections(pageId, parsed.data.sectionIds);
      if (!page) return notFound('Page not found');
      return NextResponse.json(page);
    }

    const parsed = pageSectionSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const section = await pageAdminRepository.addSection(pageId, parsed.data);
    if (!section) return notFound('Page not found');
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id: pageId } = await params;
    const body = await request.json();
    const { sections } = body;
    if (!Array.isArray(sections)) return badRequest('sections must be an array');

    const updatedSections = await pageAdminRepository.updateSections(
      pageId,
      sections.filter((s) => s && s.id).map((s) => ({
        id: s.id,
        content: s.content,
        name: s.name,
        variant: s.variant,
        isActive: s.isActive,
      }))
    );

    return NextResponse.json({ success: true, count: updatedSections.length, pageId });
  } catch (error) {
    return serverError(error);
  }
}

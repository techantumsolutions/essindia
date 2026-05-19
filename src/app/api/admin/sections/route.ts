import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { sectionLibraryRepository } from '@/repositories/section-library.repository';
import { sectionLibrarySchema } from '@/lib/cms/validators';
import { badRequest, conflict, serverError, unauthorized } from '@/lib/cms/api-response';
import { SECTION_REGISTRY } from '@/lib/cms/section-registry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const types = searchParams.get('types');

    if (types === 'registry') {
      return NextResponse.json(SECTION_REGISTRY.map(({ icon: _icon, ...rest }) => rest));
    }

    const items = await sectionLibraryRepository.findAll({
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
    });

    return NextResponse.json(items);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const parsed = sectionLibrarySchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const created = await sectionLibraryRepository.create({
      ...parsed.data,
      contentJson: parsed.data.contentJson,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && (error as Error & { code?: string }).code === 'DUPLICATE_SECTION') {
      return conflict(error.message);
    }
    return serverError(error);
  }
}

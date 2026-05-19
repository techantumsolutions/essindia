import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { sectionLibraryRepository } from '@/repositories/section-library.repository';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';
import { z } from 'zod';

const importSchema = z.object({
  pageId: z.string().uuid(),
  sectionIds: z.array(z.string().uuid()).min(1),
});

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const parsed = importSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const result = await sectionLibraryRepository.importFromPage(
      parsed.data.pageId,
      parsed.data.sectionIds
    );

    return NextResponse.json(result);
  } catch (error) {
    return serverError(error);
  }
}

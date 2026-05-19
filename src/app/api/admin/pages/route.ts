import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { pageRegistryRepository } from '@/repositories/page-registry.repository';
import { createPageSchema } from '@/lib/cms/validators';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registry = searchParams.get('registry') === 'true';
    const tree = searchParams.get('tree') === 'true';

    if (registry) {
      const rows = await pageRegistryRepository.getRegistry();
      return NextResponse.json(rows, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    if (tree) {
      return NextResponse.json(await pageAdminRepository.getTree());
    }

    return NextResponse.json(await pageAdminRepository.getTree());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const page = await pageAdminRepository.create(parsed.data);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message;
      if (
        msg.includes('Duplicate') ||
        msg.includes('already exists') ||
        msg.includes('Invalid navigation') ||
        msg.includes('required')
      ) {
        return badRequest(msg);
      }
    }
    return serverError(error);
  }
}

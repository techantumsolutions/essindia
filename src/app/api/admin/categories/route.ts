import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { categoryRepository } from '@/repositories/category.repository';
import { categorySchema } from '@/lib/cms/validators';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get('tree') === 'true';
    const parentId = searchParams.get('parentId');

    if (parentId !== null && searchParams.has('parentId')) {
      const children = await categoryRepository.getChildren(
        parentId === 'null' ? null : parentId
      );
      return NextResponse.json(children);
    }

    if (tree) {
      return NextResponse.json(await categoryRepository.getTree());
    }

    return NextResponse.json(await categoryRepository.getAll());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const created = await categoryRepository.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}

import { NextResponse } from 'next/server';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { serverError } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const revisions = await pageAdminRepository.getRevisions(id);
    return NextResponse.json(revisions);
  } catch (error) {
    return serverError(error);
  }
}

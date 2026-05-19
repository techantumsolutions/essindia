import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageAdminRepository } from '@/repositories/page-admin.repository';
import { serverError, unauthorized } from '@/lib/cms/api-response';

/** CMS pages list for section import and admin tooling. */
export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const pages = await pageAdminRepository.listForImport();
    return NextResponse.json(pages);
  } catch (error) {
    return serverError(error);
  }
}

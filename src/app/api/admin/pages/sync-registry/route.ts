import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { pageRegistryRepository } from '@/repositories/page-registry.repository';
import { serverError, unauthorized } from '@/lib/cms/api-response';

export async function POST() {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const result = await pageRegistryRepository.syncFromFilesystem();
    return NextResponse.json(result);
  } catch (error) {
    return serverError(error);
  }
}

import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { footerRepository } from '@/repositories/footer.repository';
import { badRequest, serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const settings = await footerRepository.getFooterSettings();
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('[API Footer GET]', error);
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const { logoUrl, description, twitterUrl, linkedinUrl, facebookUrl, youtubeUrl, countries, links } = body;

    // Validate body structure briefly
    if (countries && !Array.isArray(countries)) {
      return badRequest('Countries must be an array of strings');
    }
    if (links && typeof links !== 'object') {
      return badRequest('Links must be a valid object grouped by category');
    }

    const updated = await footerRepository.updateFooterSettings({
      logoUrl: logoUrl || '',
      description: description || '',
      twitterUrl: twitterUrl || '',
      linkedinUrl: linkedinUrl || '',
      facebookUrl: facebookUrl || '',
      youtubeUrl: youtubeUrl || '',
      countries: countries || [],
      links: links || { company: [], products: [], industries: [], services: [] },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API Footer PUT]', error);
    return serverError(error);
  }
}

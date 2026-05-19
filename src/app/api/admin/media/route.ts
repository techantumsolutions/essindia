import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { mediaRepository } from '@/repositories/media.repository';
import { StorageService } from '@/lib/storage/r2';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await mediaRepository.findAll({
      folder: searchParams.get('folder') || undefined,
      search: searchParams.get('search') || undefined,
    });
    return NextResponse.json(items);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'bin';
    const key = `${folder}/${randomUUID()}.${ext}`;
    let url: string;

    const hasR2 =
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME;

    if (hasR2) {
      url = await StorageService.uploadFile(key, buffer, file.type);
    } else {
      const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
      await mkdir(uploadDir, { recursive: true });
      const filename = `${randomUUID()}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);
      url = `/uploads/${folder}/${filename}`;
    }

    const item = await mediaRepository.create({
      filename: file.name,
      url,
      mimeType: file.type,
      size: buffer.length,
      altText,
      folder,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { mediaRepository } from '@/repositories/media.repository';
import { StorageService } from '@/lib/storage/r2';
import { unauthorized, serverError } from '@/lib/cms/api-response';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const IMAGE_MIME = /^image\/(jpeg|jpg|png|webp|gif|avif|tiff)$/i;
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;

async function optimizeImageBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
  if (!IMAGE_MIME.test(mimeType) || mimeType.includes('gif')) {
    // Keep GIF/SVG/PDF etc unchanged
    return { buffer, mimeType, ext: mimeType.split('/')[1] || 'bin' };
  }

  try {
    const optimized = await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        height: MAX_WIDTH,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    return { buffer: optimized, mimeType: 'image/webp', ext: 'webp' };
  } catch {
    return { buffer, mimeType, ext: mimeType.split('/')[1] || 'bin' };
  }
}

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
    const folder = (formData.get('folder') as string) || 'media';
    const skipOptimize = formData.get('skipOptimize') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    let buffer: Buffer = originalBuffer;
    let mimeType = file.type || 'application/octet-stream';
    let ext = file.name.split('.').pop() || 'bin';

    if (!skipOptimize && IMAGE_MIME.test(mimeType) && !mimeType.includes('svg')) {
      const optimized = await optimizeImageBuffer(originalBuffer, mimeType);
      buffer = Buffer.from(optimized.buffer);
      mimeType = optimized.mimeType;
      ext = optimized.ext;
    }

    const key = `${folder}/${randomUUID()}.${ext}`;
    let url: string;

    const hasR2 =
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME;

    if (hasR2) {
      url = await StorageService.uploadFile(key, buffer, mimeType);
    } else {
      const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
      await mkdir(uploadDir, { recursive: true });
      const filename = `${randomUUID()}.${ext}`;
      await writeFile(join(uploadDir, filename), buffer);
      url = `/uploads/${folder}/${filename}`;
    }

    const item = await mediaRepository.create({
      filename: file.name.replace(/\.[^.]+$/, `.${ext}`),
      url,
      mimeType,
      size: buffer.length,
      altText,
      folder,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

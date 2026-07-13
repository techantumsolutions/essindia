import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join, resolve } from 'path';

const UPLOADS_ROOT = join(process.cwd(), 'public', 'uploads');

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getMimeType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = resolve(UPLOADS_ROOT, ...path);

  if (!filePath.startsWith(UPLOADS_ROOT)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const buffer = await readFile(filePath);
    const filename = path[path.length - 1];

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': getMimeType(filename),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

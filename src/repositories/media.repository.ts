import { db } from '@/lib/db';
import { mediaLibrary } from '@/lib/db/schema';
import { desc, eq, ilike, and } from 'drizzle-orm';

export class MediaRepository {
  async findAll(filters?: { folder?: string; search?: string }) {
    const conditions = [];
    if (filters?.folder) conditions.push(eq(mediaLibrary.folder, filters.folder));
    if (filters?.search) conditions.push(ilike(mediaLibrary.filename, `%${filters.search}%`));

    return db.query.mediaLibrary.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(mediaLibrary.createdAt)],
    });
  }

  async findById(id: string) {
    return db.query.mediaLibrary.findFirst({
      where: eq(mediaLibrary.id, id),
    });
  }

  async create(data: {
    filename: string;
    url: string;
    mimeType: string;
    size?: number;
    dimensions?: { width: number; height: number };
    altText?: string;
    folder?: string;
    uploadedBy?: string;
  }) {
    const [item] = await db.insert(mediaLibrary).values(data).returning();
    return item;
  }

  async update(
    id: string,
    data: Partial<{ altText: string; folder: string; filename: string }>
  ) {
    const [item] = await db.update(mediaLibrary).set(data).where(eq(mediaLibrary.id, id)).returning();
    return item;
  }

  async delete(id: string) {
    await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
  }
}

export const mediaRepository = new MediaRepository();

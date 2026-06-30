import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, pageSections } from '../src/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('Synchronizing section usage counts...');

  // Reset all usage counts to 0 first
  await db.update(sections).set({ usageCount: 0 });

  // Count usage in pageSections
  const usages = await db
    .select({
      sectionLibraryId: pageSections.sectionLibraryId,
      count: sql<number>`count(*)`.mapWith(Number)
    })
    .from(pageSections)
    .where(sql`${pageSections.sectionLibraryId} IS NOT NULL`)
    .groupBy(pageSections.sectionLibraryId);

  console.log(`Found usages for ${usages.length} library sections.`);

  for (const usage of usages) {
    if (usage.sectionLibraryId) {
      await db
        .update(sections)
        .set({ usageCount: usage.count })
        .where(eq(sections.id, usage.sectionLibraryId));
    }
  }

  console.log('Synchronization complete!');
  process.exit(0);
}

main().catch(console.error);

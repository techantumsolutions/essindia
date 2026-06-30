import { db } from '../src/lib/db';
import { megaMenuCategories, megaMenuSubCategories, megaMenuSubSubCategories, pages } from '../src/lib/db/schema';
import { desc } from 'drizzle-orm';

async function main() {
  console.log('--- Recent Categories ---');
  const cats = await db.select().from(megaMenuCategories).orderBy(desc(megaMenuCategories.createdAt)).limit(5);
  cats.forEach(c => console.log(`${c.name} | ${c.createdAt}`));

  console.log('\n--- Recent Sub Categories ---');
  const subs = await db.select().from(megaMenuSubCategories).orderBy(desc(megaMenuSubCategories.createdAt)).limit(5);
  subs.forEach(s => console.log(`${s.name} | ${s.createdAt}`));

  console.log('\n--- Recent Child Categories ---');
  const childs = await db.select().from(megaMenuSubSubCategories).orderBy(desc(megaMenuSubSubCategories.createdAt)).limit(5);
  childs.forEach(c => console.log(`${c.name} | ${c.createdAt}`));

  console.log('\n--- Recent Pages ---');
  const pgs = await db.select().from(pages).orderBy(desc(pages.createdAt)).limit(5);
  pgs.forEach(p => console.log(`${p.title} | ${p.createdAt}`));

  process.exit(0);
}
main();

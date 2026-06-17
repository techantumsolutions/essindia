import 'dotenv/config';
import { db } from '../src/lib/db';

async function check() {
  const sections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'why-ess')
  });

  for (const s of sections) {
    console.log(JSON.stringify(s.contentJson, null, 2));
  }
  process.exit(0);
}

check().catch(console.error);

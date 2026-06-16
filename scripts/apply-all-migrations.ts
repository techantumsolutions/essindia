/**
 * Applies all idempotent CMS SQL migrations in order.
 * Run: npm run db:apply-all
 */
import { execSync } from 'child_process';

const steps = [
  'db:apply-cms',
  'db:apply-mega-menu',
  'db:apply-registry',
  'db:apply-page-nav',
  'db:apply-page-hierarchy',
  'db:apply-pages-template-id',
  'db:backfill-page-hierarchy',
] as const;

for (const script of steps) {
  console.log(`\n>>> npm run ${script}`);
  execSync(`npm run ${script}`, { stdio: 'inherit', cwd: process.cwd() });
}

console.log('\nAll migrations applied.');

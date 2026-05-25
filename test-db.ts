import 'dotenv/config';
import { db } from './src/lib/db';
import { templateRepository } from './src/repositories/template.repository';

async function main() {
  const all = await templateRepository.findAll();
  console.log('Total templates:', all.length);
  if (all.length > 0) {
    const id = all[0].id;
    console.log('Testing findById for:', id);
    const result = await templateRepository.findById(id);
    console.log('Result:', result ? 'Found' : 'Not Found');
  }
}

main().catch(console.error).finally(() => process.exit(0));

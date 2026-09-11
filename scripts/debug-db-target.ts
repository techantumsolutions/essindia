import { client } from '../src/lib/db';

async function verifyTables() {
  try {
    console.log('--- DB INFO ---');
    const currentDb = await client`SELECT current_database(), current_user, current_schema();`;
    console.log('Connection target:', currentDb);

    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('Public tables in target DB:', tables.map(t => t.table_name));
  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    process.exit(0);
  }
}

verifyTables();

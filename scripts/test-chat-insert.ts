import { client } from '../src/lib/db';

async function testInsert() {
  try {
    const res = await client`
      INSERT INTO "chat_conversations" ("id", "user_name", "channel", "status", "last_message", "last_message_at")
      VALUES (${crypto.randomUUID()}, 'Guest User', 'Website Widget', 'waiting', 'Chat started', NOW())
      RETURNING *;
    `;
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

testInsert();

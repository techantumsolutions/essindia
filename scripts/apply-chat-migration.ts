import { client } from '../src/lib/db';

async function applyChatMigration() {
  console.log('🚀 Running Live Chat tables migration...');
  try {
    await client`
      CREATE TABLE IF NOT EXISTS "chat_conversations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_name" varchar(255) NOT NULL DEFAULT 'Guest User',
        "user_email" varchar(255),
        "user_phone" varchar(50),
        "channel" varchar(50) NOT NULL DEFAULT 'Website Widget',
        "status" varchar(50) NOT NULL DEFAULT 'waiting',
        "assigned_agent_id" uuid,
        "assigned_agent_name" varchar(255),
        "last_message" text,
        "last_message_at" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "conversation_id" uuid NOT NULL,
        "sender_type" varchar(50) NOT NULL,
        "sender_name" varchar(255),
        "message" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    console.log('✅ Chat tables successfully created!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

applyChatMigration();

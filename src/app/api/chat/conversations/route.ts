import { NextResponse } from 'next/server';
import { db, client } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminSessionServer } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getAdminSessionServer();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure table exists on target DB
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

    const conversations = await client`
      SELECT id, user_name as "userName", user_email as "userEmail", user_phone as "userPhone", channel, status, assigned_agent_id as "assignedAgentId", assigned_agent_name as "assignedAgentName", last_message as "lastMessage", last_message_at as "lastMessageAt", created_at as "createdAt"
      FROM "chat_conversations"
      ORDER BY "last_message_at" DESC;
    `;
    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Error fetching chat conversations:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userName, channel } = await request.json();
    const finalUserName = (userName && userName.trim()) ? userName.trim() : 'Guest User';

    const convId = crypto.randomUUID();
    const msgId = crypto.randomUUID();

    const [newConv] = await client`
      INSERT INTO "chat_conversations" ("id", "user_name", "channel", "status", "last_message", "last_message_at")
      VALUES (${convId}, ${finalUserName}, ${channel || 'Website Widget'}, 'waiting', 'Chat started', NOW())
      RETURNING *;
    `;

    // Initial greeting message from System/Bot
    const initialGreeting = 'Hello! Welcome to ESS India. May I please know your name?';
    await client`
      INSERT INTO "chat_messages" ("id", "conversation_id", "sender_type", "sender_name", "message")
      VALUES (${msgId}, ${convId}, 'bot', 'ESS Assistant', ${initialGreeting});
    `;

    return NextResponse.json({
      success: true,
      conversation: {
        id: newConv.id,
        userName: newConv.user_name,
        channel: newConv.channel,
        status: newConv.status,
        lastMessage: newConv.last_message,
        lastMessageAt: newConv.last_message_at,
        createdAt: newConv.created_at
      }
    });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: error.message || 'Failed to start chat' }, { status: 500 });
  }
}

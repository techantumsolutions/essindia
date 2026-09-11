import { NextResponse } from 'next/server';
import { db, client } from '@/lib/db';
import { chatConversations, chatMessages, users } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { getAdminSessionServer } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId parameter is required' }, { status: 400 });
    }

    // Ensure table exists on target DB
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

    const messages = await client`
      SELECT id, conversation_id as "conversationId", sender_type as "senderType", sender_name as "senderName", message, created_at as "createdAt"
      FROM "chat_messages"
      WHERE "conversation_id" = ${conversationId}::uuid
      ORDER BY "created_at" ASC;
    `;

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, senderType, senderName, message } = body;

    if (!conversationId || !message || !message.trim()) {
      return NextResponse.json({ error: 'conversationId and message are required' }, { status: 400 });
    }

    const cleanMessage = message.trim();

    // Check conversation exists
    const [conv] = await client`
      SELECT * FROM "chat_conversations" WHERE "id" = ${conversationId}::uuid;
    `;
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Determine sender details
    const session = await getAdminSessionServer();
    let finalSenderType = senderType || (session ? 'agent' : 'visitor');
    let finalSenderName = senderName || (session ? session.fullName : conv.user_name);

    // If visitor is replying and conv.user_name is still 'Guest User' (or default), update user_name on conversation
    if (finalSenderType === 'visitor') {
      let extractedName = (senderName && senderName !== 'Guest User') ? senderName.trim() : null;
      
      // If no explicit senderName but message looks like a name (e.g. initial name response "Dell" or "Hi, I am Dell")
      if (!extractedName && (conv.user_name === 'Guest User' || !conv.user_name)) {
        const text = cleanMessage.trim();
        // Exclude generic greetings
        if (text && text.length <= 40 && !['hi', 'hello', 'hey', 'test', 'help', 'good morning', 'good evening'].includes(text.toLowerCase())) {
          extractedName = text.replace(/^(my name is|i am|this is)\s+/i, '').trim();
        }
      }

      if (extractedName && extractedName !== 'Guest User') {
        finalSenderName = extractedName;
        await client`
          UPDATE "chat_conversations"
          SET "user_name" = ${extractedName}
          WHERE "id" = ${conversationId}::uuid;
        `;
      }
    }

    // Save message
    const msgId = crypto.randomUUID();
    const [newMessage] = await client`
      INSERT INTO "chat_messages" ("id", "conversation_id", "sender_type", "sender_name", "message", "created_at")
      VALUES (${msgId}, ${conversationId}::uuid, ${finalSenderType}, ${finalSenderName}, ${cleanMessage}, NOW() AT TIME ZONE 'UTC')
      RETURNING id, conversation_id as "conversationId", sender_type as "senderType", sender_name as "senderName", message, created_at as "createdAt";
    `;

    // Update conversation state
    await client`
      UPDATE "chat_conversations"
      SET "last_message" = ${cleanMessage},
          "last_message_at" = NOW() AT TIME ZONE 'UTC',
          "updated_at" = NOW() AT TIME ZONE 'UTC'
      WHERE "id" = ${conversationId}::uuid;
    `;

    // Send email notification to active agents if user/visitor initiated message
    if (finalSenderType === 'visitor') {
      try {
        // Fetch active chat agents & super admins
        const activeAgents = await db.select().from(users).where(eq(users.status, 'active'));
        const recipientEmails = activeAgents
          .filter(u => ((u.accessPermissions as any)?.charts) ?? true)
          .map(u => u.email);

        console.log(`[Chat Notification] Alert dispatched to agents (${recipientEmails.join(', ')}): Visitor "${conv.user_name}" sent: "${cleanMessage}"`);
      } catch (notifyErr) {
        console.error('Failed to notify agents:', notifyErr);
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Error posting message:', error);
    return NextResponse.json({ error: error.message || 'Failed to post message' }, { status: 500 });
  }
}

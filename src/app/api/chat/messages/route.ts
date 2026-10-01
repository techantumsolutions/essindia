import { NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { ensureChatTables } from '@/lib/db/ensure-chat-tables';
import { getAdminSessionServer } from '@/lib/auth/session';
import { sendEmail } from '@/lib/email';
import { absoluteUrl } from '@/lib/seo/site-url';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId parameter is required' }, { status: 400 });
    }

    // Ensure table exists on target DB (run once per runtime instance)
    await ensureChatTables();

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

    let isFirstVisitorMessage = false;
    if (finalSenderType === 'visitor') {
      const existing = await client`
        SELECT COUNT(*)::int AS count
        FROM "chat_messages"
        WHERE "conversation_id" = ${conversationId}::uuid
          AND "sender_type" = 'visitor';
      `;
      isFirstVisitorMessage = Number(existing[0]?.count ?? 0) === 0;
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

    if (isFirstVisitorMessage) {
      try {
        await notifyFirstChatMessage({
          visitorName: finalSenderName || conv.user_name || 'Guest User',
          message: cleanMessage,
        });
      } catch (notifyErr) {
        console.error('Failed to send first-chat notification:', notifyErr);
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Error posting message:', error);
    return NextResponse.json({ error: error.message || 'Failed to post message' }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function notifyFirstChatMessage({ visitorName, message }: { visitorName: string; message: string }) {
  await client`
    CREATE TABLE IF NOT EXISTS "chat_notification_settings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "emails" jsonb NOT NULL DEFAULT '[]',
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `;

  const rows = await client`
    SELECT emails FROM "chat_notification_settings" ORDER BY "created_at" ASC LIMIT 1;
  `;
  const emails = Array.isArray(rows[0]?.emails)
    ? rows[0].emails.filter((email: unknown) => typeof email === 'string' && email.includes('@'))
    : [];
  if (emails.length === 0) return;

  const safeName = escapeHtml(visitorName);
  const safeMessage = escapeHtml(message);
  const chartsUrl = absoluteUrl('/admin/charts');

  const result = await sendEmail({
    to: emails,
    subject: 'New chat message on ESS India',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4B2A63; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 22px;">New chat message</h2>
        </div>
        <div style="padding: 24px;">
          <p>A visitor sent the first message in a new chat. Log in and reply.</p>
          <p><strong>Visitor:</strong> ${safeName}</p>
          <p style="margin-bottom: 0;"><strong>Message:</strong></p>
          <div style="background-color: #f7fafc; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${safeMessage}</div>
          <p style="text-align: center; margin-top: 28px;">
            <a href="${chartsUrl}" style="background-color: #4B2A63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Charts and reply</a>
          </p>
        </div>
      </div>
    `,
  });

  if (result.error) {
    console.error('Resend error sending chat notification:', result.error);
  }
}

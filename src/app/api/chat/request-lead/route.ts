import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const [conv] = await db.select().from(chatConversations).where(eq(chatConversations.id, conversationId));
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Insert lead request prompt message from agent/system without the "busy" bot message
    const promptText = "Please provide your email address and mobile number so our team can follow up with you.";
    const [msg] = await db.insert(chatMessages).values({
      id: crypto.randomUUID(),
      conversationId,
      senderType: 'bot',
      senderName: 'ESS Agent',
      message: promptText,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, triggered: true, message: msg });
  } catch (error: any) {
    console.error('Error requesting lead fields:', error);
    return NextResponse.json({ error: error.message || 'Failed to request lead fields' }, { status: 500 });
  }
}

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

    // Only reply with fallback if still in 'waiting' status
    if (conv.status !== 'waiting') {
      return NextResponse.json({ triggered: false, reason: 'Agent already joined or conversation resolved' });
    }

    // Check if bot fallback message was already sent
    const existingMessages = await db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId));
    const fallbackAlreadySent = existingMessages.some(
      m => m.senderType === 'bot' && m.message.toLowerCase().includes('our team is busy right now')
    );

    if (fallbackAlreadySent) {
      return NextResponse.json({ triggered: false, reason: 'Fallback message already delivered' });
    }

    // Insert 20s AI Bot response
    const fallbackText = "Our team is busy right now. Please provide your email and mobile number, our team will get back to you soon.";
    const [botMsg] = await db.insert(chatMessages).values({
      id: crypto.randomUUID(),
      conversationId,
      senderType: 'bot',
      senderName: 'ESS Assistant',
      message: fallbackText,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, triggered: true, message: botMsg });
  } catch (error: any) {
    console.error('Error triggering bot fallback:', error);
    return NextResponse.json({ error: error.message || 'Failed to trigger fallback' }, { status: 500 });
  }
}

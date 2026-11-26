import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateAndFormatPhone } from '@/lib/phone-validation';
import { FORM_SUBMIT_ERROR, validateEmail, validateName } from '@/lib/form-validation';

export async function POST(request: Request) {
  try {
    const { conversationId, email, phone, name, countryCode } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const [conv] = await db.select().from(chatConversations).where(eq(chatConversations.id, conversationId));
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    const nameCheck = validateName(name || '', true);
    if (!nameCheck.isValid) {
      return NextResponse.json({ error: nameCheck.message }, { status: 400 });
    }
    updateData.userName = String(name).trim();

    const emailCheck = validateEmail(email || '', true);
    if (!emailCheck.isValid) {
      return NextResponse.json({ error: emailCheck.message }, { status: 400 });
    }
    updateData.userEmail = String(email).trim();

    const result = validateAndFormatPhone(phone || '', countryCode || '', true);
    if (!result.isValid) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    updateData.userPhone = result.e164;

    await db.update(chatConversations)
      .set(updateData)
      .where(eq(chatConversations.id, conversationId));

    // Acknowledge receipt message from AI bot
    const ackMsg = `Thank you! We've received your contact details (${email || phone || ''}). Our agent will get in touch with you shortly.`;
    const [botMsg] = await db.insert(chatMessages).values({
      id: crypto.randomUUID(),
      conversationId,
      senderType: 'bot',
      senderName: 'ESS Assistant',
      message: ackMsg,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ success: true, message: botMsg });
  } catch (error: any) {
    console.error('Error recording contact lead:', error);
    return NextResponse.json({ error: FORM_SUBMIT_ERROR }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db, client } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const submissions = await db.select().from(formSubmissions).orderBy(desc(formSubmissions.createdAt));

    // Fetch chat leads from chat_conversations table
    try {
      const chatLeads = await client`
        SELECT id, user_name as "name", user_email as "email", user_phone as "phone", last_message as "message", channel, created_at as "createdAt"
        FROM "chat_conversations"
        WHERE user_email IS NOT NULL OR user_phone IS NOT NULL
        ORDER BY created_at DESC;
      `;

      const formattedChatLeads = chatLeads.map(c => ({
        id: c.id,
        name: c.name || 'Guest User',
        email: c.email || '',
        phone: c.phone || null,
        company: null,
        country: null,
        message: c.message || 'Chat Inquiry',
        status: 'new',
        formType: 'chat-lead',
        pageName: 'Website Chat Widget',
        pdfUrl: null,
        createdAt: c.createdAt
      }));

      return NextResponse.json([...formattedChatLeads, ...submissions]);
    } catch (chatErr) {
      return NextResponse.json(submissions);
    }
  } catch (error) {
    console.error('[Admin Forms API Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

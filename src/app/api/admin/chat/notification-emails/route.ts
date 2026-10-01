import { NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { getAdminSessionServer } from '@/lib/auth/session';
import { unauthorized } from '@/lib/cms/api-response';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureTable() {
  await client`
    CREATE TABLE IF NOT EXISTS "chat_notification_settings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "emails" jsonb NOT NULL DEFAULT '[]',
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `;
}

function canManage(role: string) {
  return role === 'super_admin' || role === 'admin';
}

function normalizeEmails(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') return null;
    const email = item.trim().toLowerCase();
    if (!email) continue;
    if (!EMAIL_PATTERN.test(email)) return null;
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }
  return emails;
}

export async function GET() {
  const session = await getAdminSessionServer();
  if (!session || !canManage(session.role)) return unauthorized();

  try {
    await ensureTable();
    const rows = await client`
      SELECT emails FROM "chat_notification_settings" ORDER BY "created_at" ASC LIMIT 1;
    `;
    const emails = Array.isArray(rows[0]?.emails) ? rows[0].emails : [];
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching chat notification emails:', error);
    return NextResponse.json({ error: 'Failed to load notification emails' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSessionServer();
  if (!session || !canManage(session.role)) return unauthorized();

  try {
    const body = await request.json();
    const emails = normalizeEmails(body?.emails);
    if (!emails) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    await ensureTable();
    const rows = await client`
      SELECT id FROM "chat_notification_settings" ORDER BY "created_at" ASC LIMIT 1;
    `;
    const payload = JSON.stringify(emails);

    if (rows[0]?.id) {
      await client`
        UPDATE "chat_notification_settings"
        SET "emails" = ${payload}::jsonb, "updated_at" = NOW()
        WHERE "id" = ${rows[0].id};
      `;
    } else {
      await client`
        INSERT INTO "chat_notification_settings" ("emails")
        VALUES (${payload}::jsonb);
      `;
    }

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error saving chat notification emails:', error);
    return NextResponse.json({ error: 'Failed to save notification emails' }, { status: 500 });
  }
}

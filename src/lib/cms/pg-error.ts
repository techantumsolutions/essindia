/** Walk Drizzle/postgres-js error chain for a PostgreSQL SQLSTATE code. */
export function getPostgresErrorCode(error: unknown): string | undefined {
  let current: unknown = error;
  const seen = new Set<unknown>();

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    const record = current as { code?: string; cause?: unknown };
    if (record.code && /^[0-9A-Z]{5}$/.test(record.code)) {
      return record.code;
    }
    current = record.cause;
  }

  return undefined;
}

export function isMissingSchemaError(error: unknown): boolean {
  const code = getPostgresErrorCode(error);
  if (code === '42P01' || code === '42703') return true;

  const parts: string[] = [];
  let current: unknown = error;
  const seen = new Set<unknown>();
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    if (current instanceof Error) parts.push(current.message);
    current = (current as { cause?: unknown }).cause;
  }
  const message = parts.join(' ');
  return /column .* does not exist/i.test(message) || /relation .* does not exist/i.test(message);
}

import { permanentRedirect, redirect } from 'next/navigation';
import { redirectRepository } from '@/repositories/redirect.repository';

/** Apply CMS redirect for a path if configured. Call before notFound(). */
export async function applyCmsRedirect(path: string): Promise<void> {
  try {
    const rule = await redirectRepository.findByFromPath(path);
    if (!rule?.toPath) return;
    if (rule.statusCode === 302) {
      redirect(rule.toPath);
    } else {
      permanentRedirect(rule.toPath);
    }
  } catch {
    // ignore missing table / lookup errors
  }
}

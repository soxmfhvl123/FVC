import { NextResponse } from 'next/server';
import { fieldErrors, spreadSchema } from '@/lib/forms';
import { clientKey, rateLimited } from '@/lib/rateLimit';

/**
 * Spread Report signup. Provider is undecided (docs/06 Q5), so this forwards the address to
 * NEWSLETTER_WEBHOOK_URL (any provider / automation webhook). Without it: logs in development,
 * and in production says the list is not open yet instead of silently dropping addresses.
 */
export async function POST(req: Request) {
  if (rateLimited(`spread:${clientKey(req)}`, 8)) {
    return NextResponse.json({ ok: false, error: 'Too many tries. Give it a few minutes.' }, { status: 429 });
  }
  const parsed = spreadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Check your email address.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const hook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!hook) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[spread] (dev, not stored)', parsed.data.email);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ ok: false, error: 'The Spread Report is not open yet. Check back soon.' }, { status: 503 });
  }
  const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: parsed.data.email, source: 'fvc.ai.kr' }) }).catch(() => null);
  if (!res?.ok) return NextResponse.json({ ok: false, error: 'Could not sign you up right now. Try again later.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}

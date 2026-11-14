import { NextResponse } from 'next/server';
import { fieldErrors, submissionSchema } from '@/lib/forms';
import { clientKey, rateLimited } from '@/lib/rateLimit';

/**
 * Sample Submission → email (docs/06 Q4 default: Route Handler + transactional email).
 * Delivery uses Resend's HTTP API when RESEND_API_KEY and SUBMISSIONS_TO are set.
 * Without them it logs in development and refuses politely in production — it never pretends to send.
 */
export async function POST(req: Request) {
  if (rateLimited(`submit:${clientKey(req)}`)) {
    return NextResponse.json({ ok: false, error: 'Too many samples at once. Try again in a few minutes.' }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const s = parsed.data;
  // Honeypot filled → pretend success, drop it.
  if (s.company) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.SUBMISSIONS_TO;
  if (!key || !to) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[submit] (dev, not sent)', { name: s.name, email: s.email, link: s.link });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ ok: false, error: 'Sample Submission opens soon. Please check back.' }, { status: 503 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.SUBMISSIONS_FROM ?? 'FVC Sample Submission <samples@fvc.ai.kr>',
      to: [to],
      reply_to: s.email,
      subject: `Sample: ${s.name}`,
      text: `Name: ${s.name}\nEmail: ${s.email}\nLink: ${s.link}\n\n${s.message}`,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    return NextResponse.json({ ok: false, error: 'Could not send right now. Please try again later.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

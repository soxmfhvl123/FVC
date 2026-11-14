'use client';

import { type FormEvent, type ReactNode, useRef, useState } from 'react';
import { type FieldErrors, fieldErrors, SPREAD_ENDPOINT, spreadSchema, SUBMIT_ENDPOINT, submissionSchema } from '@/lib/forms';

type Status = { kind: 'idle' | 'sending' | 'done' | 'error'; message?: string; fields?: FieldErrors };

/** POST JSON to a hosted form endpoint (Formspree-style: 2xx = accepted). */
async function post(url: string, data: Record<string, unknown>): Promise<Status> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) return { kind: 'done' };
    if (res.status === 429) return { kind: 'error', message: 'Too many tries. Give it a few minutes.' };
    return { kind: 'error', message: 'Could not send right now. Please try again later.' };
  } catch {
    return { kind: 'error', message: 'No connection. Try again.' };
  }
}

/** Shown instead of a form while no endpoint is configured. */
function OpensSoon({ what }: { what: string }) {
  return (
    <p role="status" className="fvc-prose" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
      {what} opens soon. <span className="fvc-serif">Check back.</span>
    </p>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="fvc-field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <span id={`${id}-hint`} style={{ fontSize: 13 }}>
          {hint}
        </span>
      )}
      {children}
      {error && (
        <span id={`${id}-err`} className="fvc-error">
          {error}
        </span>
      )}
    </div>
  );
}

const describe = (id: string, err?: string, hint?: boolean) => [hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(' ') || undefined;

/** /submit — Sample Submission. Errors are announced (role=alert) and tied to fields. */
export function SubmissionForm() {
  const [st, setSt] = useState<Status>({ kind: 'idle' });
  const form = useRef<HTMLFormElement>(null);
  const f = st.fields ?? {};
  if (!SUBMIT_ENDPOINT) return <OpensSoon what="Sample Submission" />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = submissionSchema.safeParse({
      name: fd.get('name'),
      email: fd.get('email'),
      link: fd.get('link'),
      message: fd.get('message'),
      consent: fd.get('consent') === 'on',
      company: fd.get('company'),
    });
    let next: Status;
    if (!parsed.success) next = { kind: 'error', message: 'Check the highlighted fields.', fields: fieldErrors(parsed.error) };
    else if (parsed.data.company) next = { kind: 'done' }; // honeypot: drop quietly
    else {
      setSt({ kind: 'sending' });
      const { name, email, link, message } = parsed.data;
      next = await post(SUBMIT_ENDPOINT, { name, email, link, message, consent: true, _subject: `Sample: ${name}` });
    }
    setSt(next);
    if (next.kind === 'error' && next.fields) {
      const first = Object.keys(next.fields)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  if (st.kind === 'done')
    return (
      <div role="status" className="fvc-form" tabIndex={-1}>
        <p style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
          Sample received. <span className="fvc-serif">We’ll give it a listen.</span>
        </p>
        <p className="fvc-prose">If it catches, we’ll reply to the email you gave us.</p>
      </div>
    );

  return (
    <form ref={form} className="fvc-form" onSubmit={onSubmit} noValidate>
      <div role="alert" aria-live="assertive">
        {st.kind === 'error' && <p className="fvc-error" style={{ fontSize: 14, margin: 0 }}>{st.message}</p>}
      </div>
      <Field id="s-name" label="Name / artist name" error={f.name}>
        <input id="s-name" name="name" autoComplete="name" required aria-invalid={!!f.name} aria-describedby={describe('s-name', f.name)} />
      </Field>
      <Field id="s-email" label="Email" error={f.email}>
        <input id="s-email" name="email" type="email" autoComplete="email" required aria-invalid={!!f.email} aria-describedby={describe('s-email', f.email)} />
      </Field>
      <Field id="s-link" label="Link to your sample" hint="SoundCloud, Google Drive, Dropbox — any link we can play." error={f.link}>
        <input id="s-link" name="link" type="url" inputMode="url" placeholder="https://" required aria-invalid={!!f.link} aria-describedby={describe('s-link', f.link, true)} />
      </Field>
      <Field id="s-msg" label="Message (optional)" error={f.message}>
        <textarea id="s-msg" name="message" maxLength={2000} aria-invalid={!!f.message} aria-describedby={describe('s-msg', f.message)} />
      </Field>
      <div className="fvc-hp" aria-hidden="true">
        <label htmlFor="s-company">Company</label>
        <input id="s-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="fvc-field">
        <label className="fvc-check" style={{ fontFamily: 'var(--fvc-font-info)', fontSize: 15, textTransform: 'none', letterSpacing: 0 }}>
          <input type="checkbox" name="consent" required aria-invalid={!!f.consent} aria-describedby={describe('s-consent', f.consent)} />
          <span>I own this sample and I’m happy for FVC to listen to it and email me back.</span>
        </label>
        {f.consent && (
          <span id="s-consent-err" className="fvc-error">
            {f.consent}
          </span>
        )}
      </div>
      <button type="submit" className="fvc-submit" disabled={st.kind === 'sending'}>
        {st.kind === 'sending' ? 'Sending…' : 'Send sample ↗'}
      </button>
    </form>
  );
}

/** /spread-report — newsletter signup. */
export function SpreadForm() {
  const [st, setSt] = useState<Status>({ kind: 'idle' });
  const err = st.fields?.email;
  if (!SPREAD_ENDPOINT) return <OpensSoon what="The Spread Report" />;
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = spreadSchema.safeParse({ email: fd.get('email'), company: fd.get('company') });
    if (!parsed.success) return setSt({ kind: 'error', message: 'Check your email address.', fields: fieldErrors(parsed.error) });
    if (parsed.data.company) return setSt({ kind: 'done' });
    setSt({ kind: 'sending' });
    setSt(await post(SPREAD_ENDPOINT, { email: parsed.data.email, source: 'fvc.ai.kr' }));
  }
  if (st.kind === 'done')
    return (
      <p role="status" style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 0.95, margin: 0 }}>
        You’re a carrier now.
      </p>
    );
  return (
    <form className="fvc-form" onSubmit={onSubmit} noValidate>
      <div role="alert" aria-live="assertive">
        {st.kind === 'error' && !err && <p className="fvc-error" style={{ fontSize: 14, margin: 0 }}>{st.message}</p>}
      </div>
      <Field id="sr-email" label="Email" error={err}>
        <input id="sr-email" name="email" type="email" autoComplete="email" required aria-invalid={!!err} aria-describedby={describe('sr-email', err)} />
      </Field>
      <div className="fvc-hp" aria-hidden="true">
        <label htmlFor="sr-company">Company</label>
        <input id="sr-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="fvc-submit" disabled={st.kind === 'sending'}>
        {st.kind === 'sending' ? 'Spreading…' : 'Catch the Spread Report'}
      </button>
    </form>
  );
}

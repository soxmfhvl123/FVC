import { z } from 'zod';

/** Shared by the forms (client hints) and the Route Handlers (the real check). */
export const submissionSchema = z.object({
  name: z.string().trim().min(1, 'Tell us who you are.').max(120, 'Keep the name under 120 characters.'),
  email: z.string().trim().email('That email does not look right.').max(200),
  link: z
    .string()
    .trim()
    .url('Paste a full link, starting with https://')
    .refine((u) => /^https?:\/\//i.test(u), 'Paste a full link, starting with https://')
    .max(500),
  message: z.string().trim().max(2000, 'Keep it under 2000 characters.').optional().default(''),
  consent: z.literal(true, { error: 'Tick the box so we can listen and reply.' }),
  /** Honeypot: humans never see or fill it. */
  company: z.string().max(0).optional().default(''),
});
export type Submission = z.infer<typeof submissionSchema>;

export const spreadSchema = z.object({
  email: z.string().trim().email('That email does not look right.').max(200),
  company: z.string().max(0).optional().default(''),
});

export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? 'form');
    out[k] ??= issue.message;
  }
  return out;
}

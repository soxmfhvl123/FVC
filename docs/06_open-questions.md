# 06 — Open Questions (decide before / during build)

| # | Question | Why it matters | Default if no answer |
|---|---|---|---|
| Q1 | Real release info for at least one strain (artist, title, date, tracks, durations) | Every page currently shows `[PLACEHOLDER]` | Launch with placeholders hidden behind `status: "draft"` except FVC-007 |
| Q2 | Is FVC a music label only, or also a creative studio / archive? | Changes About copy and the "Archive" strain type | Music label first; Archive = process notes |
| Q3 | Goods: external store (which?) or on-site checkout? | Scope of `/goods` | External store links |
| Q4 | Sample Submission delivery: email (which provider) or hosted form? | `/submit` backend | Route Handler + transactional email |
| Q5 | Newsletter provider for Spread Report | `/spread-report` | Placeholder form, no send |
| Q6 | Instagram handle + other links | Footer, About | Hide until provided |
| Q7 | Final default spot ink: Coral `#FF5B47` (current) or Cobalt / Acid / Magenta | Every two-colour bitmap | Coral |
| Q8 | Should the hero germ always be seed 7, or the latest strain's seed? | Hero identity vs freshness | Latest strain's seed |
| Q9 | Analytics tool | Privacy notice | Vercel Analytics |
| Q10 | Any legal review needed on the "virus" wording for ads/stores? | Tone risk | Follow the do/don't list in 00_기획서 §3-2 |

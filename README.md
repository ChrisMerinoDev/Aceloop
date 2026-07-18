# AceLoop — 8-bit Interview Quest 🕹

A retro-RPG interview-prep game. Pick a quest, solve it in a real code editor
under a countdown, get scored like a real interview, earn XP, keep your streak
alive, and climb from Bronze to Master — while a chiptune overworld theme plays.

## What's inside

- **Interview simulation** — Monaco editor, configurable timer (15/30/45 min or
  the question's suggested limit), visual warnings at 50%/90%, auto-submit at
  zero. "Run" executes visible sample tests; "Submit" runs the full hidden set.
- **Safe code execution** — user code runs in a Blob-based **Web Worker**
  sandbox with a hard timeout (infinite loops get terminated), deep-equal
  diffing, and per-case pass/fail reporting.
- **Frontend component quests** — live React preview + Jest-style tests via
  **Sandpack** (controlled input, accordion, star rating, todo list, async
  fetch states, debounced search).
- **Scoring** — `test pass % (70) + speed bonus (20) + first-try bonus (10)`,
  letter grades, coaching feedback, model-solution reveal.
- **Level map** — 6 regions (Novice Meadows → Big-O Castle). Clear 60% of a
  region + hit an XP threshold to unlock the next.
- **Gamification** — XP, ranks (Bronze→Master), daily streak with a streak
  freeze, combo multiplier, 16 achievements, confetti + victory jingle,
  spaced-repetition review queue, global + weekly leaderboard.
- **Learn mode** — every question ships a lesson: intuition → brute force →
  optimization → Big-O → pitfalls → the named transferable pattern.
- **Glossary** — 22 advanced terms (event loop, hydration, tree shaking, …)
  cross-linked inline in every prompt/lesson (hover to reveal).
- **8-bit hero** — customize hair, skin, shirt, pants, shoes, and weapon
  (laptop! coffee!). Toggle **Game Mode** in the nav to walk them around with
  WASD/arrows; hide them any time. Chiptune theme is generated with the Web
  Audio API — mute/unmute in the nav.

## Quick start (guest mode, zero config)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Everything works without Supabase — progress is
saved to localStorage ("guest mode"). Accounts, cloud sync, and the global
leaderboard light up once Supabase is configured.

## Supabase setup (accounts + cloud saves + leaderboard)

1. Create a project at https://supabase.com/dashboard.
2. In the SQL editor, paste and run **`supabase/schema.sql`** — it creates all
   tables (`profiles`, `questions`, `attempts`, `progress`, `achievements`,
   `user_achievements`, `glossary_terms`), a signup trigger that bootstraps a
   profile row, and Row Level Security policies (users can only touch their own
   rows; content tables are public-read).
3. Copy `.env.example` to `.env.local` and fill in from Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (seed script only — never shipped to the client)
4. Seed the content tables:

   ```bash
   npm run seed
   ```

5. (Optional) Enable Google OAuth: Supabase Dashboard → Authentication →
   Providers → Google. The "Google" button on `/auth` uses it.
6. (Optional) For instant email/password sign-in during development, disable
   "Confirm email" under Authentication → Providers → Email.

Restart `npm run dev` — sign-up, cloud persistence, and the leaderboard now work.
Guest progress merges into your account on first sign-in (higher XP wins).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run typecheck` | strict TypeScript check |
| `npm run seed` | seed questions/glossary/achievements into Supabase |
| `npm run lint` | eslint |

## Deploying to Vercel

Push to a Git repo, import it in Vercel, and set the two `NEXT_PUBLIC_SUPABASE_*`
env vars for Production/Preview. No other config needed — the app is a standard
Next.js 15 App Router project.

## Architecture notes

- **Content lives in code** (`src/content/`) — questions, lessons, and glossary
  are typed TypeScript data, so the game runs fully offline; the seed script
  mirrors them into Supabase (public-read) for portability/BI.
- **State**: Zustand with `persist` (localStorage) is the source of truth;
  `src/lib/supabase/sync.ts` pushes profile/attempts/progress after each submit
  and hydrates from the cloud on sign-in.
- **Judge**: `src/lib/runner.ts` builds a one-shot Worker from a Blob, injects
  a deep-equal + canonicalization harness, spreads each test case's `input`
  into the user's function, and terminates the worker on timeout.
- **Sandpack**: component questions mount a `react` template with
  `@testing-library/react`; the TESTS panel's results feed the same scoring
  pipeline.

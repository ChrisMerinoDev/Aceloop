-- AceLoop schema. Run this in the Supabase SQL editor (or `supabase db push`).

-- ===== Tables =====

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null default 'Hero',
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  rank text not null default 'Bronze',
  streak_count integer not null default 0,
  streak_freezes integer not null default 1,
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  category text not null check (category in ('dsa', 'frontend', 'system')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  level integer not null,
  prompt_md text not null,
  starter_code text not null,
  solution_md text not null,
  lesson_md text not null,
  test_cases jsonb not null default '[]',
  pattern text not null,
  tags text[] not null default '{}',
  time_limit_seconds integer not null default 1800,
  editor_type text not null check (editor_type in ('monaco', 'sandpack'))
);

create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_slug text not null,
  passed boolean not null default false,
  score integer not null default 0,
  tests_passed integer not null default 0,
  tests_total integer not null default 0,
  time_taken_seconds integer not null default 0,
  xp_earned integer not null default 0,
  submitted_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_slug text not null,
  status text not null default 'unlocked' check (status in ('locked', 'unlocked', 'solved')),
  best_score integer not null default 0,
  times_attempted integer not null default 0,
  last_attempted_at timestamptz,
  review_due_at timestamptz,
  primary key (user_id, question_slug)
);

create table if not exists public.achievements (
  id bigint generated always as identity primary key,
  key text not null unique,
  name text not null,
  description text not null,
  icon text not null default ''
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_key text not null references public.achievements (key) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_key)
);

create table if not exists public.glossary_terms (
  id bigint generated always as identity primary key,
  term text not null unique,
  definition text not null,
  why_it_exists text not null,
  purpose text not null,
  when_to_use text not null,
  related_terms text[] not null default '{}',
  category text not null
);

create index if not exists attempts_user_idx on public.attempts (user_id, submitted_at desc);
create index if not exists profiles_xp_idx on public.profiles (xp desc);

-- ===== Auto-create a profile on signup =====

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', 'Hero'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== Row Level Security =====

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.progress enable row level security;
alter table public.user_achievements enable row level security;
alter table public.questions enable row level security;
alter table public.achievements enable row level security;
alter table public.glossary_terms enable row level security;

-- Own-row access for user data.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select using (true); -- public read for leaderboard
drop policy if exists "own profile write" on public.profiles;
create policy "own profile write" on public.profiles for update using (auth.uid() = id);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "own attempts" on public.attempts;
create policy "own attempts" on public.attempts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own user_achievements" on public.user_achievements;
create policy "own user_achievements" on public.user_achievements for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public read-only content.
drop policy if exists "public questions" on public.questions;
create policy "public questions" on public.questions for select using (true);
drop policy if exists "public achievements" on public.achievements;
create policy "public achievements" on public.achievements for select using (true);
drop policy if exists "public glossary" on public.glossary_terms;
create policy "public glossary" on public.glossary_terms for select using (true);

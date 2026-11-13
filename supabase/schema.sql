-- Английский путь: облачное хранение прогресса.
-- Запустить один раз в Supabase → SQL Editor → New query → вставить всё → Run.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nick       text not null unique,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Защита: каждый видит и меняет только свою строку.
alter table public.progress enable row level security;

drop policy if exists "own row: read"   on public.progress;
drop policy if exists "own row: insert" on public.progress;
drop policy if exists "own row: update" on public.progress;

create policy "own row: read"   on public.progress for select using (auth.uid() = user_id);
create policy "own row: insert" on public.progress for insert with check (auth.uid() = user_id);
create policy "own row: update" on public.progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Ник не повторяется без учёта регистра.
create unique index if not exists progress_nick_lower on public.progress (lower(nick));

-- Вход по нику: по нику находим служебный логин. Нужна, чтобы смена имени не ломала вход.
create or replace function public.login_email(p_nick text) returns text
language sql security definer set search_path = public, auth as $$
  select u.email from auth.users u join public.progress p on p.user_id = u.id
  where lower(p.nick) = lower(p_nick) limit 1;
$$;
revoke all on function public.login_email(text) from public;
grant execute on function public.login_email(text) to anon, authenticated;

-- Админы: видят прогресс всех учеников (только чтение).
create table if not exists public.admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table public.admins enable row level security;
drop policy if exists "admins: self" on public.admins;
create policy "admins: self" on public.admins for select using (auth.uid() = user_id);
drop policy if exists "admin: read all" on public.progress;
create policy "admin: read all" on public.progress for select using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
-- Назначить админа:  insert into public.admins (user_id) select user_id from public.progress where lower(nick) = lower('ZXCVBN');

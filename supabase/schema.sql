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

-- (2026-11-17) Ник занят? — без раскрытия почты. Заменяет login_email (тот отдавал почту по нику).
create or replace function public.nick_taken(p_nick text) returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from public.progress where lower(nick) = lower(trim(p_nick)));
$$;
revoke all on function public.nick_taken(text) from public;
grant execute on function public.nick_taken(text) to anon, authenticated;

-- (2026-11-17) Админ удаляет ученика: аккаунт + прогресс (каскадом). Себя удалить нельзя.
create or replace function public.admin_delete_user(p_uid uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then raise exception 'not admin'; end if;
  if p_uid = auth.uid() then raise exception 'cannot delete yourself'; end if;
  delete from auth.users where id = p_uid;
end $$;
revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- (2026-11-17) Админ открывает ученику все классы без контрольных (флаг unlockAll в его прогрессе).
create or replace function public.admin_set_unlock(p_uid uuid, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then raise exception 'not admin'; end if;
  update public.progress set data = jsonb_set(data, '{unlockAll}', to_jsonb(p_on)), updated_at = now() where user_id = p_uid;
end $$;
revoke all on function public.admin_set_unlock(uuid, boolean) from public;
grant execute on function public.admin_set_unlock(uuid, boolean) to authenticated;

-- (2026-11-17) Есть ли ещё аккаунт? Экран входа прячет профили устройства, чьи аккаунты удалены.
create or replace function public.account_exists(p_uid uuid) returns boolean
language sql security definer set search_path = public, auth as $$
  select exists (select 1 from auth.users where id = p_uid);
$$;
revoke all on function public.account_exists(uuid) from public;
grant execute on function public.account_exists(uuid) to anon, authenticated;

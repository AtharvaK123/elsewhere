-- Run once in the Supabase SQL editor. Players sign in with email accounts (Authentication > Email).
-- These tables store players and room membership; map tiles never enter the database.
create table if not exists public.elsewhere_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 24),
  appearance jsonb not null default '{}' check (jsonb_typeof(appearance) = 'object' and octet_length(appearance::text) < 2048),
  updated_at timestamptz not null default now()
);
create table if not exists public.elsewhere_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Za-z0-9_-]{12,64}$'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.elsewhere_members (
  room_id uuid not null references public.elsewhere_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key(room_id,user_id)
);
create table if not exists public.elsewhere_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id uuid not null references public.elsewhere_rooms(id) on delete cascade,
  latitude double precision not null check (latitude between -85 and 85),
  longitude double precision not null check (longitude between -180 and 180),
  heading double precision not null default 0 check (heading between -10000 and 10000),
  updated_at timestamptz not null default now()
);
create index if not exists elsewhere_sessions_room_time on public.elsewhere_sessions(room_id,updated_at);
alter table public.elsewhere_profiles enable row level security;
alter table public.elsewhere_rooms enable row level security;
alter table public.elsewhere_members enable row level security;
alter table public.elsewhere_sessions enable row level security;

-- Profiles are private to the owner. Room peers receive the chosen public avatar via Realtime.
create policy "elsewhere profile read own" on public.elsewhere_profiles for select to authenticated using (id=(select auth.uid()));
create policy "elsewhere profile insert own" on public.elsewhere_profiles for insert to authenticated with check (id=(select auth.uid()));
create policy "elsewhere profile update own" on public.elsewhere_profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy "elsewhere membership read own" on public.elsewhere_members for select to authenticated using (user_id=(select auth.uid()));
create policy "elsewhere membership leave own" on public.elsewhere_members for delete to authenticated using (user_id=(select auth.uid()));
create policy "elsewhere room read joined" on public.elsewhere_rooms for select to authenticated using (exists(select 1 from public.elsewhere_members m where m.room_id=id and m.user_id=(select auth.uid())));
create policy "elsewhere session read joined" on public.elsewhere_sessions for select to authenticated using (exists(select 1 from public.elsewhere_members m where m.room_id=elsewhere_sessions.room_id and m.user_id=(select auth.uid())));
create policy "elsewhere session insert own" on public.elsewhere_sessions for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.elsewhere_members m where m.room_id=elsewhere_sessions.room_id and m.user_id=(select auth.uid())));
create policy "elsewhere session update own" on public.elsewhere_sessions for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()) and exists(select 1 from public.elsewhere_members m where m.room_id=elsewhere_sessions.room_id and m.user_id=(select auth.uid())));
create policy "elsewhere session delete own" on public.elsewhere_sessions for delete to authenticated using (user_id=(select auth.uid()));

create or replace function public.elsewhere_join_room(p_code text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_user uuid:=auth.uid(); v_room uuid;
begin
  if v_user is null then raise exception 'Sign in before joining a room'; end if;
  if p_code is null or p_code !~ '^[A-Za-z0-9_-]{12,64}$' then raise exception 'Invalid room code'; end if;
  insert into public.elsewhere_rooms(code,created_by) values(p_code,v_user) on conflict(code) do nothing;
  select id into v_room from public.elsewhere_rooms where code=p_code;
  insert into public.elsewhere_members(room_id,user_id) values(v_room,v_user) on conflict do nothing;
  return v_room;
end;
$$;
revoke all on function public.elsewhere_join_room(text) from public,anon;
grant execute on function public.elsewhere_join_room(text) to authenticated;
grant select,insert,update on public.elsewhere_profiles to authenticated;
grant select on public.elsewhere_rooms to authenticated;
grant select,delete on public.elsewhere_members to authenticated;
grant select,insert,update,delete on public.elsewhere_sessions to authenticated;

-- Private Realtime channels use membership in the database for authorization.
create policy "elsewhere realtime receive joined" on realtime.messages for select to authenticated
using (exists(select 1 from public.elsewhere_members m where m.user_id=(select auth.uid()) and realtime.topic()='elsewhere:'||m.room_id::text));
create policy "elsewhere realtime send joined" on realtime.messages for insert to authenticated
with check (exists(select 1 from public.elsewhere_members m where m.user_id=(select auth.uid()) and realtime.topic()='elsewhere:'||m.room_id::text));

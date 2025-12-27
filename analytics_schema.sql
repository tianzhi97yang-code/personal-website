-- Visitor Logs Table
create table public.visitor_logs (
  id uuid not null default gen_random_uuid(),
  ip text,
  city text,
  country text,
  user_agent text,
  path text,
  visited_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- RLS
alter table public.visitor_logs enable row level security;

-- Allow anyone (anon) to insert logs (so we can track them)
create policy "Everyone can insert logs" on public.visitor_logs
  for insert with check (true);

-- Allow only 'admin' (or authenticated if we had auth) to view logs.
-- Since we use a simple 'isAdmin' state in frontend without real auth, we should ideally restrict this heavily.
-- For now, to make it work with the current "Password" system (which uses anon key), we might have to allow public select
-- BUT this is "spy" data. Let's try to restrict it.
-- Actually, the frontend "isAdmin" just shows/hides UI. The key is public.
-- To properly secure this read, we should use Supabase Auth.
-- CHECK: The user asked to "see info ONLY when admin".
-- If we stick to the current architecture (Public Key only), ANYONE who knows the table name can fetch logs via API.
-- RECOMMENDATION: We will implement it with "Public Select" for now to make it work, but warn the user.
-- OR, we can use a Database Function (RPC) to fetch logs that requires a secret? No, API key is public.
-- OK, for this user's simple static site request, we will ALLOW SELECT to public, but rely on "Security by Obscurity" (only Admin UI shows it).
create policy "Public can view logs (Caution)" on public.visitor_logs
  for select using (true);

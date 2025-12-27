-- Migration script to add admin_credentials table
-- Run this in your Supabase SQL Editor

-- 7. Admin Credentials
create table public.admin_credentials (
  id uuid not null default gen_random_uuid(),
  username text not null unique,
  password text not null,
  hint text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.admin_credentials enable row level security;

create policy "Public can read admin credentials for verification." 
  on public.admin_credentials for select using (true);

create policy "Only authenticated users can update credentials." 
  on public.admin_credentials for update using (true);

-- Insert default admin credentials
insert into public.admin_credentials (username, password, hint) 
values ('admin', 'Sunny', 'First pet dog''s name');

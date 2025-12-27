-- Enable Row Level Security (RLS)
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Profiles Table
create table public.profiles (
  id uuid not null default gen_random_uuid(),
  key text not null unique, -- 'admin' or 'user'
  name text,
  title text,
  affiliation text,
  bio text,
  name_zh text,
  title_zh text,
  affiliation_zh text,
  bio_zh text,
  motto text,
  motto_zh text,
  avatar_url text,
  cover_image text,
  cover_title text,
  cover_title_zh text,
  cv_pdf_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (true);
create policy "Users can update own profile." on public.profiles for update using (true);

-- 2. Memes / Home Posters
create table public.meme_posts (
  id uuid not null default gen_random_uuid(),
  title text,
  caption text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.meme_posts enable row level security;
create policy "Public memes are viewable by everyone." on public.meme_posts for select using (true);
create policy "Everyone can insert memes (Admin only in app)." on public.meme_posts for insert with check (true);
create policy "Everyone can update memes." on public.meme_posts for update using (true);
create policy "Everyone can delete memes." on public.meme_posts for delete using (true);

-- 3. Publications
create table public.publications (
  id uuid not null default gen_random_uuid(),
  title text,
  authors text,
  venue text,
  year integer,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.publications enable row level security;
create policy "Public publications are viewable by everyone." on public.publications for select using (true);
create policy "Everyone can insert/update/delete publications." on public.publications for all using (true);

-- 4. Conferences
create table public.conferences (
  id uuid not null default gen_random_uuid(),
  title text,
  event text,
  date text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.conferences enable row level security;
create policy "Public conferences are viewable by everyone." on public.conferences for select using (true);
create policy "Everyone can insert/update/delete conferences." on public.conferences for all using (true);

-- 5. Blogs
create table public.blog_posts (
  id uuid not null default gen_random_uuid(),
  title text,
  content text,
  category text,
  excerpt text,
  date text,
  image text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.blog_posts enable row level security;
create policy "Public blogs are viewable by everyone." on public.blog_posts for select using (true);
create policy "Everyone can insert/update/delete blogs." on public.blog_posts for all using (true);

-- 6. Education
create table public.education (
  id uuid not null default gen_random_uuid(),
  degree text,
  school text,
  year text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
alter table public.education enable row level security;
create policy "Public education are viewable by everyone." on public.education for select using (true);
create policy "Everyone can insert/update/delete education." on public.education for all using (true);

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
create policy "Public can read admin credentials for verification." on public.admin_credentials for select using (true);
create policy "Only authenticated users can update credentials." on public.admin_credentials for update using (true);

-- Insert default admin credentials
insert into public.admin_credentials (username, password, hint) 
values ('admin', 'Sunny', 'First pet dog''s name');

-- Storage Bucket
insert into storage.buckets (id, name, public) values ('content_images', 'content_images', true);
create policy "Public Access" on storage.objects for select using ( bucket_id = 'content_images' );
create policy "Public Insert" on storage.objects for insert with check ( bucket_id = 'content_images' );
create policy "Public Update" on storage.objects for update using ( bucket_id = 'content_images' );

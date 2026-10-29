-- Public content is readable; editing is reserved for the explicitly provisioned owner.
create table public.portfolio_owner (
 user_id uuid primary key references auth.users(id) on delete cascade,
 singleton boolean not null default true unique check (singleton)
);
alter table public.portfolio_owner enable row level security;
grant select on public.portfolio_owner to authenticated;
create policy owner_reads_membership on public.portfolio_owner for select to authenticated using (user_id = (select auth.uid()));
create table public.profile (
 id integer primary key default 1 check (id=1),
 full_name text not null check(length(full_name) between 3 and 100),
 headline text not null, intro text not null default '', bio text not null default '',
 location text not null default '', learning text[] not null default '{}',
 photo_url text not null default '/images/portrait-demo.png', photo_is_demo boolean not null default true,
 email text not null default '', github_url text not null default '', instagram_url text not null default '', availability text not null default '',
 updated_at timestamptz not null default now()
);
alter table public.profile enable row level security;
grant select on public.profile to anon, authenticated;
grant update on public.profile to authenticated;
create policy public_profile on public.profile for select to anon, authenticated using (true);
create policy owner_updates_profile on public.profile for update to authenticated using (exists(select 1 from public.portfolio_owner where user_id=(select auth.uid()))) with check (exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create table public.projects (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null, summary text not null, description text not null default '', role text not null default '', year integer not null default 2026 check (year between 2000 and 2100),
 tags text[] not null default '{}', cover_url text not null, cover_is_concept boolean not null default false,
 live_url text not null default '', source_url text not null default '', status text not null default 'draft' check (status in ('draft','published')),
 sort_order integer not null default 0 check(sort_order>=0), updated_at timestamptz not null default now()
);
create index projects_public_order on public.projects(status,sort_order);
alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;
grant insert,update,delete on public.projects to authenticated;
create policy published_projects on public.projects for select to anon, authenticated using(status='published');
create policy owner_reads_projects on public.projects for select to authenticated using(exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create policy owner_inserts_projects on public.projects for insert to authenticated with check(exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create policy owner_updates_projects on public.projects for update to authenticated using(exists(select 1 from public.portfolio_owner where user_id=(select auth.uid()))) with check(exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create policy owner_deletes_projects on public.projects for delete to authenticated using(exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create function public.touch_updated_at() returns trigger language plpgsql security invoker set search_path='' as $$ begin new.updated_at=now();return new;end; $$;
revoke execute on function public.touch_updated_at() from public,anon,authenticated;
create trigger profile_updated before update on public.profile for each row execute function public.touch_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.touch_updated_at();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('portfolio','portfolio',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy owner_uploads on storage.objects for insert to authenticated with check(bucket_id='portfolio' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create policy owner_reads_uploads on storage.objects for select to authenticated using(bucket_id='portfolio' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));
create policy owner_updates_uploads on storage.objects for update to authenticated using(bucket_id='portfolio' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.portfolio_owner where user_id=(select auth.uid()))) with check(bucket_id='portfolio' and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.portfolio_owner where user_id=(select auth.uid())));

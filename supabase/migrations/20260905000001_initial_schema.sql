-- ==============================================================================
-- DS-CONNECT INITIAL DATABASE MIGRATION
-- Migration: 20260905000001_initial_schema.sql
-- Description: Core schema, Enums, Profiles, Opportunities, Team Requests,
--              Projects, Placements, Consents (DPDP Act), RLS & Triggers.
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Custom Enumeration Types
do $$ begin
    create type user_role as enum ('student', 'alumni', 'mentor', 'admin');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type opportunity_type as enum ('hackathon', 'event', 'internship', 'research', 'workshop');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type opportunity_status as enum ('draft', 'published', 'closed', 'archived');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type request_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type consent_status as enum ('granted', 'withdrawn');
exception
    when duplicate_object then null;
end $$;

-- ==============================================================================
-- 3. PROFILES TABLE (Extends Supabase auth.users)
-- ==============================================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    email text unique not null,
    avatar_url text,
    college_year int check (college_year between 1 and 5),
    role user_role default 'student'::user_role not null,
    bio text,
    skills text[] default '{}' not null,
    github_handle text,
    linkedin_url text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

comment on table public.profiles is 'Public student and user profiles linked to Supabase Auth.';

-- Trigger to automatically create a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, email, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    )
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 4. OPPORTUNITIES TABLE (Events, Hackathons, Internships)
-- ==============================================================================
create table if not exists public.opportunities (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    type opportunity_type not null,
    status opportunity_status default 'published'::opportunity_status not null,
    organizer text not null,
    deadline timestamptz not null,
    location text default 'Online' not null,
    external_link text,
    tags text[] default '{}' not null,
    submitted_by uuid not null references public.profiles(id) on delete restrict,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_opportunities_deadline on public.opportunities(deadline);
create index if not exists idx_opportunities_status on public.opportunities(status);
create index if not exists idx_opportunities_type on public.opportunities(type);

-- ==============================================================================
-- 5. TEAM REQUESTS TABLE (Teammate Search for Hackathons/Projects)
-- ==============================================================================
create table if not exists public.team_requests (
    id uuid primary key default gen_random_uuid(),
    opportunity_id uuid not null references public.opportunities(id) on delete cascade,
    requester_id uuid not null references public.profiles(id) on delete cascade,
    title text not null,
    role_needed text not null,
    skills_required text[] default '{}' not null,
    max_members int default 4 check (max_members between 2 and 10) not null,
    current_members_count int default 1 check (current_members_count <= max_members) not null,
    status request_status default 'pending'::request_status not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_team_requests_opp on public.team_requests(opportunity_id);
create index if not exists idx_team_requests_requester on public.team_requests(requester_id);

-- ==============================================================================
-- 6. PROJECTS & PROJECT MEMBERS TABLES
-- ==============================================================================
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    technologies text[] default '{}' not null,
    repo_url text,
    live_url text,
    owner_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.project_members (
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    role text default 'Contributor' not null,
    joined_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (project_id, user_id)
);

-- ==============================================================================
-- 7. ACHIEVEMENTS & PLACEMENTS TABLES
-- ==============================================================================
create table if not exists public.achievements (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null references public.profiles(id) on delete cascade,
    category text not null, -- e.g., 'Award', 'Certification', 'Hackathon Win'
    title text not null,
    description text,
    achievement_date date not null,
    certificate_url text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.placements (
    id uuid primary key default gen_random_uuid(),
    student_id uuid not null references public.profiles(id) on delete cascade,
    company text not null,
    role text not null,
    package_lpa numeric(5, 2), -- CTC in LPA (optional / protected)
    placement_year int not null,
    is_verified boolean default false not null,
    consent_for_public_display boolean default false not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. INDIA DPDP ACT 2023 CONSENT AUDIT LOG TABLE
-- ==============================================================================
create table if not exists public.user_consents (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    purpose text not null, -- e.g., 'placement_public_listing', 'email_notifications', 'whatsapp_channel'
    status consent_status not null,
    policy_version text not null default 'v1.0',
    ip_address text,
    user_agent text,
    timestamp timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_user_consents_user on public.user_consents(user_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.team_requests enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.achievements enable row level security;
alter table public.placements enable row level security;
alter table public.user_consents enable row level security;

-- PROFILES POLICIES
create policy "Profiles are viewable by everyone"
    on public.profiles for select using (true);

create policy "Users can update their own profile"
    on public.profiles for update using (auth.uid() = id);

-- OPPORTUNITIES POLICIES
create policy "Published opportunities are viewable by everyone"
    on public.opportunities for select using (status = 'published');

create policy "Authenticated users can submit opportunities"
    on public.opportunities for insert with check (auth.uid() = submitted_by);

create policy "Submitters and Admins can update their opportunities"
    on public.opportunities for update using (
        auth.uid() = submitted_by 
        or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can delete opportunities"
    on public.opportunities for delete using (
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

-- TEAM REQUESTS POLICIES
create policy "Team requests are viewable by authenticated users"
    on public.team_requests for select using (auth.role() = 'authenticated');

create policy "Users can create team requests"
    on public.team_requests for insert with check (auth.uid() = requester_id);

create policy "Requesters can update their team requests"
    on public.team_requests for update using (auth.uid() = requester_id);

create policy "Requesters can delete their team requests"
    on public.team_requests for delete using (auth.uid() = requester_id);

-- PROJECTS & MEMBERS POLICIES
create policy "Projects are viewable by everyone"
    on public.projects for select using (true);

create policy "Authenticated users can create projects"
    on public.projects for insert with check (auth.uid() = owner_id);

create policy "Project owners can update their projects"
    on public.projects for update using (auth.uid() = owner_id);

create policy "Project owners can delete their projects"
    on public.projects for delete using (auth.uid() = owner_id);

create policy "Project members are viewable by everyone"
    on public.project_members for select using (true);

create policy "Owners can manage project members"
    on public.project_members for all using (
        exists (select 1 from public.projects where id = project_id and owner_id = auth.uid())
    );

-- ACHIEVEMENTS POLICIES
create policy "Achievements are viewable by everyone"
    on public.achievements for select using (true);

create policy "Students can manage their own achievements"
    on public.achievements for all using (auth.uid() = student_id);

-- PLACEMENTS POLICIES (Privacy Protected)
create policy "Placement data visible only if explicitly consented or owner"
    on public.placements for select using (
        consent_for_public_display = true 
        or auth.uid() = student_id
        or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

create policy "Students can manage their own placement records"
    on public.placements for all using (auth.uid() = student_id);

-- USER CONSENTS POLICIES (DPDP Act Compliance)
create policy "Users can view and manage their own consents"
    on public.user_consents for all using (auth.uid() = user_id);

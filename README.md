# DS-Connect 🚀

**DS-Connect** is a low-latency, modular web platform designed to connect Data Science students with hackathons, project opportunities, peer matchmaking, mentorship, and placement tracking.

---

## Tech Stack

* **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
* **Backend**: FastAPI (Python 3.11+), Pydantic v2, SQLAlchemy Async, PyJWT
* **Database & Auth**: Supabase (PostgreSQL 15, Row-Level Security, Managed Auth)
* **Caching & Queues**: Redis, ARQ / Celery
* **Compliance**: India Digital Personal Data Protection (DPDP) Act 2023

---

## Step 1: Database Setup Guide

### Option A: Supabase Cloud (Fastest - No Docker Required)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Copy the contents of `supabase/migrations/20260905000001_initial_schema.sql` and run it.
4. (Optional) Run `supabase/seed.sql` to populate sample events and profiles.
5. In your project settings, copy your `Project URL` and `anon public key` into `.env`.

### Option B: Local Supabase (Requires Docker Desktop)
1. Ensure Docker Desktop is running.
2. Run in terminal:
   ```bash
   npx supabase start
   npx supabase db reset
   ```
3. Supabase Studio will be accessible at `http://localhost:54323`.

---

## Project Structure Overview

```text
ds-connect/
├── apps/
│   ├── api/          # FastAPI application
│   └── web/          # Next.js React frontend
├── supabase/
│   ├── migrations/   # PostgreSQL schema & RLS policies
│   ├── config.toml   # Local Supabase engine config
│   └── seed.sql      # Seed data for testing
├── infra/            # Terraform modules for cloud deployment
├── scripts/          # Automation scripts (type generation, local setup)
└── docs/             # Architecture, compliance, and runbooks
```

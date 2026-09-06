# DS-Connect 🚀
> Data Science Cohort & Student Portal — Full-Stack Web Application

**DS-Connect** is a full-stack, modular web platform designed for Data Science student cohorts. It provides centralized placement drive tracking, hackathon and opportunity discovery with deadline countdowns, student project showcasing with admin moderation, team roster management, and 1-click WhatsApp community sharing.

---

## 🌟 Key Features

1. **Placements Hub**: Track hiring drives, CTC/salary packages, eligibility criteria, required skills, and deadlines. Filter by location and status, view in-depth details modal, apply directly, and broadcast to WhatsApp.
2. **Hackathons & Opportunities**: Discover coding competitions with live deadline countdowns, prize pool indicators, mode (online/offline/hybrid), team size restrictions, and WhatsApp broadcast integration.
3. **Project Showcase**: Student-submitted machine learning and web projects with GitHub repositories, live demo links, and an administrative approval workflow (`pending` ➔ `approved` / `rejected`).
4. **Team Members**: Cohort roster displaying **Name**, **Year**, and **Working Section** (e.g., *Lakshya Saini, 2nd Year, Data Science*). Supports instant member addition and removal.
5. **WhatsApp Community Sharing**: Unified sharing service supporting both official Meta WhatsApp Business Cloud API and automatic 1-click fallback with pre-filled WhatsApp Web/Mobile URLs.
6. **Authentication & Admin Dashboard**: Role-based access control (`student` vs. `admin`). Admin dashboard features statistics overviews, placement CRUD, hackathon management, project approval queue, member roster management, and a WhatsApp Broadcast Studio.
7. **Dual Theme Support**: Flawless Light Mode and Dark Mode with instant toggle and persistent theme preferences.

---

## 📁 Project Architecture

Frontend and backend are cleanly decoupled into standalone directories:

```text
ds-connect/
├── frontend/             # Next.js 14 (App Router), React, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/          # /placements, /hackathons, /projects, /members, /admin, /dashboard
│   │   ├── components/   # Modular UI components & modals
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── lib/api.ts    # Typed client SDK for backend endpoints
│   │   └── types/        # TypeScript data definitions
│   └── package.json
│
├── backend/              # FastAPI (Python 3.11+), SQLAlchemy Async, Pydantic v2
│   ├── app/
│   │   ├── api/v1/       # REST API routers (placements, hackathons, projects, members, whatsapp)
│   │   ├── core/         # Config & auth dependencies
│   │   ├── database/     # Async database sessions & Supabase client
│   │   ├── models/       # Declarative SQLAlchemy models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Business logic & WhatsApp service
│   │   └── main.py       # FastAPI application
│   └── requirements.txt
│
├── docs/                 # Detailed architecture, API, and database manuals
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DATABASE.md
│
├── supabase/             # PostgreSQL migrations & config
└── docker-compose.yml    # Containerized multi-service deployment
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
* **Node.js 18+** and `npm`
* **Python 3.11+**
* **Docker Desktop** (for local Supabase/Postgres) or Supabase Cloud account

---

### Step 1: Database Setup

Ensure your PostgreSQL instance or Supabase local stack is running:
```bash
# If using Supabase CLI with Docker:
npx supabase start
```
Default local database URL: `postgresql+asyncpg://postgres:postgres@localhost:54322/postgres`

---

### Step 2: Run the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend API will be live at:
* API Root: `http://localhost:8000`
* Interactive Swagger UI: `http://localhost:8000/docs`
* API Health Check: `http://localhost:8000/api/v1/health`

---

### Step 3: Run the Frontend

In a separate terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Frontend application will be live at:
* Portal: `http://localhost:3000`
* Hackathons: `http://localhost:3000/hackathons`
* Placements: `http://localhost:3000/placements`
* Project Showcase: `http://localhost:3000/projects`
* Team Members: `http://localhost:3000/members`
* Admin Dashboard: `http://localhost:3000/admin`

---

## ⚙️ Environment Variables

### Root / Backend (`backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:54322/postgres
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
PORT=8000
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# WhatsApp Cloud API (Optional - falls back to direct share URL if empty)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_RECIPIENT_GROUP_ID=
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🛡️ Security & Roles

* **Student Role**: Browse listings, submit projects for review, filter opportunities, and share announcements.
* **Admin Role**: Full CRUD on placements and hackathons, review and approve student project submissions, add and remove team roster members, and broadcast updates via WhatsApp Studio.

---

## 📖 Extended Documentation
* [Architecture Guide](docs/ARCHITECTURE.md)
* [REST API Documentation](docs/API.md)
* [Database Schema Guide](docs/DATABASE.md)\n
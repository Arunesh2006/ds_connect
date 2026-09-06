# DS-Connect — Database Schema & Architecture

The database runs on PostgreSQL 15 via Supabase, utilizing async connection pooling, UUID primary keys, and Row-Level Security (RLS).

---

## 1. Entity-Relationship Diagram

```mermaid
erDiagram
    PROFILES ||--o{ PLACEMENTS : "owns / records"
    PROFILES ||--o{ PROJECTS : "submits"
    PROFILES ||--o{ HACKATHONS : "submits"
    
    PROFILES {
        uuid id PK
        text email
        text full_name
        text role "student | admin | faculty"
        integer college_year
        text department
        text responsibility "Working Section"
        text bio
        text[] skills
        text github_handle
        text linkedin_url
        timestamptz created_at
    }

    PLACEMENTS {
        uuid id PK
        uuid student_id FK
        text company
        text role
        numeric package_lpa
        integer placement_year
        text eligibility
        text[] skills
        text location
        timestamptz application_deadline
        text application_link
        text description
        text status "active | upcoming | closed"
        boolean is_verified
        boolean consent_for_public_display
        timestamptz created_at
    }

    HACKATHONS {
        uuid id PK
        text title
        text organizer
        text description
        timestamptz deadline
        text location
        text external_link
        text[] tags
        text prize_pool
        timestamptz start_date
        timestamptz end_date
        text mode "online | offline | hybrid"
        text team_size
        text status "active | upcoming | concluded"
        uuid submitted_by FK
        timestamptz created_at
    }

    PROJECTS {
        uuid id PK
        text title
        text description
        text[] technologies
        text repo_url
        text live_url
        uuid owner_id FK
        text status "pending | approved | rejected"
        timestamptz created_at
    }

    ACHIEVEMENTS {
        uuid id PK
        uuid student_id FK
        text category
        text title
        text description
        date achievement_date
        text certificate_url
        timestamptz created_at
    }
```

---

## 2. Table Specifications

### `public.profiles`
Represents users, cohort team members, faculty, and administrators.
* `id` (`uuid`, PK): Corresponds to Supabase Auth UID.
* `full_name` (`text`): Member's display name.
* `college_year` (`integer`): Academic year (1, 2, 3, 4).
* `responsibility` (`text`): The designated team/working section (e.g. *Data Science*, *Placement Coordinator*, *Web Infrastructure*).
* `role` (`text`): `student`, `admin`, or `faculty`.

### `public.placements`
Recruitment drives, company listings, and verified placement offers.
* `id` (`uuid`, PK)
* `company` (`text`): Hiring organization.
* `role` (`text`): Job designation.
* `package_lpa` (`numeric`): Compensation in Lakhs Per Annum.
* `eligibility` (`text`): Degree and CGPA criteria.
* `skills` (`text[]`): Required technical competencies.
* `location` (`text`): Job location / remote status.
* `application_deadline` (`timestamptz`): Last date to apply.
* `application_link` (`text`): Career portal URL.
* `description` (`text`): Drive details and selection process.
* `status` (`text`): `active`, `upcoming`, or `closed`.

### `public.opportunities` (Hackathons)
Hackathons, workshops, and competitive data science events.
* `id` (`uuid`, PK)
* `title` (`text`): Event name.
* `organizer` (`text`): Hosting university or platform.
* `deadline` (`timestamptz`): Registration cutoff.
* `prize_pool` (`text`): Cash rewards, prizes, or grants.
* `start_date` / `end_date` (`timestamptz`): Event schedule.
* `mode` (`text`): `online`, `offline`, or `hybrid`.
* `team_size` (`text`): Permitted team members (e.g., `1 - 4`).

### `public.projects`
Student projects with administrative approval pipeline.
* `id` (`uuid`, PK)
* `title` (`text`): Project title.
* `description` (`text`): Summary and architectural details.
* `technologies` (`text[]`): Tech stack tags.
* `repo_url` (`text`): GitHub / GitLab repository.
* `live_url` (`text`): Deployed web application or demo.
* `status` (`text`): `pending`, `approved`, or `rejected`. Default: `approved`.\n
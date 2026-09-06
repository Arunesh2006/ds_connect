# DS-Connect — REST API Documentation

Base URL: `http://localhost:8000/api/v1`  
Interactive Swagger UI: `http://localhost:8000/docs`  
Interactive ReDoc: `http://localhost:8000/redoc`

---

## 1. Health & Status

### `GET /api/v1/health`
Checks backend and database connectivity.
* **Response (200 OK):**
```json
{
  "status": "healthy",
  "app": "DS-Connect API",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## 2. Placements & Drives

### `GET /api/v1/placements`
List verified placement drives and recruitment records.
* **Query Parameters:**
  - `search` (string, optional): Filter by company name or role.
  - `location` (string, optional): Filter by location.
  - `status` (string, optional): Filter by `active`, `upcoming`, `closed`.
* **Response (200 OK):** Array of `Placement` objects.

### `GET /api/v1/placements/{id}`
Retrieve full details of a specific placement listing.

### `POST /api/v1/placements`
Create a new placement drive (Requires Admin).
* **Request Body:**
```json
{
  "company": "Amazon AWS",
  "role": "Applied Data Scientist",
  "package_lpa": 32.5,
  "placement_year": 2026,
  "eligibility": "B.Tech / M.Tech Data Science, CGPA >= 7.5",
  "skills": ["Python", "PyTorch", "AWS S3", "Distributed Systems"],
  "location": "Bangalore / Remote",
  "application_deadline": "2026-10-31T23:59:59",
  "application_link": "https://amazon.jobs",
  "description": "Drive for high-performance ML systems engineering.",
  "status": "active"
}
```

### `PUT /api/v1/placements/{id}`
Update existing placement drive (Requires Admin).

### `DELETE /api/v1/placements/{id}`
Delete a placement listing (Requires Admin).

### `GET /api/v1/placements/achievements`
List public cohort placement achievements and milestones.

---

## 3. Hackathons & Opportunities

### `GET /api/v1/hackathons`
List all hackathons, workshops, and competitions.
* **Query Parameters:**
  - `search` (string, optional)
  - `mode` (string, optional): `online`, `offline`, `hybrid`
  - `status` (string, optional): `active`, `upcoming`, `concluded`
* **Response (200 OK):** Array of `Hackathon` objects.

### `POST /api/v1/hackathons`
Create a new hackathon entry.
* **Request Body:**
```json
{
  "title": "National Data Science Cup 2026",
  "organizer": "Data Science Society",
  "description": "48-hour competitive predictive modeling and LLM hackathon.",
  "deadline": "2026-10-15T23:59:59",
  "location": "Hybrid / Campus Auditorium",
  "external_link": "https://hackerearth.com/national-ds-2026",
  "tags": ["MachineLearning", "NLP", "ComputerVision"],
  "prize_pool": "Rs. 2,50,000",
  "start_date": "2026-10-20T09:00:00",
  "end_date": "2026-10-22T17:00:00",
  "mode": "hybrid",
  "team_size": "2 - 4 Members"
}
```

### `PUT /api/v1/hackathons/{id}`
Update hackathon details (Requires Admin).

### `DELETE /api/v1/hackathons/{id}`
Delete a hackathon listing (Requires Admin).

---

## 4. Project Showcase

### `GET /api/v1/projects`
List approved showcase projects.
* **Query Parameters:**
  - `search` (string, optional)
  - `technology` (string, optional)
* **Response (200 OK):** Array of approved `Project` objects.

### `GET /api/v1/projects/admin/all`
List all projects including pending, approved, and rejected submissions (Requires Admin).

### `POST /api/v1/projects`
Submit a new student project for showcase review.
* **Request Body:**
```json
{
  "title": "Neural Time-Series Forecaster",
  "description": "Transformers for multivariate financial and sensor data.",
  "technologies": ["PyTorch", "FastAPI", "React", "Docker"],
  "repo_url": "https://github.com/student/timeseries",
  "live_url": "https://timeseries.demo.app"
}
```

### `PUT /api/v1/projects/{id}/approve`
Approve or reject a submitted student project (Requires Admin).
* **Request Body:**
```json
{
  "status": "approved"
}
```

---

## 5. Team Members (Cohort Roster)

Per specification, each member entry consists of **Name**, **Year**, and **Working Section**.

### `GET /api/v1/members`
List all cohort team members.
* **Query Parameters:**
  - `search` (string, optional)
  - `year` (integer, optional)
  - `section` (string, optional)
* **Response (200 OK):** Array of `Member` objects.

### `POST /api/v1/members`
Add a new team member to the cohort.
* **Request Body:**
```json
{
  "name": "Lakshya Saini",
  "college_year": 2,
  "responsibility": "Data Science Core & Systems",
  "email": "lakshya@dsconnect.edu"
}
```

### `DELETE /api/v1/members/{id}`
Remove a member from the roster (Requires Admin).

---

## 6. WhatsApp Community Integration

### `POST /api/v1/whatsapp/publish`
Broadcast an opportunity, placement, or project announcement.
* **Request Body:**
```json
{
  "content_type": "placement",
  "title": "Google SWE Intern - Data Engineering",
  "organizer": "Google India",
  "description": "High-throughput data pipeline and ML infra engineering.",
  "deadline": "2026-11-01",
  "link": "https://careers.google.com",
  "tags": ["DataEngineering", "Python", "GCP"],
  "custom_notes": "Immediate openings for batch of 2026"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "status": "fallback_share_ready",
  "message": "Direct WhatsApp broadcast link generated successfully.",
  "formatted_text": "*DS-CONNECT ANNOUNCEMENT*...",
  "share_url": "https://api.whatsapp.com/send?text=...",
  "destination": null
}
```\n
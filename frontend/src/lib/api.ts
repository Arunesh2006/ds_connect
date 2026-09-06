import {
  Hackathon,
  HackathonCreate,
  Placement,
  PlacementCreate,
  Achievement,
  AchievementCreate,
  Project,
  ProjectCreate,
  Member,
  MemberCreate,
  WhatsAppPublishResponse
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// =================== HACKATHONS ===================
export async function fetchHackathons(search?: string, mode?: string, status?: string): Promise<Hackathon[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (mode && mode !== 'all') params.append('mode', mode);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${API_BASE}/api/v1/hackathons?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch hackathons error:', err);
    return [];
  }
}

export async function createHackathon(data: HackathonCreate): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/api/v1/hackathons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errMsg = 'Failed to create hackathon';
    try {
      const errData = await res.json();
      if (errData.detail) {
        errMsg = Array.isArray(errData.detail)
          ? errData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
          : String(errData.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg);
  }
  return await res.json();
}

export async function updateHackathon(id: string, data: Partial<HackathonCreate>): Promise<Hackathon> {
  const res = await fetch(`${API_BASE}/api/v1/hackathons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update hackathon');
  return await res.json();
}

export async function deleteHackathon(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/hackathons/${id}`, { method: 'DELETE' });
  return res.ok;
}

export const fetchOpportunities = fetchHackathons;
export const createOpportunity = createHackathon;

// =================== PLACEMENTS ===================
export async function fetchPlacements(search?: string, location?: string, status?: string): Promise<Placement[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location && location !== 'all') params.append('location', location);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${API_BASE}/api/v1/placements?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch placements error:', err);
    return [];
  }
}

export async function createPlacement(data: PlacementCreate): Promise<Placement> {
  const res = await fetch(`${API_BASE}/api/v1/placements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create placement');
  return await res.json();
}

export async function updatePlacement(id: string, data: Partial<PlacementCreate>): Promise<Placement> {
  const res = await fetch(`${API_BASE}/api/v1/placements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update placement');
  return await res.json();
}

export async function deletePlacement(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/placements/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/placements/achievements`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch achievements error:', err);
    return [];
  }
}

export async function createAchievement(data: AchievementCreate): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/api/v1/placements/achievements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to record achievement');
  return await res.json();
}

// =================== PROJECTS ===================
export async function fetchProjects(search?: string, technology?: string, status?: string): Promise<Project[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (technology && technology !== 'all') params.append('technology', technology);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${API_BASE}/api/v1/projects?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch projects error:', err);
    return [];
  }
}

export async function fetchAllProjectsAdmin(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/projects/admin/all`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch admin projects error:', err);
    return [];
  }
}

export async function createProject(data: ProjectCreate): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit project');
  return await res.json();
}

export async function updateProject(id: string, data: Partial<ProjectCreate>): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/projects/${id}`, { method: 'DELETE' });
  return res.ok;
}

// =================== MEMBERS ===================
export async function fetchMembers(search?: string, section?: string, year?: number): Promise<Member[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (section && section !== 'all') params.append('section', section);
    if (year) params.append('year', year.toString());

    const res = await fetch(`${API_BASE}/api/v1/members?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch members error:', err);
    return [];
  }
}

export async function createMember(data: MemberCreate): Promise<Member> {
  const res = await fetch(`${API_BASE}/api/v1/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to add member');
  }
  return await res.json();
}

export async function updateMember(id: string, data: Partial<MemberCreate>): Promise<Member> {
  const res = await fetch(`${API_BASE}/api/v1/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update member');
  return await res.json();
}

export async function deleteMember(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/members/${id}`, { method: 'DELETE' });
  return res.ok;
}

// =================== WHATSAPP ===================
export async function publishWhatsApp(contentType: string, id?: string, customMessage?: string): Promise<WhatsAppPublishResponse> {
  const res = await fetch(`${API_BASE}/api/v1/whatsapp/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: contentType, id, custom_message: customMessage }),
  });
  if (!res.ok) throw new Error('Failed to generate WhatsApp publication');
  return await res.json();
}

// =================== AUTH & PROFILE ===================
export async function checkUserRole(): Promise<{ is_admin: boolean; role: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/role-check`, { cache: 'no-store' });
    if (!res.ok) return { is_admin: false, role: 'student' };
    return await res.json();
  } catch {
    return { is_admin: false, role: 'student' };
  }
}

export async function fetchMyProfile(): Promise<Member | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

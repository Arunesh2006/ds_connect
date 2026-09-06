import {
  Opportunity,
  OpportunityCreate,
  TeamRequest,
  Project,
  ProjectCreate,
  Placement,
  PlacementCreate,
  Achievement,
  AchievementCreate,
  Profile,
  ProfileCreate
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchOpportunities(typeFilter?: string, searchQuery?: string): Promise<Opportunity[]> {
  try {
    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);
    if (searchQuery) params.append('search', searchQuery);

    const url = `${API_BASE}/api/v1/opportunities${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch opportunities error:', err);
    return [];
  }
}

export async function createOpportunity(data: OpportunityCreate): Promise<Opportunity> {
  const res = await fetch(`${API_BASE}/api/v1/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create opportunity`);
  return await res.json();
}

export async function fetchTeamRequests(): Promise<TeamRequest[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/team-requests`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch team requests error:', err);
    return [];
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/projects`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch projects error:', err);
    return [];
  }
}

export async function createProject(data: ProjectCreate): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create project`);
  return await res.json();
}

export async function fetchPlacements(): Promise<Placement[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/placements`, { cache: 'no-store' });
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
  if (!res.ok) throw new Error(`Failed to record placement`);
  return await res.json();
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
  if (!res.ok) throw new Error(`Failed to record achievement`);
  return await res.json();
}

export async function fetchMembers(): Promise<Profile[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/users`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch members error:', err);
    return [];
  }
}

export async function fetchMyProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/users/me`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function createMember(data: ProfileCreate): Promise<Profile> {
  const res = await fetch(`${API_BASE}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to add cohort member');
  }
  return await res.json();
}

export async function deleteMember(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete member');
  return true;
}


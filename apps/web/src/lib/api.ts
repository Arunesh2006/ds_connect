import { Opportunity, OpportunityCreate, TeamRequest } from '@/types/api';

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
  if (!res.ok) throw new Error(`Failed to create opportunity: ${res.statusText}`);
  return await res.json();
}

export async function fetchTeamRequests(opportunityId?: string): Promise<TeamRequest[]> {
  try {
    const params = new URLSearchParams();
    if (opportunityId) params.append('opportunity_id', opportunityId);
    const url = `${API_BASE}/api/v1/team-requests${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch team requests error:', err);
    return [];
  }
}

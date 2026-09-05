import { Opportunity } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchOpportunities(typeFilter?: string, searchQuery?: string): Promise<Opportunity[]> {
  try {
    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);
    if (searchQuery) params.append('search', searchQuery);

    const url = `${API_BASE}/api/v1/opportunities${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch opportunities: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('API fetch error:', err);
    return [];
  }
}

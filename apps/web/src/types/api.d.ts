export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'event' | 'internship' | 'research' | 'workshop';
  status: string;
  organizer: string;
  deadline: string;
  location: string;
  external_link: string | null;
  tags: string[];
  submitted_by: string;
  created_at: string;
  updated_at: string;
}

export interface OpportunityCreate {
  title: string;
  description: string;
  type: string;
  organizer: string;
  deadline: string;
  location: string;
  external_link?: string;
  tags: string[];
}

export interface TeamRequest {
  id: string;
  opportunity_id: string;
  requester_id: string;
  title: string;
  role_needed: string;
  skills_required: string[];
  max_members: number;
  current_members_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

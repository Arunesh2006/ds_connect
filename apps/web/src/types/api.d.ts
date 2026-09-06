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

export interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[];
  repo_url: string | null;
  live_url: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  technologies: string[];
  repo_url?: string;
  live_url?: string;
}

export interface Placement {
  id: string;
  student_id: string;
  company: string;
  role: string;
  package_lpa: number | null;
  placement_year: number;
  is_verified: boolean;
  consent_for_public_display: boolean;
  created_at: string;
}

export interface PlacementCreate {
  company: string;
  role: string;
  package_lpa?: number;
  placement_year: number;
  consent_for_public_display: boolean;
}

export interface Achievement {
  id: string;
  student_id: string;
  category: string;
  title: string;
  description: string | null;
  achievement_date: string;
  certificate_url: string | null;
  created_at: string;
}

export interface AchievementCreate {
  category: string;
  title: string;
  description?: string;
  achievement_date: string;
  certificate_url?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  college_year: number | null;
  role: string;
  bio: string | null;
  skills: string[];
  github_handle: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

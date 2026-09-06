export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  description: string;
  deadline: string;
  location: string;
  external_link: string | null;
  tags: string[];
  type?: string;
  prize_pool: string | null;
  start_date: string | null;
  end_date: string | null;
  mode: string;
  team_size: string;
  status: string;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
}

export type Opportunity = Hackathon;

export interface HackathonCreate {
  title: string;
  organizer: string;
  description: string;
  deadline: string;
  type?: string;
  location?: string;
  external_link?: string;
  tags: string[];
  prize_pool?: string;
  start_date?: string;
  end_date?: string;
  mode?: string;
  team_size?: string;
  status?: string;
}

export interface Placement {
  id: string;
  student_id: string | null;
  company: string;
  role: string;
  package_lpa: number | null;
  placement_year: number;
  eligibility: string | null;
  skills: string[];
  location: string;
  application_deadline: string | null;
  application_link: string | null;
  description: string | null;
  status: string;
  is_verified: boolean;
  consent_for_public_display: boolean;
  created_at: string;
}

export interface PlacementCreate {
  company: string;
  role: string;
  package_lpa?: number;
  placement_year?: number;
  eligibility?: string;
  skills: string[];
  location?: string;
  application_deadline?: string;
  application_link?: string;
  description?: string;
  status?: string;
  consent_for_public_display?: boolean;
}

export interface Achievement {
  id: string;
  student_id: string | null;
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

export interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[];
  repo_url: string | null;
  live_url: string | null;
  owner_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  technologies: string[];
  repo_url?: string;
  live_url?: string;
  status?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'faculty';
  college_year: number | null;
  responsibility: string | null; // Working Section
  bio: string | null;
  skills: string[];
  github_handle: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberCreate {
  name: string;
  email: string;
  role?: string;
  college_year?: number | null;
  responsibility: string; // Working Section
  bio?: string;
  skills?: string[];
  github_handle?: string;
  linkedin_url?: string;
}

export interface WhatsAppPublishResponse {
  success: boolean;
  status: string;
  message: string;
  formatted_text: string;
  share_url: string;
  destination: string | null;
  details?: any;
}

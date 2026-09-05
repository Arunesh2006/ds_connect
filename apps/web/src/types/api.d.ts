export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: "hackathon" | "event" | "internship" | "research" | "workshop";
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

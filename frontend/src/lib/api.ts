import { 
  ProjectCreate, ProjectResponse, ResearchPlan, Finding, ProductionBrief, ActivityEvent 
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== "undefined" ? "" : "http://localhost:8000");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  createProject: (data: ProjectCreate) => 
    fetchApi<ProjectResponse>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    
  getProject: (id: string) => 
    fetchApi<ProjectResponse>(`/api/projects/${id}`),
    
  listProjects: () => 
    fetchApi<ProjectResponse[]>("/api/projects"),
    
  reanalyzeProject: (id: string) => 
    fetchApi<ProjectResponse>(`/api/projects/${id}/reanalyze`, {
      method: "POST",
    }),
    
  generateResearchPlan: (id: string) =>
    fetchApi<ResearchPlan>(`/api/projects/${id}/research/plan`, { method: "POST" }),
    
  getResearchPlan: (id: string) =>
    fetchApi<ResearchPlan>(`/api/projects/${id}/research/plan`),
    
  runResearch: (id: string, question_ids: string[]) =>
    fetchApi<{status: string}>(`/api/projects/${id}/research/run`, {
      method: "POST",
      body: JSON.stringify({ question_ids }),
    }),
    
  getFindings: (id: string) =>
    fetchApi<Finding[]>(`/api/projects/${id}/findings`),
    
  updateFindingStatus: (id: string, finding_id: string, status: string, note?: string) =>
    fetchApi<Finding>(`/api/projects/${id}/findings/${finding_id}/status`, {
      method: "POST",
      body: JSON.stringify({ status, note }),
    }),
    
  generateBrief: (id: string) =>
    fetchApi<ProductionBrief>(`/api/projects/${id}/brief`, { method: "POST" }),
    
  getBrief: (id: string) =>
    fetchApi<ProductionBrief>(`/api/projects/${id}/brief`),
    
  getActivity: (id: string) =>
    fetchApi<ActivityEvent[]>(`/api/projects/${id}/activity`),

  checkHealth: () => 
    fetchApi<{ status: string; ai_mode: string; storage_mode: string }>("/health"),
};

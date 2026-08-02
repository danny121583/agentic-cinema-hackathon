export interface ResearchQuestion {
  question: string;
  reason: string;
}

export interface ScriptBreakdown {
  project_id: string;
  project_title: string;
  short_scene_summary: string;
  setting: string;
  time_period: string;
  time_of_day: string;
  interior_or_exterior: string;
  characters: string[];
  locations: string[];
  props: string[];
  wardrobe_requirements: string[];
  vehicles: string[];
  weather_requirements: string[];
  safety_considerations: string[];
  logistical_considerations: string[];
  continuity_risks: string[];
  unresolved_questions: string[];
  research_questions: ResearchQuestion[];
  generated_timestamp: string;
  model_metadata: string;
  status: string;
}

export interface ProjectCreate {
  title: string;
  scene_text: string;
  notes?: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
  scene_text: string;
  notes?: string;
  status: string;
  workflow_state: string;
  created_at: string;
  updated_at: string;
  breakdown?: ScriptBreakdown;
}

export interface Source {
  title: string;
  url: string;
  publisher?: string;
  publication_date?: string;
  access_date: string;
  excerpt?: string;
}

export interface ResearchQuestionDetail {
  id: string;
  category: string;
  priority: string;
  question: string;
  search_objective: string;
  why_it_matters: string;
  production_decision_affected: string;
  requires_current_web: boolean;
  status: string;
  selected: boolean;
}

export interface ResearchPlan {
  id: string;
  project_id: string;
  questions: ResearchQuestionDetail[];
  status: string;
  generated_timestamp: string;
  model_metadata: string;
}

export interface Finding {
  id: string;
  project_id: string;
  question_id: string;
  claim: string;
  evidence_summary: string;
  supporting_sources: Source[];
  conflicting_sources: Source[];
  confidence_level: string;
  confidence_explanation: string;
  freshness_assessment: string;
  geographic_relevance: string;
  production_relevance: string;
  limitations: string;
  human_review_recommendation: string;
  status: string;
  user_note?: string;
  generated_timestamp: string;
  model_metadata: string;
}

export interface ProductionBrief {
  id: string;
  project_id: string;
  executive_summary: string;
  production_recommendations: string[];
  historical_cultural_guidance: string[];
  location_guidance: string[];
  prop_guidance: string[];
  wardrobe_guidance: string[];
  vehicle_guidance: string[];
  weather_guidance: string[];
  safety_guidance: string[];
  logistics_guidance: string[];
  continuity_guidance: string[];
  open_questions: string[];
  human_review_items: string[];
  source_index: Source[];
  generated_timestamp: string;
  model_metadata: string;
  status: string;
}

export interface ActivityEvent {
  id: string;
  project_id: string;
  agent_name: string;
  action: string;
  status: string;
  started_timestamp: string;
  completed_timestamp?: string;
  duration_ms?: number;
  related_question_id?: string;
  error_message?: string;
}

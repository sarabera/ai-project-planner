export type Industry =
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Hotel"
  | "E-commerce"
  | "AI"
  | "SaaS"
  | "Other";

export type Budget = "Low" | "Medium" | "High";
export type ProjectType = "MVP" | "Startup" | "Enterprise" | "Student Project";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface GeneratePlanRequest {
  project_idea: string;
  industry: Industry;
  budget: Budget;
  project_type: ProjectType;
  experience_level: ExperienceLevel;
}

export interface GeneratePlanResponse {
  plan: string;
}

export interface PlanHistoryItem {
  id: number;
  project_idea: string;
  industry: string;
  budget: string;
  project_type: string;
  experience_level: string;
  generated_plan: string;
  created_at: string;
}

export interface SavePlanRequest extends GeneratePlanRequest {
  generated_plan: string;
}

export interface SavePlanResponse {
  id: number;
  message: string;
}

export const INDUSTRIES: Industry[] = [
  "Healthcare",
  "Finance",
  "Education",
  "Hotel",
  "E-commerce",
  "AI",
  "SaaS",
  "Other",
];

export const BUDGETS: Budget[] = ["Low", "Medium", "High"];
export const PROJECT_TYPES: ProjectType[] = [
  "MVP",
  "Startup",
  "Enterprise",
  "Student Project",
];
export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

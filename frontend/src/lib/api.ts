import type {
  GeneratePlanRequest,
  GeneratePlanResponse,
  PlanHistoryItem,
  SavePlanRequest,
  SavePlanResponse,
} from "@/types/plan";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string | { msg: string }[] };
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail)) {
        detail = body.detail.map((d) => d.msg).join(", ");
      }
    } catch {
      // use default message
    }
    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function generatePlan(
  data: GeneratePlanRequest,
): Promise<GeneratePlanResponse> {
  return request<GeneratePlanResponse>("/api/generate-plan", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHistory(): Promise<PlanHistoryItem[]> {
  return request<PlanHistoryItem[]>("/api/history");
}

export async function getPlanById(id: number): Promise<PlanHistoryItem> {
  return request<PlanHistoryItem>(`/api/history/${id}`);
}

export async function savePlan(data: SavePlanRequest): Promise<SavePlanResponse> {
  return request<SavePlanResponse>("/api/save", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deletePlan(id: number): Promise<void> {
  await request<void>(`/api/history/${id}`, { method: "DELETE" });
}

export { ApiError };

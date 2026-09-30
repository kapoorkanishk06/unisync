import type {
  ApiError,
  AttendanceUpdate,
  DemoSeedResponse,
  HealthResponse,
  IngestResponse,
  JobStatus,
  PanicInput,
  PanicPlan,
  Plan,
  Subject,
  Task,
  TaskInput,
  Triage,
  WeekInsights,
} from "../types/api";

const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

export class ApiErrorClass extends Error {
  code: string;
  details: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.error.message);
    this.name = "ApiError";
    this.code = error.error.code;
    this.details = error.error.details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  etag?: string
): Promise<{ data: T; etag?: string }> {
  const deviceId = getDeviceId();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Device-Id": deviceId,
    ...(options.headers as Record<string, string>),
  };

  if (etag) {
    headers["If-None-Match"] = etag;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 304) {
    throw new Error("NOT_MODIFIED");
  }

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new ApiErrorClass(error);
  }

  const data = await response.json();
  const newEtag = response.headers.get("ETag") || undefined;

  return { data, etag: newEtag };
}

export function getDeviceId(): string {
  let deviceId = localStorage.getItem("unisync-device-id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("unisync-device-id", deviceId);
  }
  return deviceId;
}

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await request<HealthResponse>("/health");
  return data;
}

export async function demoSeed(): Promise<DemoSeedResponse> {
  const { data } = await request<DemoSeedResponse>("/demo/seed", {
    method: "POST",
  });
  return data;
}

export async function ingestFiles(files: File[]): Promise<IngestResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const deviceId = getDeviceId();
  const response = await fetch(`${API_BASE}/ingest`, {
    method: "POST",
    headers: {
      "X-Device-Id": deviceId,
    },
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new ApiErrorClass(error);
  }

  return response.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const { data } = await request<JobStatus>(`/jobs/${jobId}`);
  return data;
}

export function getJobEvents(jobId: string): EventSource {
  const deviceId = getDeviceId();
  return new EventSource(`${API_BASE}/jobs/${jobId}/events?device_id=${deviceId}`);
}

export async function getTasks(params?: {
  status?: string;
  subject_id?: string;
  needs_review?: boolean;
}): Promise<Task[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set("status", params.status);
  if (params?.subject_id) queryParams.set("subject_id", params.subject_id);
  if (params?.needs_review !== undefined)
    queryParams.set("needs_review", String(params.needs_review));

  const { data } = await request<Task[]>(
    `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  );
  return data;
}

export async function createTask(task: TaskInput): Promise<Task> {
  const { data } = await request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return data;
}

export async function updateTask(
  id: string,
  updates: Partial<TaskInput & { status: string; confirmed: boolean }>
): Promise<Task> {
  const { data } = await request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await request(`/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function getSubjects(): Promise<Subject[]> {
  const { data } = await request<Subject[]>("/subjects");
  return data;
}

export async function updateAttendance(
  id: string,
  update: AttendanceUpdate
): Promise<Subject> {
  const { data } = await request<Subject>(`/subjects/${id}/attendance`, {
    method: "PUT",
    body: JSON.stringify(update),
  });
  return data;
}

export async function getTriage(etag?: string): Promise<{ data: Triage; etag?: string }> {
  return request<Triage>("/triage", undefined, etag);
}

export async function getPlan(etag?: string): Promise<{ data: Plan; etag?: string }> {
  return request<Plan>("/plan", undefined, etag);
}

export async function getPanicPlan(input: PanicInput): Promise<PanicPlan> {
  const { data } = await request<PanicPlan>("/panic", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data;
}

export async function getWeekInsights(): Promise<WeekInsights> {
  const { data } = await request<WeekInsights>("/insights/week");
  return data;
}

export async function deleteAllData(): Promise<void> {
  await request("/me", {
    method: "DELETE",
  });
}

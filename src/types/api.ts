export type RiskLevel = "critical" | "high" | "medium" | "low";
export type TaskKind = "assignment" | "quiz" | "lab" | "exam" | "report" | "notice" | "reading" | "other";
export type TaskStatus = "todo" | "in_progress" | "done" | "skipped";

export interface Task {
  id: string;
  title: string;
  subject_id: string;
  subject_name: string;
  kind: TaskKind;
  due_at: string | null;
  due_in_hours: number | null;
  weightage_marks: number | null;
  effort_hours: number;
  effort_source: "stated" | "estimated";
  status: TaskStatus;
  prerequisites: string[];
  blocked_by: { id: string; title: string; status: TaskStatus }[];
  unlocks: { id: string; title: string }[];
  attendance_linked: boolean;
  confidence: number;
  needs_review: boolean;
  source: { file_name: string; page: number | null; excerpt: string | null } | null;
  risk: {
    score: number;
    level: RiskLevel;
    factors: {
      deadline_pressure: number;
      marks_impact: number;
      attendance_impact: number;
      effort_divisor: number;
      unlock_bonus: number;
    };
    explanation: string;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  attended: number | null;
  total: number | null;
  percentage: number | null;
  required_pct: number;
  status: "safe" | "watch" | "danger" | "unknown";
  classes_can_miss: number | null;
  classes_needed_to_recover: number | null;
}

export interface PlanItem {
  task_id: string;
  title: string;
  subject_name: string;
  minutes: number;
  reason: string;
  risk_level: RiskLevel;
}

export interface Triage {
  next_action: { task: Task; minutes: number; why: string } | null;
  queue: Task[];
  stats: {
    total_open: number;
    critical: number;
    high: number;
    due_24h: number;
    attendance_alerts: number;
  };
  generated_at: string;
}

export interface Plan {
  buckets: {
    next_30_min: PlanItem[];
    tonight: PlanItem[];
    tomorrow: PlanItem[];
    this_week: PlanItem[];
  };
  generated_at: string;
}

export interface PanicPlan {
  hours_available: number;
  headline: string;
  plan: {
    order: number;
    task_id: string;
    title: string;
    subject_name: string;
    allocated_minutes: number;
    reason: string;
    risk_reduction: "high" | "medium" | "low";
    risk_points_removed: number;
  }[];
  skip: { task_id: string; title: string; reason: string }[];
  projected: { risk_before: number; risk_after: number };
  generated_by: "engine" | "engine+llm";
}

export interface HealthResponse {
  status: string;
  version: string;
  llm_provider: string;
  demo_mode: boolean;
}

export interface DemoSeedResponse {
  tasks: number;
  subjects: number;
}

export interface IngestResponse {
  job_id: string;
  files: { name: string; size: number; status: string }[];
}

export interface JobStatus {
  job_id: string;
  status: "queued" | "running" | "done" | "failed";
  progress: number;
  tasks_found: number;
  needs_review: number;
  error?: string;
}

export interface TaskInput {
  title: string;
  subject_id: string;
  kind: TaskKind;
  due_at: string | null;
  weightage_marks: number | null;
  effort_hours: number;
}

export interface AttendanceUpdate {
  attended: number;
  total: number;
  required_pct?: number;
}

export interface PanicInput {
  hours_available: number;
}

export interface WeekInsights {
  days: {
    date: string;
    tasks_due: number;
    hours_needed: number;
    peak_risk: RiskLevel;
  }[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
}

// SSE Event Types
export interface SSEStageEvent {
  event: "stage";
  data: {
    file: string;
    stage: "uploaded" | "reading" | "ocr" | "extracting" | "linking" | "scoring";
    message: string;
    progress: number;
  };
}

export interface SSETaskFoundEvent {
  event: "task_found";
  data: { task: Task };
}

export interface SSEAttendanceFoundEvent {
  event: "attendance_found";
  data: { subject: Subject };
}

export interface SSEDoneEvent {
  event: "done";
  data: {
    tasks_found: number;
    needs_review: number;
    subjects_updated: number;
    duration_ms: number;
  };
}

export interface SSEErrorEvent {
  event: "error";
  data: { code: string; message: string; file?: string };
}

export type SSEEvent = SSEStageEvent | SSETaskFoundEvent | SSEAttendanceFoundEvent | SSEDoneEvent | SSEErrorEvent;

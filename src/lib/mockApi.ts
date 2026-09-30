import type {
  AttendanceUpdate,
  DemoSeedResponse,
  HealthResponse,
  IngestResponse,
  JobStatus,
  PanicInput,
  PanicPlan,
  Plan,
  PlanItem,
  Subject,
  Task,
  TaskInput,
  TaskStatus,
  Triage,
  WeekInsights,
} from "../types/api";

// Mock data storage
let mockTasks: Task[] = [];
let mockSubjects: Subject[] = [];
let mockSeeded = false;

// Simple client-side risk formula for mock mode
function calculateRisk(task: Task, allTasks: Task[]): Task {
  const now = new Date();
  const dueAt = task.due_at ? new Date(task.due_at) : null;
  const hoursUntilDue = dueAt ? (dueAt.getTime() - now.getTime()) / (1000 * 60 * 60) : null;
  
  const deadlinePressure = hoursUntilDue !== null && hoursUntilDue > 0
    ? Math.max(1, Math.min(10, 24 / hoursUntilDue))
    : hoursUntilDue !== null && hoursUntilDue <= 0
    ? 10
    : 5;
  
  const marksImpact = task.weightage_marks ? Math.min(6, task.weightage_marks / 5) : 3;
  const attendanceImpact = task.attendance_linked ? 2.5 : 1.0;
  const effortDivisor = Math.max(0.25, task.effort_hours);
  
  // Calculate unlock bonus (tasks this one unblocks)
  const unlockBonus = allTasks
    .filter(t => t.blocked_by.some(b => b.id === task.id))
    .reduce((sum, t) => sum + (t.weightage_marks || 5) / 10, 0);
  
  const score = ((deadlinePressure * marksImpact * attendanceImpact) / effortDivisor + unlockBonus) * 10;
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  let level: "critical" | "high" | "medium" | "low";
  if (normalizedScore >= 70) level = "critical";
  else if (normalizedScore >= 50) level = "high";
  else if (normalizedScore >= 30) level = "medium";
  else level = "low";
  
  return {
    ...task,
    due_in_hours: hoursUntilDue,
    risk: {
      score: Math.round(normalizedScore),
      level,
      factors: {
        deadline_pressure: Math.round(deadlinePressure * 10) / 10,
        marks_impact: Math.round(marksImpact * 10) / 10,
        attendance_impact: attendanceImpact,
        effort_divisor: effortDivisor,
        unlock_bonus: Math.round(unlockBonus * 10) / 10,
      },
      explanation: `${level === 'critical' ? 'Very high' : level === 'high' ? 'High' : level === 'medium' ? 'Moderate' : 'Low'} urgency${task.attendance_linked ? ' with attendance impact' : ''}`,
    },
  };
}

function calculateSubjectStatus(subject: Subject): Subject {
  if (subject.attended === null || subject.total === null) {
    return { ...subject, status: "unknown", percentage: null, classes_can_miss: null, classes_needed_to_recover: null };
  }
  
  const percentage = (subject.attended / subject.total) * 100;
  const required = subject.required_pct;
  
  let status: "safe" | "watch" | "danger" | "unknown";
  if (percentage >= required) status = "safe";
  else if (percentage >= required - 8) status = "watch";
  else status = "danger";
  
  const classesCanMiss = Math.max(0, Math.floor((required * subject.total) / 100 - subject.attended));
  const classesNeeded = percentage < required
    ? Math.max(0, Math.ceil((required * subject.total - 100 * subject.attended) / (100 - required)))
    : 0;
  
  return {
    ...subject,
    percentage: Math.round(percentage * 10) / 10,
    status,
    classes_can_miss: classesCanMiss,
    classes_needed_to_recover: classesNeeded,
  };
}

function seedDemoData() {
  if (mockSeeded) return;
  
  const now = new Date();
  
  // Demo subjects
  mockSubjects = [
    {
      id: "sub-1",
      name: "DBMS",
      code: "CS301",
      attended: 41,
      total: 50,
      percentage: null,
      required_pct: 75,
      status: "unknown",
      classes_can_miss: null,
      classes_needed_to_recover: null,
    },
    {
      id: "sub-2",
      name: "Operating Systems",
      code: "CS302",
      attended: 34,
      total: 50,
      percentage: null,
      required_pct: 75,
      status: "unknown",
      classes_can_miss: null,
      classes_needed_to_recover: null,
    },
    {
      id: "sub-3",
      name: "Data Structures",
      code: "CS303",
      attended: 38,
      total: 50,
      percentage: null,
      required_pct: 75,
      status: "unknown",
      classes_can_miss: null,
      classes_needed_to_recover: null,
    },
    {
      id: "sub-4",
      name: "Computer Networks",
      code: "CS304",
      attended: 45,
      total: 50,
      percentage: null,
      required_pct: 75,
      status: "unknown",
      classes_can_miss: null,
      classes_needed_to_recover: null,
    },
    {
      id: "sub-5",
      name: "Engineering Mathematics III",
      code: "MA301",
      attended: 35,
      total: 49,
      percentage: null,
      required_pct: 75,
      status: "unknown",
      classes_can_miss: null,
      classes_needed_to_recover: null,
    },
  ].map((s) => calculateSubjectStatus(s as Subject));
  
  // Demo tasks
  const baseTasks: Omit<Task, "id" | "risk" | "due_in_hours">[] = [
    {
      title: "Review: ER Diagram Lecture",
      subject_id: "sub-1",
      subject_name: "DBMS",
      kind: "reading",
      due_at: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      weightage_marks: null,
      effort_hours: 0.75,
      effort_source: "estimated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [{ id: "task-2", title: "DBMS Assignment 3: ER → Relational Schema" }],
      attendance_linked: false,
      confidence: 0.9,
      needs_review: false,
      source: { file_name: "dbms_slides.pdf", page: 15, excerpt: "ER Diagram concepts" },
    },
    {
      title: "DBMS Assignment 3: ER → Relational Schema",
      subject_id: "sub-1",
      subject_name: "DBMS",
      kind: "assignment",
      due_at: new Date(now.getTime() + 20 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 2.5,
      effort_source: "stated",
      status: "todo",
      prerequisites: ["ER Diagram Lecture"],
      blocked_by: [{ id: "task-1", title: "Review: ER Diagram Lecture", status: "todo" }],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.95,
      needs_review: false,
      source: { file_name: "assignment_notice.pdf", page: 1, excerpt: "Assignment 3 due" },
    },
    {
      title: "DSA Quiz 2: Stacks & Queues",
      subject_id: "sub-3",
      subject_name: "Data Structures",
      kind: "quiz",
      due_at: new Date(now.getTime() + 22 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 2,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.9,
      needs_review: false,
      source: { file_name: "quiz_schedule.pdf", page: 3, excerpt: "Quiz 2 announced" },
    },
    {
      title: "OS Experiment 4: Scheduling Simulation",
      subject_id: "sub-2",
      subject_name: "Operating Systems",
      kind: "lab",
      due_at: new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 1.5,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [{ id: "task-5", title: "OS Lab Report 4" }],
      attendance_linked: true,
      confidence: 0.85,
      needs_review: false,
      source: { file_name: "lab_manual.pdf", page: 42, excerpt: "Experiment 4" },
    },
    {
      title: "OS Lab Report 4",
      subject_id: "sub-2",
      subject_name: "Operating Systems",
      kind: "report",
      due_at: new Date(now.getTime() + 30 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 15,
      effort_hours: 2,
      effort_source: "stated",
      status: "todo",
      prerequisites: ["OS Experiment 4"],
      blocked_by: [{ id: "task-4", title: "OS Experiment 4: Scheduling Simulation", status: "todo" }],
      unlocks: [],
      attendance_linked: true,
      confidence: 0.9,
      needs_review: false,
      source: { file_name: "lab_manual.pdf", page: 45, excerpt: "Report submission" },
    },
    {
      title: "DSA Assignment: Linked List Programs",
      subject_id: "sub-3",
      subject_name: "Data Structures",
      kind: "assignment",
      due_at: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 3,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.8,
      needs_review: false,
      source: { file_name: "dsa_assign.pdf", page: 1, excerpt: "Linked list programs" },
    },
    {
      title: "Maths III Assignment: Laplace Transforms",
      subject_id: "sub-5",
      subject_name: "Engineering Mathematics III",
      kind: "assignment",
      due_at: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 3,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.85,
      needs_review: false,
      source: { file_name: "maths_assign.pdf", page: 2, excerpt: "Laplace transforms" },
    },
    {
      title: "CN Lab: Socket Programming",
      subject_id: "sub-4",
      subject_name: "Computer Networks",
      kind: "lab",
      due_at: new Date(now.getTime() + 96 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 10,
      effort_hours: 2,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.6,
      needs_review: true,
      source: { file_name: "cn_lab.pdf", page: 28, excerpt: "Socket programming" },
    },
    {
      title: "DBMS Internal Exam Unit 1–2",
      subject_id: "sub-1",
      subject_name: "DBMS",
      kind: "exam",
      due_at: new Date(now.getTime() + 120 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 30,
      effort_hours: 6,
      effort_source: "estimated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.95,
      needs_review: false,
      source: { file_name: "exam_schedule.pdf", page: 5, excerpt: "Internal exam" },
    },
    {
      title: "Read: CN Notes Unit 3",
      subject_id: "sub-4",
      subject_name: "Computer Networks",
      kind: "reading",
      due_at: new Date(now.getTime() + 150 * 60 * 60 * 1000).toISOString(),
      weightage_marks: null,
      effort_hours: 1.5,
      effort_source: "estimated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.9,
      needs_review: false,
      source: { file_name: "cn_notes.pdf", page: 50, excerpt: "Unit 3 notes" },
    },
    {
      title: "Maths III Quiz 1",
      subject_id: "sub-5",
      subject_name: "Engineering Mathematics III",
      kind: "quiz",
      due_at: new Date(now.getTime() + 170 * 60 * 60 * 1000).toISOString(),
      weightage_marks: 5,
      effort_hours: 1,
      effort_source: "stated",
      status: "todo",
      prerequisites: [],
      blocked_by: [],
      unlocks: [],
      attendance_linked: false,
      confidence: 0.9,
      needs_review: false,
      source: { file_name: "quiz_schedule.pdf", page: 7, excerpt: "Maths quiz" },
    },
  ];
  
  mockTasks = baseTasks.map((task, i) => ({
    ...task,
    id: `task-${i + 1}`,
    due_in_hours: task.due_at ? (new Date(task.due_at).getTime() - Date.now()) / (1000 * 60 * 60) : null,
    risk: {
      score: 50,
      level: "medium" as const,
      factors: {
        deadline_pressure: 5,
        marks_impact: 3,
        attendance_impact: 1,
        effort_divisor: task.effort_hours,
        unlock_bonus: 0,
      },
      explanation: "Medium urgency task",
    },
  }));
  
  // Recalculate with all tasks for unlock bonuses
  mockTasks = mockTasks.map(task => calculateRisk(task, mockTasks));
  
  mockSeeded = true;
}

// Mock API functions
export async function mockGetHealth(): Promise<HealthResponse> {
  return {
    status: "ok",
    version: "0.1.0",
    llm_provider: "mock",
    demo_mode: true,
  };
}

export async function mockDemoSeed(): Promise<DemoSeedResponse> {
  seedDemoData();
  return {
    tasks: mockTasks.length,
    subjects: mockSubjects.length,
  };
}

export async function mockIngestFiles(files: File[]): Promise<IngestResponse> {
  return {
    job_id: `job-${Date.now()}`,
    files: files.map(f => ({ name: f.name, size: f.size, status: "uploaded" })),
  };
}

export async function mockGetJobStatus(jobId: string): Promise<JobStatus> {
  return {
    job_id: jobId,
    status: "done",
    progress: 100,
    tasks_found: mockTasks.length,
    needs_review: mockTasks.filter(t => t.needs_review).length,
  };
}

export class MockEventSource {
  private callbacks: Map<string, (data: unknown) => void> = new Map();
  private timeoutId?: number;
  
  constructor(_url: string) {
    // Simulate SSE events
    this.timeoutId = window.setTimeout(() => {
      this.emit("stage", { file: "test.pdf", stage: "uploaded", message: "File uploaded", progress: 10 });
      
      setTimeout(() => this.emit("stage", { file: "test.pdf", stage: "reading", message: "Reading file", progress: 30 }), 500);
      setTimeout(() => this.emit("stage", { file: "test.pdf", stage: "extracting", message: "Extracting tasks", progress: 60 }), 1000);
      setTimeout(() => this.emit("stage", { file: "test.pdf", stage: "linking", message: "Linking dependencies", progress: 80 }), 1500);
      setTimeout(() => this.emit("stage", { file: "test.pdf", stage: "scoring", message: "Calculating risk", progress: 90 }), 2000);
      
      mockTasks.forEach((task, i) => {
        setTimeout(() => this.emit("task_found", { task }), 2500 + i * 200);
      });
      
      setTimeout(() => {
        this.emit("done", { tasks_found: mockTasks.length, needs_review: 1, subjects_updated: 5, duration_ms: 3000 });
      }, 3500);
    }, 100);
  }
  
  private emit(event: string, data: unknown) {
    const callback = this.callbacks.get(event);
    if (callback) callback(data);
  }
  
  addEventListener(event: string, callback: (data: unknown) => void) {
    this.callbacks.set(event, callback);
  }
  
  removeEventListener(event: string) {
    this.callbacks.delete(event);
  }
  
  close() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.callbacks.clear();
  }
}

export function mockGetJobEvents(_jobId: string): EventSource {
  return new MockEventSource("") as unknown as EventSource;
}

export async function mockGetTasks(params?: {
  status?: string;
  subject_id?: string;
  needs_review?: boolean;
}): Promise<Task[]> {
  seedDemoData();
  let tasks = [...mockTasks];
  
  if (params?.status) {
    tasks = tasks.filter(t => t.status === params.status);
  }
  if (params?.subject_id) {
    tasks = tasks.filter(t => t.subject_id === params.subject_id);
  }
  if (params?.needs_review !== undefined) {
    tasks = tasks.filter(t => t.needs_review === params.needs_review);
  }
  
  return tasks;
}

export async function mockCreateTask(task: TaskInput): Promise<Task> {
  seedDemoData();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    subject_name: mockSubjects.find(s => s.id === task.subject_id)?.name || "Unknown",
    status: "todo",
    effort_source: "stated",
    prerequisites: [],
    blocked_by: [],
    unlocks: [],
    attendance_linked: false,
    confidence: 1.0,
    needs_review: false,
    source: null,
    risk: {
      score: 50,
      level: "medium",
      factors: {
        deadline_pressure: 5,
        marks_impact: 3,
        attendance_impact: 1,
        effort_divisor: task.effort_hours,
        unlock_bonus: 0,
      },
      explanation: "Medium urgency task",
    },
    due_in_hours: task.due_at ? (new Date(task.due_at).getTime() - Date.now()) / (1000 * 60 * 60) : null,
  };
  mockTasks.push(newTask);
  return newTask;
}

export async function mockUpdateTask(
  id: string,
  updates: Partial<TaskInput & { status: TaskStatus; confirmed: boolean }>
): Promise<Task> {
  seedDemoData();
  const index = mockTasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Task not found");
  
  mockTasks[index] = { ...mockTasks[index], ...updates };
  mockTasks = mockTasks.map(t => calculateRisk(t, mockTasks));
  return mockTasks[index];
}

export async function mockDeleteTask(id: string): Promise<void> {
  seedDemoData();
  mockTasks = mockTasks.filter(t => t.id !== id);
}

export async function mockGetSubjects(): Promise<Subject[]> {
  seedDemoData();
  return mockSubjects;
}

export async function mockUpdateAttendance(
  id: string,
  update: AttendanceUpdate
): Promise<Subject> {
  seedDemoData();
  const index = mockSubjects.findIndex(s => s.id === id);
  if (index === -1) throw new Error("Subject not found");
  
  mockSubjects[index] = {
    ...mockSubjects[index],
    attended: update.attended,
    total: update.total,
    required_pct: update.required_pct ?? mockSubjects[index].required_pct,
  };
  mockSubjects[index] = calculateSubjectStatus(mockSubjects[index]);
  
  // Recalculate task risks
  mockTasks = mockTasks.map(t => calculateRisk(t, mockTasks));
  
  return mockSubjects[index];
}

export async function mockGetTriage(): Promise<{ data: Triage; etag?: string }> {
  seedDemoData();
  const openTasks = mockTasks.filter(t => t.status === "todo" || t.status === "in_progress");
  const sorted = [...openTasks].sort((a, b) => b.risk.score - a.risk.score);
  
  const nextAction = sorted.length > 0
    ? { task: sorted[0], minutes: Math.round(sorted[0].effort_hours * 60), why: sorted[0].risk.explanation }
    : null;
  
  return {
    data: {
      next_action: nextAction,
      queue: sorted,
      stats: {
        total_open: openTasks.length,
        critical: openTasks.filter(t => t.risk.level === "critical").length,
        high: openTasks.filter(t => t.risk.level === "high").length,
        due_24h: openTasks.filter(t => t.due_in_hours !== null && t.due_in_hours <= 24).length,
        attendance_alerts: mockSubjects.filter(s => s.status === "danger").length,
      },
      generated_at: new Date().toISOString(),
    },
    etag: "mock-etag",
  };
}

export async function mockGetPlan(): Promise<{ data: Plan; etag?: string }> {
  seedDemoData();
  const openTasks = mockTasks.filter(t => t.status === "todo" || t.status === "in_progress");
  const now = new Date();
  
  const planItems: PlanItem[] = openTasks.map(t => ({
    task_id: t.id,
    title: t.title,
    subject_name: t.subject_name,
    minutes: Math.round(t.effort_hours * 60),
    reason: t.risk.explanation,
    risk_level: t.risk.level,
  }));
  
  const next30Min = planItems.filter(t => t.minutes <= 30).slice(0, 3);
  const tonight = planItems.filter(t => t.minutes > 30 && t.minutes <= 180).slice(0, 5);
  const tomorrow = planItems.filter(t => t.minutes > 180 && t.minutes <= 480).slice(0, 5);
  
  return {
    data: {
      buckets: {
        next_30_min: next30Min,
        tonight,
        tomorrow,
        this_week: planItems.slice(0, 10),
      },
      generated_at: now.toISOString(),
    },
    etag: "mock-etag",
  };
}

export async function mockGetPanicPlan(input: PanicInput): Promise<PanicPlan> {
  seedDemoData();
  const openTasks = mockTasks.filter(t => t.status === "todo" || t.status === "in_progress");
  const sorted = [...openTasks].sort((a, b) => b.risk.score - a.risk.score);
  
  const availableMinutes = input.hours_available * 60;
  let allocated = 0;
  const plan: PanicPlan["plan"] = [];
  const skip: PanicPlan["skip"] = [];
  
  for (const task of sorted) {
    const taskMinutes = Math.round(task.effort_hours * 60);
    if (allocated + taskMinutes <= availableMinutes) {
      plan.push({
        order: plan.length + 1,
        task_id: task.id,
        title: task.title,
        subject_name: task.subject_name,
        allocated_minutes: taskMinutes,
        reason: task.risk.explanation,
        risk_reduction: task.risk.level === "critical" ? "high" : task.risk.level === "high" ? "medium" : "low",
        risk_points_removed: Math.round(task.risk.score * 0.3),
      });
      allocated += taskMinutes;
    } else {
      skip.push({
        task_id: task.id,
        title: task.title,
        reason: task.risk.level === "low" ? "Low urgency" : "Not enough time",
      });
    }
  }
  
  const riskBefore = sorted.reduce((sum, t) => sum + t.risk.score, 0) / Math.max(1, sorted.length);
  const riskAfter = plan.length > 0 
    ? (sorted.filter(t => !plan.find(p => p.task_id === t.id)).reduce((sum, t) => sum + t.risk.score, 0)) / Math.max(1, sorted.length - plan.length)
    : riskBefore;
  
  return {
    hours_available: input.hours_available,
    headline: `${input.hours_available} hours. ${plan.length} fires. Here's the order.`,
    plan,
    skip,
    projected: {
      risk_before: Math.round(riskBefore),
      risk_after: Math.round(riskAfter),
    },
    generated_by: "engine",
  };
}

export async function mockGetWeekInsights(): Promise<WeekInsights> {
  seedDemoData();
  const days: WeekInsights["days"] = [];
  const now = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const tasksDue = mockTasks.filter(t => {
      if (!t.due_at) return false;
      const dueDate = new Date(t.due_at);
      return dueDate >= date && dueDate < nextDay;
    });
    
    const hoursNeeded = tasksDue.reduce((sum, t) => sum + t.effort_hours, 0);
    const peakRisk = tasksDue.length > 0
      ? tasksDue.reduce((max, t) => t.risk.score > max ? t.risk.score : max, 0) >= 70
        ? "critical"
        : tasksDue.reduce((max, t) => t.risk.score > max ? t.risk.score : max, 0) >= 50
        ? "high"
        : "medium"
      : "low";
    
    days.push({
      date: date.toISOString(),
      tasks_due: tasksDue.length,
      hours_needed: Math.round(hoursNeeded * 10) / 10,
      peak_risk: peakRisk,
    });
  }
  
  return { days };
}

export async function mockDeleteAllData(): Promise<void> {
  mockTasks = [];
  mockSubjects = [];
  mockSeeded = false;
}

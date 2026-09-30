import type { SSEEvent } from "../types/api";

export interface SSECallbacks {
  onStage?: (data: SSEEvent["data"]) => void;
  onTaskFound?: (data: SSEEvent["data"]) => void;
  onAttendanceFound?: (data: SSEEvent["data"]) => void;
  onDone?: (data: SSEEvent["data"]) => void;
  onError?: (data: SSEEvent["data"]) => void;
}

export function parseSSEEvent(line: string): SSEEvent | null {
  if (line.startsWith("event:")) {
    const eventType = line.slice(6).trim();
    return { event: eventType as SSEEvent["event"], data: {} as any };
  }
  if (line.startsWith("data:")) {
    try {
      const data = JSON.parse(line.slice(5).trim());
      return { event: "task_found" as const, data };
    } catch {
      return null;
    }
  }
  return null;
}

export function useIngestStream(
  jobId: string,
  callbacks: SSECallbacks,
  getEventSource: (jobId: string) => EventSource
): () => void {
  const eventSource = getEventSource(jobId);
  
  eventSource.addEventListener("stage", (e) => {
    const data = JSON.parse(e.data);
    callbacks.onStage?.(data);
  });
  
  eventSource.addEventListener("task_found", (e) => {
    const data = JSON.parse(e.data);
    callbacks.onTaskFound?.(data);
  });
  
  eventSource.addEventListener("attendance_found", (e) => {
    const data = JSON.parse(e.data);
    callbacks.onAttendanceFound?.(data);
  });
  
  eventSource.addEventListener("done", (e) => {
    const data = JSON.parse(e.data);
    callbacks.onDone?.(data);
  });
  
  eventSource.addEventListener("error", () => {
    callbacks.onError?.({ code: "CONNECTION_ERROR", message: "Connection failed" });
  });
  
  return () => {
    eventSource.close();
  };
}

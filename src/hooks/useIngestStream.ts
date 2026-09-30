import { useState, useCallback } from "react";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";
import type { SSEEvent } from "../types/api";

interface IngestStreamState {
  jobId: string | null;
  status: "idle" | "uploading" | "processing" | "done" | "error";
  progress: number;
  tasksFound: number;
  events: SSEEvent[];
  error: string | null;
}

export function useIngestStream() {
  const [state, setState] = useState<IngestStreamState>({
    jobId: null,
    status: "idle",
    progress: 0,
    tasksFound: 0,
    events: [],
    error: null,
  });

  const mode = apiMode();

  const uploadFiles = useCallback(async (files: File[]) => {
    try {
      setState((prev) => ({ ...prev, status: "uploading", events: [], error: null }));
      
      const response = mode === "mock" 
        ? await mockApi.mockIngestFiles(files)
        : await api.ingestFiles(files);
      
      setState((prev) => ({
        ...prev,
        jobId: response.job_id,
        status: "processing",
      }));

      const eventSource = mode === "mock"
        ? mockApi.mockGetJobEvents(response.job_id)
        : api.getJobEvents(response.job_id);

      eventSource.addEventListener("stage", (e) => {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          events: [...prev.events, { event: "stage", data }],
          progress: data.progress,
        }));
      });

      eventSource.addEventListener("task_found", (e) => {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          events: [...prev.events, { event: "task_found", data }],
          tasksFound: prev.tasksFound + 1,
        }));
      });

      eventSource.addEventListener("attendance_found", (e) => {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          events: [...prev.events, { event: "attendance_found", data }],
        }));
      });

      eventSource.addEventListener("done", (e) => {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          events: [...prev.events, { event: "done", data }],
          status: "done",
          progress: 100,
        }));
        eventSource.close();
      });

      eventSource.addEventListener("error", () => {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "Connection error",
        }));
        eventSource.close();
      });

      eventSource.onerror = () => {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: "Connection error",
        }));
        eventSource.close();
      };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      }));
    }
  }, [mode]);

  const reset = useCallback(() => {
    setState({
      jobId: null,
      status: "idle",
      progress: 0,
      tasksFound: 0,
      events: [],
      error: null,
    });
  }, []);

  return { state, uploadFiles, reset };
}

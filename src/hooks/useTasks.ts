import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";
import type { TaskInput, TaskStatus } from "../types/api";

export function useTasks(params?: {
  status?: string;
  subject_id?: string;
  needs_review?: boolean;
}) {
  const mode = apiMode();

  return useQuery({
    queryKey: ["tasks", params],
    queryFn: async () => {
      if (mode === "mock") {
        return mockApi.mockGetTasks(params);
      }
      return api.getTasks(params);
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const mode = apiMode();

  return useMutation({
    mutationFn: async (task: TaskInput) => {
      if (mode === "mock") {
        return mockApi.mockCreateTask(task);
      }
      return api.createTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["triage"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const mode = apiMode();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TaskInput & { status: TaskStatus; confirmed: boolean }> }) => {
      if (mode === "mock") {
        return mockApi.mockUpdateTask(id, updates);
      }
      return api.updateTask(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["triage"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const mode = apiMode();

  return useMutation({
    mutationFn: async (id: string) => {
      if (mode === "mock") {
        return mockApi.mockDeleteTask(id);
      }
      return api.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["triage"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
  });
}

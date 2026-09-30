import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";
import type { AttendanceUpdate } from "../types/api";

export function useSubjects() {
  const mode = apiMode();

  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (mode === "mock") {
        return mockApi.mockGetSubjects();
      }
      return api.getSubjects();
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  const mode = apiMode();

  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: AttendanceUpdate }) => {
      if (mode === "mock") {
        return mockApi.mockUpdateAttendance(id, update);
      }
      return api.updateAttendance(id, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["triage"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";

export function useTriage() {
  const mode = apiMode();

  return useQuery({
    queryKey: ["triage"],
    queryFn: async () => {
      if (mode === "mock") {
        return mockApi.mockGetTriage();
      }
      
      const etag = localStorage.getItem("triage-etag") || undefined;
      try {
        const result = await api.getTriage(etag);
        if (result.etag) {
          localStorage.setItem("triage-etag", result.etag);
        }
        return result;
      } catch (error) {
        if (error instanceof Error && error.message === "NOT_MODIFIED") {
          throw new Error("NOT_MODIFIED");
        }
        throw error;
      }
    },
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

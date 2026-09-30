import { useQuery } from "@tanstack/react-query";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";

export function useWeekInsights() {
  const mode = apiMode();

  return useQuery({
    queryKey: ["insights", "week"],
    queryFn: async () => {
      if (mode === "mock") {
        return mockApi.mockGetWeekInsights();
      }
      return api.getWeekInsights();
    },
    refetchInterval: 5 * 60 * 1000,
  });
}

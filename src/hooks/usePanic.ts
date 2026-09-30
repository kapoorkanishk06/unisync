import { useQuery } from "@tanstack/react-query";
import * as api from "../lib/api";
import * as mockApi from "../lib/mockApi";
import { apiMode } from "./useApiMode";

export function usePanicPlan(hoursAvailable: number, enabled: boolean = true) {
  const mode = apiMode();

  return useQuery({
    queryKey: ["panic", hoursAvailable],
    queryFn: async () => {
      if (mode === "mock") {
        return mockApi.mockGetPanicPlan({ hours_available: hoursAvailable });
      }
      return api.getPanicPlan({ hours_available: hoursAvailable });
    },
    enabled: enabled && hoursAvailable > 0,
    staleTime: 30 * 1000,
  });
}

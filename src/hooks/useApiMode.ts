import { useState, useEffect } from "react";
import * as api from "../lib/api";

type ApiMode = "real" | "mock";

export function useApiMode(): ApiMode {
  const [mode, setMode] = useState<ApiMode>("real");

  useEffect(() => {
    async function checkHealth() {
      try {
        if (import.meta.env.VITE_USE_MOCKS === "true") {
          setMode("mock");
          return;
        }
        
        await api.getHealth();
        setMode("real");
      } catch {
        setMode("mock");
      }
    }

    checkHealth();
  }, []);

  return mode;
}

export const apiMode = () => import.meta.env.VITE_USE_MOCKS === "true" ? "mock" as const : "real" as const;

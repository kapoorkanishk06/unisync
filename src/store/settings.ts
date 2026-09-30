import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  requiredAttendancePct: number;
  setRequiredAttendancePct: (pct: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      requiredAttendancePct: 75,
      setRequiredAttendancePct: (pct) => set({ requiredAttendancePct: pct }),
    }),
    {
      name: "unisync-settings",
    }
  )
);

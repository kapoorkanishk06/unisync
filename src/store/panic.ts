import { create } from "zustand";

interface PanicState {
  hoursAvailable: number;
  currentStep: "input" | "plan" | "focus";
  focusTaskId: string | null;
  focusRemaining: number;
  setHoursAvailable: (hours: number) => void;
  setCurrentStep: (step: "input" | "plan" | "focus") => void;
  setFocusTaskId: (id: string | null) => void;
  setFocusRemaining: (seconds: number) => void;
  reset: () => void;
}

export const usePanicStore = create<PanicState>((set) => ({
  hoursAvailable: 3,
  currentStep: "input",
  focusTaskId: null,
  focusRemaining: 0,
  setHoursAvailable: (hours) => set({ hoursAvailable: hours }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setFocusTaskId: (id) => set({ focusTaskId: id }),
  setFocusRemaining: (seconds) => set({ focusRemaining: seconds }),
  reset: () =>
    set({
      hoursAvailable: 3,
      currentStep: "input",
      focusTaskId: null,
      focusRemaining: 0,
    }),
}));

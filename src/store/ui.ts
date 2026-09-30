import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  theme: "dark" | "light" | "system";
  reducedMotion: boolean;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  selectedTaskId: string | null;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setReducedMotion: (reduced: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      reducedMotion: false,
      sidebarOpen: false,
      commandPaletteOpen: false,
      selectedTaskId: null,
      setTheme: (theme) => set({ theme }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
      toggleTheme: () =>
        set((state) => {
          const current = state.theme === "system" 
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : state.theme;
          return { theme: current === "dark" ? "light" : "dark" };
        }),
    }),
    {
      name: "unisync-ui",
    }
  )
);

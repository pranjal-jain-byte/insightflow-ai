import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId } from "@/components/Brand/ThemeSwitcher";

interface ThemeState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "insightflow",
      setTheme: (theme) => {
        const resolvedTheme = theme === "datahub" ? "insightflow" : theme;
        document.documentElement.setAttribute("data-theme", resolvedTheme);
        document.documentElement.classList.toggle(
          "theme-dark",
          resolvedTheme === "carbon" || resolvedTheme === "ocean"
        );
        set({ theme: resolvedTheme });
      },
    }),
    {
      name: "insightflow-theme",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          const resolvedTheme = state.theme === "datahub" ? "insightflow" : state.theme;
          document.documentElement.setAttribute("data-theme", resolvedTheme);
          document.documentElement.classList.toggle(
            "theme-dark",
            resolvedTheme === "carbon" || resolvedTheme === "ocean"
          );
        }
      },
    }
  )
);

import { useThemeStore } from "@/store/theme";

const THEMES = [
  { id: "insightflow", label: "InsightFlow (Default)", swatch: "#4F46E5" },
  { id: "ocean",       label: "Midnight Navy",        swatch: "#172554" },
  { id: "warm",        label: "Warm Amber",           swatch: "#da7e09" },
  { id: "carbon",      label: "Carbon Dark",          swatch: "#334155" },
] as const;

export type ThemeId = typeof THEMES[number]["id"] | "datahub";

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const activeTheme = theme === "datahub" ? "insightflow" : theme;

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map((t) => (
        <div key={t.id} className="relative group">
          {/* Tooltip */}
          <span className="
            pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5
            px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap
            bg-foreground text-background opacity-0 group-hover:opacity-100
            transition-opacity duration-150 shadow-sm z-20
          ">
            {t.label}
          </span>
          <button
            onClick={() => setTheme(t.id)}
            aria-label={t.label}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
              activeTheme === t.id
                ? "border-foreground scale-110 shadow-sm"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: t.swatch }}
          />
        </div>
      ))}
    </div>
  );
}

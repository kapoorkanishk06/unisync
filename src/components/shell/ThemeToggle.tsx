import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../primitives/Button";
import { useUIStore } from "../../store/ui";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("light", !isDark);
      root.classList.toggle("dark", isDark);
    } else {
      root.classList.toggle("light", theme === "light");
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

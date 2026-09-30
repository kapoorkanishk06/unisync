import { Link, useLocation } from "react-router-dom";
import { Home, Upload, BookOpen, Settings, Command } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DemoPill } from "./DemoPill";
import { useUIStore } from "../../store/ui";
import { cn } from "../../lib/utils";

export function TopBar() {
  const location = useLocation();
  const { setCommandPaletteOpen } = useUIStore();

  const isLanding = location.pathname === "/";

  if (isLanding) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 w-full border-b border-border bg-surface-1/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center">
            <span className="font-display font-bold text-white text-lg">U</span>
          </div>
          <span className="font-display font-bold text-xl">Unisync</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/app"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
              location.pathname === "/app" ? "text-text bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/app/upload"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
              location.pathname === "/app/upload" ? "text-text bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
            )}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Link>
          <Link
            to="/app/subjects"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
              location.pathname === "/app/subjects" ? "text-text bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Subjects
          </Link>
          <Link
            to="/app/settings"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
              location.pathname === "/app/settings" ? "text-text bg-surface-2" : "text-text-dim hover:text-text hover:bg-surface-2"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 text-sm text-text-dim hover:bg-surface-3 transition-colors"
          >
            <Command className="h-4 w-4" />
            <span>⌘K</span>
          </button>
          <DemoPill />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

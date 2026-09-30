import { Link, useLocation } from "react-router-dom";
import { Home, Upload, Flame, BookOpen, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export function TabBar() {
  const location = useLocation();

  const tabs = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/upload", icon: Upload, label: "Upload" },
    { path: "/app/panic", icon: Flame, label: "Panic" },
    { path: "/app/subjects", icon: BookOpen, label: "Subjects" },
    { path: "/app/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-1/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 pt-1.5 pb-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-colors min-w-0 flex-1",
                isActive ? "text-brand-1 bg-brand-1/10" : "text-text-dim hover:bg-surface-2"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { TopBar } from "./TopBar";
import { TabBar } from "./TabBar";
import { CommandPalette } from "./CommandPalette";
import { PanicButton } from "../panic/PanicButton";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children?: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-bg">
      <div className="aurora-bg" />
      <CommandPalette />
      
      {!isLanding && <TopBar />}
      
      <main className={cn("relative z-10", isLanding ? "" : "pt-14 pb-28 md:pb-10")}>
        {children}
      </main>

      {!isLanding && (
        <>
          <TabBar />
          <div className="fixed bottom-[5.75rem] md:bottom-8 right-4 md:right-6 z-30">
            <PanicButton onClick={() => navigate("/app/panic")} />
          </div>
        </>
      )}
    </div>
  );
}

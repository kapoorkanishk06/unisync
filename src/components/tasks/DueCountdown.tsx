import { useEffect, useState } from "react";
import { formatCountdown } from "../../lib/time";
import { cn } from "../../lib/utils";

interface DueCountdownProps {
  dueAt: string | null;
  className?: string;
}

export function DueCountdown({ dueAt, className }: DueCountdownProps) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!dueAt) return;

    const update = () => {
      setCountdown(formatCountdown(dueAt));
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [dueAt]);

  if (!dueAt) return null;

  return (
    <span className={cn("font-mono text-sm tabular-nums", className)}>
      {countdown}
    </span>
  );
}

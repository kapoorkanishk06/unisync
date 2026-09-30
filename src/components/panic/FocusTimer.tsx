import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, X } from "lucide-react";
import { Button } from "../primitives/Button";
import { formatDuration } from "../../lib/time";
import { cn } from "../../lib/utils";

interface FocusTimerProps {
  taskTitle: string;
  totalMinutes: number;
  onComplete: () => void;
  onSkip: () => void;
  onClose: () => void;
  className?: string;
}

export function FocusTimer({ taskTitle, totalMinutes, onComplete, onSkip, onClose, className }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(totalMinutes * 60);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remaining, onComplete]);

  const progress = ((totalMinutes * 60 - remaining) / (totalMinutes * 60)) * 100;
  const circumference = 2 * Math.PI * 120;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center p-6 sm:p-8",
        className
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-surface-2 rounded-lg transition-colors"
      >
        <X className="h-6 w-6 text-text-dim" />
      </button>

      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-2xl mb-2">{taskTitle}</h2>
        <p className="text-text-dim">Focus mode</p>
      </div>

      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="var(--surface-2)"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            stroke="var(--brand-1)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display font-bold text-6xl tabular-nums">
            {formatDuration(remaining)}
          </div>
          <div className="text-text-dim mt-2">remaining</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="lg"
          variant={isRunning ? "secondary" : "default"}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button size="lg" variant="ghost" onClick={onSkip}>
          <SkipForward className="h-5 w-5 mr-2" />
          Skip
        </Button>
      </div>
    </motion.div>
  );
}

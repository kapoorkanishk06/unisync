import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import type { Subject } from "../../types/api";

interface AttendanceRingProps {
  subject: Subject;
  size?: number;
  className?: string;
}

export function AttendanceRing({ subject, size = 80, className }: AttendanceRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = subject.percentage ?? 0;
  const progress = (percentage / 100) * circumference;

  const statusColors: Record<Subject["status"], string> = {
    safe: "var(--risk-low)",
    watch: "var(--risk-medium)",
    danger: "var(--risk-critical)",
    unknown: "var(--text-dim)",
  };

  const color = statusColors[subject.status];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface-2)"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-lg tabular-nums">
          {subject.percentage !== null ? Math.round(subject.percentage) : "-"}
        </span>
        <span className="text-xs text-text-dim">%</span>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { getRiskColor } from "../../lib/risk-colors";
import { cn } from "../../lib/utils";

interface RiskBarProps {
  score: number;
  level: "critical" | "high" | "medium" | "low";
  className?: string;
}

export function RiskBar({ score, level, className }: RiskBarProps) {
  const color = getRiskColor(level);

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

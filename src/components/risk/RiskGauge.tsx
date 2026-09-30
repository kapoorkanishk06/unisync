import { motion } from "framer-motion";
import { getRiskColor, getRiskGlow } from "../../lib/risk-colors";
import { cn } from "../../lib/utils";

interface RiskGaugeProps {
  score: number;
  level: "critical" | "high" | "medium" | "low";
  size?: number;
  className?: string;
}

export function RiskGauge({ score, level, size = 120, className }: RiskGaugeProps) {
  const color = getRiskColor(level);
  const glow = getRiskGlow(level);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface-2)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ filter: `drop-shadow(${glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display font-bold text-3xl tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-text-dim mt-1">RISK</span>
      </div>
    </div>
  );
}

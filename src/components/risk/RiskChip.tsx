import { getRiskLabel } from "../../lib/risk-colors";
import { Badge } from "../primitives/Badge";

interface RiskChipProps {
  level: "critical" | "high" | "medium" | "low";
  score?: number;
  className?: string;
}

export function RiskChip({ level, score, className }: RiskChipProps) {
  const label = getRiskLabel(level);

  const variant = level === "critical" ? "critical" 
    : level === "high" ? "high"
    : level === "medium" ? "medium"
    : "low";

  return (
    <Badge variant={variant} className={className}>
      {label}
      {score !== undefined && <span className="text-text-dim">·{score}</span>}
    </Badge>
  );
}

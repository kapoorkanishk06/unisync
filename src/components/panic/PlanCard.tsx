import { motion } from "framer-motion";
import { Check, ArrowDown } from "lucide-react";
import { RiskChip } from "../risk/RiskChip";
import { formatDuration } from "../../lib/time";
import { cn } from "../../lib/utils";
import type { PanicPlan } from "../../types/api";

interface PlanCardProps {
  item: PanicPlan["plan"][number];
  hasNext: boolean;
  onComplete?: () => void;
  completed?: boolean;
  className?: string;
}

export function PlanCard({ item, hasNext, onComplete, completed = false, className }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.order * 0.1 }}
      className={cn(
        "relative p-4 md:p-5 rounded-xl bg-surface-2 border border-border",
        completed && "opacity-50",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center font-display font-bold text-lg">
          {completed ? <Check className="h-5 w-5 text-brand-1" /> : item.order}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-semibold text-lg", completed && "line-through")}>{item.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-dim">
            <span>{item.subject_name}</span>
            <span>·</span>
            <span>{formatDuration(item.allocated_minutes)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm text-text-dim">{item.reason}</span>
            <RiskChip level={item.risk_reduction === "high" ? "critical" : item.risk_reduction === "medium" ? "high" : "medium"} />
          </div>
        </div>
        {!completed && (
          <button
            onClick={onComplete}
            className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-brand-1 flex items-center justify-center hover:bg-brand-1/10 transition-colors"
          >
            <Check className="h-4 w-4 text-brand-1" />
          </button>
        )}
      </div>

      {hasNext && (
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <ArrowDown className="h-6 w-6 text-text-dim" />
        </div>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { RiskChip } from "../risk/RiskChip";
import { formatDuration } from "../../lib/time";
import { cn } from "../../lib/utils";
import type { PlanItem } from "../../types/api";

interface PlanItemRowProps {
  item: PlanItem;
  onComplete?: (taskId: string) => void;
  className?: string;
}

export function PlanItemRow({ item, onComplete, className }: PlanItemRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer",
        className
      )}
      onClick={() => onComplete?.(item.task_id)}
    >
      <button
        className="flex-shrink-0 w-5 h-5 rounded border border-border flex items-center justify-center hover:border-brand-1 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onComplete?.(item.task_id);
        }}
      >
        <Check className="h-3 w-3 text-brand-1" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-dim">{item.subject_name}</span>
          <span className="text-xs text-text-dim">·</span>
          <span className="text-xs text-text-dim">{item.reason}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-text-dim">
          <Clock className="h-3 w-3" />
          {formatDuration(item.minutes)}
        </div>
        <RiskChip level={item.risk_level} />
      </div>
    </motion.div>
  );
}

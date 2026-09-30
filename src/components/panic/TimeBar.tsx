import { motion } from "framer-motion";
import { getRiskColor } from "../../lib/risk-colors";
import { cn } from "../../lib/utils";
import type { PanicPlan } from "../../types/api";

interface TimeBarProps {
  plan: PanicPlan;
  className?: string;
}

export function TimeBar({ plan, className }: TimeBarProps) {
  const totalMinutes = plan.plan.reduce((sum, item) => sum + item.allocated_minutes, 0);

  return (
    <div className={cn("w-full h-8 rounded-lg overflow-hidden flex", className)}>
      {plan.plan.map((item, index) => {
        const width = (item.allocated_minutes / totalMinutes) * 100;
        const color = getRiskColor(
          item.risk_reduction === "high" ? "critical" : item.risk_reduction === "medium" ? "high" : "medium"
        );

        return (
          <motion.div
            key={item.task_id}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full flex items-center justify-center text-xs font-bold text-bg"
            style={{ backgroundColor: color }}
          >
            {item.order}
          </motion.div>
        );
      })}
    </div>
  );
}

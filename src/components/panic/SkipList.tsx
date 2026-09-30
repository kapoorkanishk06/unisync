import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import type { PanicPlan } from "../../types/api";

interface SkipListProps {
  skip: PanicPlan["skip"];
  className?: string;
}

export function SkipList({ skip, className }: SkipListProps) {
  if (skip.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-text-dim flex items-center gap-2">
        <X className="h-4 w-4" />
        Skip these. Seriously.
      </h3>
      <div className="space-y-1">
        {skip.map((item) => (
          <motion.div
            key={item.task_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-2 rounded text-sm text-text-dim line-through"
          >
            <span className="flex-1 truncate">{item.title}</span>
            <span className="text-xs">({item.reason})</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

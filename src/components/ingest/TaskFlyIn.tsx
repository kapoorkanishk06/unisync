import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { cn } from "../../lib/utils";
import type { Task } from "../../types/api";

interface TaskFlyInProps {
  tasks: Task[];
  className?: string;
}

export function TaskFlyIn({ tasks, className }: TaskFlyInProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-2 border border-border"
          >
            <div className="w-6 h-6 rounded-full bg-brand-1/20 flex items-center justify-center">
              <Check className="h-3 w-3 text-brand-1" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{task.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="text-xs">{task.subject_name}</Badge>
                <span className="text-xs text-text-dim">{task.kind}</span>
              </div>
            </div>
            <Badge variant={task.risk.level === "critical" ? "critical" : task.risk.level === "high" ? "high" : "default"} className="text-xs">
              {task.risk.score}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

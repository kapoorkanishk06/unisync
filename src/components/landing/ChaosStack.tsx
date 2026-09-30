import { motion } from "framer-motion";
import { Card } from "../primitives/Card";
import { cn } from "../../lib/utils";

interface ChaosStackProps {
  className?: string;
}

export function ChaosStack({ className }: ChaosStackProps) {
  const tasks = [
    { title: "DBMS Assignment", due: "due tomorrow", risk: "high" },
    { title: "OS Lab", due: "attendance 68%", risk: "critical" },
    { title: "DSA Quiz", due: "22h", risk: "high" },
  ];

  return (
    <div className={cn("relative h-56", className)}>
      {tasks.map((task, index) => (
        <motion.div
          key={task.title}
          initial={{ x: -100, rotate: -10, opacity: 0 }}
          animate={{ x: 0, rotate: (index - 1) * 4, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          className="absolute top-0 left-0 w-full"
          style={{
            transform: `translateY(${index * 10}px) rotate(${(index - 1) * 4}deg)`,
            zIndex: tasks.length - index,
          }}
        >
          <Card className="p-3 border border-border bg-surface-2/80">
            <div className="font-semibold text-sm">{task.title}</div>
            <div className="text-xs text-text-dim mt-1">{task.due}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

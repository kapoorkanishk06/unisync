import { motion, AnimatePresence } from "framer-motion";
import { Check, X, FileText } from "lucide-react";
import { Card } from "../primitives/Card";
import { Button } from "../primitives/Button";
import { Badge } from "../primitives/Badge";
import { RiskChip } from "../risk/RiskChip";
import { useUpdateTask } from "../../hooks/useTasks";
import { formatDuration } from "../../lib/time";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import type { Task } from "../../types/api";

interface ReviewQueueProps {
  tasks: Task[];
  onTaskReviewed: (taskId: string) => void;
  className?: string;
}

export function ReviewQueue({ tasks, onTaskReviewed, className }: ReviewQueueProps) {
  const updateTask = useUpdateTask();

  const handleConfirm = async (task: Task) => {
    try {
      await updateTask.mutateAsync({ id: task.id, updates: { confirmed: true } });
      toast.success("Task confirmed");
      onTaskReviewed(task.id);
    } catch (error) {
      toast.error("Failed to confirm task");
    }
  };

  const handleReject = async (task: Task) => {
    try {
      await updateTask.mutateAsync({ id: task.id, updates: { confirmed: false } });
      toast.success("Task rejected");
      onTaskReviewed(task.id);
    } catch (error) {
      toast.error("Failed to reject task");
    }
  };

  if (tasks.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h3 className="font-display font-bold text-xl">Review these tasks</h3>
        <p className="text-sm text-text-dim">We found these but need you to confirm they're correct.</p>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-text-dim" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text mb-1">{task.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-xs">{task.subject_name}</Badge>
                      <Badge variant="risk" className="text-xs capitalize">{task.kind}</Badge>
                      <RiskChip level={task.risk.level} />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-dim">
                      {task.due_at && <span>Due: {new Date(task.due_at).toLocaleDateString()}</span>}
                      {task.weightage_marks && <span>{task.weightage_marks} marks</span>}
                      <span>{formatDuration(task.effort_hours * 60)}</span>
                    </div>
                    {task.source && (
                      <div className="mt-2 text-xs text-text-dim">
                        Source: {task.source.file_name}
                        {task.source.page && ` (page ${task.source.page})`}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(task)}
                      className="w-20"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReject(task)}
                      className="w-20 text-risk-critical hover:text-risk-critical"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

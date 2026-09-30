import { motion } from "framer-motion";
import { Clock, BookOpen, FileText, FlaskConical, GraduationCap, Scroll, Bell, CircleDot, Check, X } from "lucide-react";
import { Card } from "../primitives/Card";
import { Badge } from "../primitives/Badge";
import { RiskBar } from "../risk/RiskBar";
import { DueCountdown } from "./DueCountdown";
import { ConsequenceChips } from "./ConsequenceChips";
import { formatDuration } from "../../lib/time";
import { cn } from "../../lib/utils";
import type { Task } from "../../types/api";

interface TaskCardProps {
  task: Task;
  rank?: number;
  onClick?: () => void;
  onDone?: () => void;
  onSkip?: () => void;
  className?: string;
}

const kindIcons: Record<Task["kind"], React.ReactNode> = {
  assignment: <FileText className="h-4 w-4" />,
  quiz: <CircleDot className="h-4 w-4" />,
  lab: <FlaskConical className="h-4 w-4" />,
  exam: <GraduationCap className="h-4 w-4" />,
  report: <Scroll className="h-4 w-4" />,
  notice: <Bell className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  other: <CircleDot className="h-4 w-4" />,
};

export function TaskCard({ task, rank, onClick, onDone, onSkip, className }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, { offset }) => {
        const swipe = offset.x;
        if (swipe < -100 && onDone) {
          onDone();
        } else if (swipe > 100 && onSkip) {
          onSkip();
        }
      }}
      whileDrag={{ scale: 1.02 }}
    >
      <Card className={cn("cursor-pointer hover:border-brand-1/30 transition-colors relative", className)} onClick={onClick}>
        <motion.div
          className="absolute inset-0 bg-risk-low/20 rounded-xl flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          whileDrag={{ opacity: 1 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        >
          <Check className="h-8 w-8 text-risk-low" />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-risk-critical/20 rounded-xl flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          whileDrag={{ opacity: 1 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ clipPath: 'inset(0 0 0 50%)' }}
        >
          <X className="h-8 w-8 text-risk-critical" />
        </motion.div>
        
        <div className="flex items-start gap-3 sm:gap-4 relative z-10">
          {rank !== undefined && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center font-display font-bold text-sm text-text-dim mt-0.5">
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="text-text-dim">{kindIcons[task.kind]}</div>
              <Badge variant="default" className="text-xs">
                {task.subject_name}
              </Badge>
              <Badge variant="risk" className="text-xs capitalize">
                {task.kind}
              </Badge>
            </div>
            <h3 className="font-semibold text-text mb-2 truncate">{task.title}</h3>
            <div className="flex items-center gap-3 text-sm text-text-dim mb-3 flex-wrap">
              {task.due_at && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <DueCountdown dueAt={task.due_at} />
                </div>
              )}
              {task.weightage_marks && (
                <span>{task.weightage_marks} marks</span>
              )}
              <span>{formatDuration(task.effort_hours * 60)}</span>
            </div>
            <RiskBar score={task.risk.score} level={task.risk.level} className="mb-3" />
            <ConsequenceChips
              blockedBy={task.blocked_by}
              unlocks={task.unlocks}
              attendanceLinked={task.attendance_linked}
              needsReview={task.needs_review}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

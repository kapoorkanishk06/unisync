import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, FileText, Lock, Key, Check, X, Trash2, Edit2, Save } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../primitives/Sheet";
import { Button } from "../primitives/Button";
import { Badge } from "../primitives/Badge";
import { RiskGauge } from "../risk/RiskGauge";
import { FormulaStrip } from "../risk/FormulaStrip";
import { DueCountdown } from "./DueCountdown";
import { ConsequenceChips } from "./ConsequenceChips";
import { formatDateTime, formatDuration } from "../../lib/time";
import type { Task } from "../../types/api";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { toast } from "sonner";

interface TaskDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

export function TaskDrawer({ task, open, onClose }: TaskDrawerProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    effort_hours: task?.effort_hours || 0,
    due_at: task?.due_at || null,
    weightage_marks: task?.weightage_marks || null,
  });

  if (!task) return null;

  useEffect(() => {
    if (task) {
      setEditedTask({
        effort_hours: task.effort_hours,
        due_at: task.due_at,
        weightage_marks: task.weightage_marks,
      });
    }
  }, [task]);

  const handleStatusChange = async (status: Task["status"]) => {
    try {
      await updateTask.mutateAsync({ id: task.id, updates: { status } });
      toast.success("Task updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success("Task deleted");
      onClose();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleSaveEdits = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: {
          effort_hours: editedTask.effort_hours,
          due_at: editedTask.due_at,
          weightage_marks: editedTask.weightage_marks,
        },
      });
      toast.success("Task updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleCancelEdits = () => {
    setEditedTask({
      effort_hours: task.effort_hours,
      due_at: task.due_at,
      weightage_marks: task.weightage_marks,
    });
    setIsEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <AnimatePresence>
          {task && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SheetHeader>
                <SheetTitle>{task.title}</SheetTitle>
                <SheetDescription>
                  {task.subject_name} · {task.kind}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Risk Section */}
                <div className="flex items-center gap-6">
                  <RiskGauge score={task.risk.score} level={task.risk.level} size={100} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Risk Score</h4>
                    <p className="text-sm text-text-dim mb-3">{task.risk.explanation}</p>
                    <FormulaStrip factors={task.risk.factors} result={task.risk.score} />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {isEditing ? (
                    <div className="space-y-3 p-3 rounded-lg bg-surface-2">
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-dim w-16">Due:</label>
                        <input
                          type="datetime-local"
                          value={editedTask.due_at ? new Date(editedTask.due_at).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEditedTask({ ...editedTask, due_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                          className="flex-1 px-2 py-1 rounded bg-surface-3 border border-border text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-dim w-16">Marks:</label>
                        <input
                          type="number"
                          value={editedTask.weightage_marks || ''}
                          onChange={(e) => setEditedTask({ ...editedTask, weightage_marks: e.target.value ? parseFloat(e.target.value) : null })}
                          className="flex-1 px-2 py-1 rounded bg-surface-3 border border-border text-sm"
                          step="0.5"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-text-dim w-16">Effort:</label>
                        <input
                          type="number"
                          value={editedTask.effort_hours}
                          onChange={(e) => setEditedTask({ ...editedTask, effort_hours: parseFloat(e.target.value) || 0 })}
                          className="flex-1 px-2 py-1 rounded bg-surface-3 border border-border text-sm"
                          step="0.5"
                          min="0"
                        />
                        <span className="text-xs text-text-dim">hours</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleSaveEdits}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdits}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {task.due_at && (
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-text-dim" />
                          <span className="text-text-dim">Due:</span>
                          <span className="font-mono">{formatDateTime(task.due_at)}</span>
                          <span className="text-text-dim">·</span>
                          <DueCountdown dueAt={task.due_at} />
                        </div>
                      )}
                      {task.weightage_marks && (
                        <div className="flex items-center gap-3 text-sm">
                          <FileText className="h-4 w-4 text-text-dim" />
                          <span className="text-text-dim">Marks:</span>
                          <span>{task.weightage_marks}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-text-dim" />
                        <span className="text-text-dim">Effort:</span>
                        <span>{formatDuration(task.effort_hours * 60)}</span>
                        {task.effort_source === "estimated" && (
                          <Badge variant="default" className="text-xs">Estimated</Badge>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Source */}
                {task.source && (
                  <div className="p-3 rounded-lg bg-surface-2 text-sm">
                    <div className="text-text-dim mb-1">Source</div>
                    <div className="text-text">{task.source.file_name}</div>
                    {task.source.page && <div className="text-text-dim">Page {task.source.page}</div>}
                    {task.source.excerpt && (
                      <div className="text-text-dim italic mt-1">"{task.source.excerpt}"</div>
                    )}
                  </div>
                )}

                {/* Dependencies */}
                {(task.blocked_by.length > 0 || task.unlocks.length > 0) && (
                  <div className="space-y-2">
                    {task.blocked_by.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4 text-text-dim" />
                        <span className="text-text-dim">Blocked by:</span>
                        {task.blocked_by.map((b) => (
                          <Badge key={b.id} variant="default">{b.title}</Badge>
                        ))}
                      </div>
                    )}
                    {task.unlocks.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Key className="h-4 w-4 text-text-dim" />
                        <span className="text-text-dim">Unlocks:</span>
                        {task.unlocks.map((u) => (
                          <Badge key={u.id} variant="brand">{u.title}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Consequences */}
                <ConsequenceChips
                  blockedBy={task.blocked_by}
                  unlocks={task.unlocks}
                  attendanceLinked={task.attendance_linked}
                  needsReview={task.needs_review}
                />

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {task.status === "todo" && (
                    <Button
                      variant="default"
                      onClick={() => handleStatusChange("in_progress")}
                      className="flex-1"
                    >
                      Start
                    </Button>
                  )}
                  {task.status !== "done" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange("done")}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </Button>
                  )}
                  {task.status === "todo" && (
                    <Button
                      variant="ghost"
                      onClick={() => handleStatusChange("skipped")}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Skip
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" onClick={handleDelete} className="text-risk-critical hover:text-risk-critical">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Edit2 } from "lucide-react";
import { Button } from "../primitives/Button";
import { AttendanceRing } from "./AttendanceRing";
import { useUpdateAttendance } from "../../hooks/useSubjects";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import type { Subject } from "../../types/api";

interface AttendanceEditorProps {
  subject: Subject;
  className?: string;
  showName?: boolean;
}

export function AttendanceEditor({ subject, className, showName = true }: AttendanceEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [attended, setAttended] = useState(subject.attended ?? 0);
  const [total, setTotal] = useState(subject.total ?? 0);
  const [required, setRequired] = useState(subject.required_pct);
  const updateAttendance = useUpdateAttendance();

  const handleSave = async () => {
    try {
      await updateAttendance.mutateAsync({
        id: subject.id,
        update: { attended, total, required_pct: required },
      });
      toast.success("Attendance updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const handleCancel = () => {
    setAttended(subject.attended ?? 0);
    setTotal(subject.total ?? 0);
    setRequired(subject.required_pct);
    setIsEditing(false);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <AttendanceRing subject={subject} />
      <div className="flex-1 min-w-0">
        {showName && <div className="font-semibold text-base">{subject.name}</div>}
        <div className={cn("text-sm text-text-dim", showName ? "mb-2" : "mb-2 -mt-0.5")}>
          {subject.code && <span>{subject.code} · </span>}
          {subject.status === "safe" && "Safe zone"}
          {subject.status === "watch" && "Watch zone"}
          {subject.status === "danger" && "Danger zone"}
          {subject.status === "unknown" && "Unknown"}
        </div>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                <label className="text-xs text-text-dim w-20">Attended:</label>
                <input
                  type="number"
                  value={attended}
                  onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-sm"
                />
                <label className="text-xs text-text-dim w-12">Total:</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-text-dim w-20">Required:</label>
                <input
                  type="number"
                  value={required}
                  onChange={(e) => setRequired(parseInt(e.target.value) || 75)}
                  className="w-20 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-sm"
                />
                <span className="text-xs text-text-dim">%</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-text-dim"
            >
              {subject.classes_can_miss !== null && subject.classes_can_miss > 0 && (
                <div className="mb-1">Can miss {subject.classes_can_miss} more classes</div>
              )}
              {subject.classes_needed_to_recover !== null && subject.classes_needed_to_recover > 0 && (
                <div className="mb-2">Attend next {subject.classes_needed_to_recover} to recover</div>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { Lock, Key, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "../primitives/Badge";
import { cn } from "../../lib/utils";

interface ConsequenceChipsProps {
  blockedBy: Array<{ id: string; title: string; status: string }>;
  unlocks: Array<{ id: string; title: string }>;
  attendanceLinked: boolean;
  needsReview: boolean;
  className?: string;
}

export function ConsequenceChips({ blockedBy, unlocks, attendanceLinked, needsReview, className }: ConsequenceChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {blockedBy.length > 0 && (
        <Badge variant="default" className="gap-1.5">
          <Lock className="h-3 w-3" />
          Blocked by {blockedBy.length}
        </Badge>
      )}
      {unlocks.length > 0 && (
        <Badge variant="brand" className="gap-1.5">
          <Key className="h-3 w-3" />
          Unlocks {unlocks.length}
        </Badge>
      )}
      {attendanceLinked && (
        <Badge variant="high" className="gap-1.5">
          <AlertTriangle className="h-3 w-3" />
          Attendance
        </Badge>
      )}
      {needsReview && (
        <Badge variant="medium" className="gap-1.5">
          <AlertCircle className="h-3 w-3" />
          Review
        </Badge>
      )}
    </div>
  );
}

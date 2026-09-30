import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LogEntry {
  file: string;
  stage: string;
  message: string;
  progress: number;
}

interface LiveLogProps {
  entries: LogEntry[];
  className?: string;
}

export function LiveLog({ entries, className }: LiveLogProps) {
  if (entries.length === 0) return null;

  return (
    <div className={cn("font-mono text-xs space-y-1", className)}>
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={`${entry.file}-${entry.stage}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2 text-text-dim"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-text-mute">[{entry.stage}]</span>
            <span>{entry.message}</span>
            <span className="text-text-mute ml-auto">{entry.progress}%</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

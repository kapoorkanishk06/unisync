import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface RiskMeterProps {
  before: number;
  after: number;
  className?: string;
}

export function RiskMeter({ before, after, className }: RiskMeterProps) {
  const beforeColor = before >= 70 ? "var(--risk-critical)" : before >= 50 ? "var(--risk-high)" : "var(--risk-medium)";
  const afterColor = after >= 70 ? "var(--risk-critical)" : after >= 50 ? "var(--risk-high)" : after >= 30 ? "var(--risk-medium)" : "var(--risk-low)";

  return (
    <div className={cn("text-center space-y-4", className)}>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <motion.div
            key={before}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display font-bold text-4xl tabular-nums"
            style={{ color: beforeColor }}
          >
            {before}
          </motion.div>
          <div className="text-xs text-text-dim mt-1">Before</div>
        </div>
        
        <motion.div
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 0.5, repeat: 1 }}
        >
          <TrendingDown className="h-8 w-8 text-brand-1" />
        </motion.div>

        <div className="text-center">
          <motion.div
            key={after}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display font-bold text-4xl tabular-nums"
            style={{ color: afterColor }}
          >
            {after}
          </motion.div>
          <div className="text-xs text-text-dim mt-1">After</div>
        </div>
      </div>
      
      <p className="text-sm text-text-dim">
        {after < before ? "Risk reduced. Good work." : "Risk minimized as much as possible."}
      </p>
    </div>
  );
}

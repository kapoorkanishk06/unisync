import { cn } from "../../lib/utils";

interface FormulaStripProps {
  factors: {
    deadline_pressure: number;
    marks_impact: number;
    attendance_impact: number;
    effort_divisor: number;
    unlock_bonus: number;
  };
  result: number;
  className?: string;
}

export function FormulaStrip({ factors, result, className }: FormulaStripProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs font-mono text-text-dim flex-wrap", className)}>
      <span className="px-2 py-1 rounded bg-surface-2 text-brand-1">{factors.deadline_pressure.toFixed(1)}</span>
      <span>×</span>
      <span className="px-2 py-1 rounded bg-surface-2 text-brand-2">{factors.marks_impact.toFixed(1)}</span>
      <span>×</span>
      <span className="px-2 py-1 rounded bg-surface-2 text-risk-high">{factors.attendance_impact.toFixed(1)}</span>
      <span>÷</span>
      <span className="px-2 py-1 rounded bg-surface-2">{factors.effort_divisor.toFixed(2)}h</span>
      {factors.unlock_bonus > 0 && (
        <>
          <span>+</span>
          <span className="px-2 py-1 rounded bg-surface-2 text-risk-low">{factors.unlock_bonus.toFixed(1)}</span>
        </>
      )}
      <span>=</span>
      <span className="px-2 py-1 rounded bg-surface-2 font-bold text-text">{result}</span>
    </div>
  );
}

import { format } from "date-fns";
import { getRiskColor } from "../../lib/risk-colors";
import { cn } from "../../lib/utils";
import type { WeekInsights } from "../../types/api";

interface WeekHeatStripProps {
  insights: WeekInsights;
  className?: string;
}

export function WeekHeatStrip({ insights, className }: WeekHeatStripProps) {
  const maxHours = Math.max(...insights.days.map((d) => d.hours_needed), 1);

  return (
    <div className={cn("flex gap-1.5", className)}>
      {insights.days.map((day, index) => {
        const date = new Date(day.date);
        const isToday = index === 0;
        const intensity = day.hours_needed / maxHours;
        const color = getRiskColor(day.peak_risk);

        return (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
            title={`${format(date, "EEE MMM d")}: ${day.tasks_due} tasks, ${day.hours_needed}h`}
          >
            <div
              className="w-full rounded-lg transition-all group-hover:scale-105"
              style={{
                height: `${Math.max(20, intensity * 80)}px`,
                backgroundColor: isToday ? color : `${color}40`,
                opacity: isToday ? 1 : 0.6,
              }}
            />
            <div className="text-xs text-text-dim">
              {isToday ? "Today" : format(date, "EEE")}
            </div>
            <div className="text-xs font-mono text-text-dim">
              {day.hours_needed}h
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { motion } from "framer-motion";
import { Slider } from "../primitives/Slider";
import { formatHours } from "../../lib/time";
import { cn } from "../../lib/utils";

interface HoursDialProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const quickPicks = [0.5, 1, 2, 3, 6];

export function HoursDial({ value, onChange, className }: HoursDialProps) {
  const handleTonight = () => {
    const now = new Date();
    const tonight = new Date(now);
    tonight.setHours(1, 0, 0, 0); // 1 AM
    if (tonight < now) {
      tonight.setDate(tonight.getDate() + 1);
    }
    const hours = Math.max(0.5, (tonight.getTime() - now.getTime()) / (1000 * 60 * 60));
    onChange(Math.round(hours * 4) / 4);
  };

  return (
    <div className={cn("space-y-5", className)}>
      <div className="text-center">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display font-bold tabular-nums"
          style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)", lineHeight: 1 }}
        >
          {formatHours(value)}
        </motion.div>
        <div className="text-text-dim mt-2">hours available</div>
      </div>

      <div className="px-4">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={0.5}
          max={12}
          step={0.25}
          className="w-full"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {quickPicks.map((hours) => (
          <button
            key={hours}
            onClick={() => onChange(hours)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              value === hours
                ? "bg-brand-1 text-white"
                : "bg-surface-2 text-text-dim hover:bg-surface-3"
            )}
          >
            {hours}h
          </button>
        ))}
        <button
          onClick={handleTonight}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            "bg-surface-2 text-text-dim hover:bg-surface-3"
          )}
        >
          Tonight
        </button>
      </div>
    </div>
  );
}

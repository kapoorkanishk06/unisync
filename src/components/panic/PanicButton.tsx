import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Button } from "../primitives/Button";
import { cn } from "../../lib/utils";

interface PanicButtonProps {
  onClick: () => void;
  className?: string;
}

export function PanicButton({ onClick, className }: PanicButtonProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Button
        variant="danger"
        size="xl"
        onClick={onClick}
        className={cn(
          "font-display font-bold text-lg tracking-tight shadow-lg shadow-risk-critical/30",
          className
        )}
      >
        <Flame className="h-5 w-5 mr-2" />
        I'M COOKED
      </Button>
    </motion.div>
  );
}

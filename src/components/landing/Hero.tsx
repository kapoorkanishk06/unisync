import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../primitives/Button";
import { ChaosStack } from "./ChaosStack";
import { cn } from "../../lib/utils";

interface HeroProps {
  onUpload: () => void;
  onDemo: () => void;
  className?: string;
}

export function Hero({ onUpload, onDemo, className }: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden flex flex-col items-center px-5 md:px-8 pt-16 pb-12 md:pt-24 md:pb-16", className)}>
      <div className="aurora-bg" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-5xl mx-auto relative z-10 w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-border mb-6"
        >
          <Sparkles className="h-4 w-4 text-brand-1" />
          <span className="text-sm text-text-dim">Academic Triage</span>
        </motion.div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 tracking-tight">
          <span className="text-text">When college dumps everything on you at once,</span>
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">
            know exactly what to do next.
          </span>
        </h1>

        <p className="text-base md:text-lg text-text-dim mb-8 max-w-2xl mx-auto leading-relaxed">
          AI-powered academic triage for overwhelmed engineering students. Upload your chaos, get your survival plan.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <Button size="xl" onClick={onUpload} className="w-full sm:w-auto h-14">
            Upload your chaos
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button size="xl" variant="secondary" onClick={onDemo} className="w-full sm:w-auto h-14">
            Try the demo week
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-text-mute"
        >
          Not another study app. It's damage control.
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 w-full max-w-md mx-auto relative z-10"
      >
        <ChaosStack />
      </motion.div>
    </section>
  );
}

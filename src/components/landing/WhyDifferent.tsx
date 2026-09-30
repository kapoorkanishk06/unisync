import { motion } from "framer-motion";
import { MessageSquare, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../primitives/Card";
import { cn } from "../../lib/utils";

interface WhyDifferentProps {
  className?: string;
}

export function WhyDifferent({ className }: WhyDifferentProps) {
  return (
    <section className={cn("py-16 md:py-20 px-5 md:px-8 bg-surface-1/30", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-10 md:mb-12">Why it's different</h2>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border border-border h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="h-6 w-6 text-text-dim" />
                  <CardTitle className="text-xl">Most student AI</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium text-text">
                  Question → Answer
                </CardDescription>
                <CardDescription className="text-base leading-relaxed mt-2">
                  Helps you learn, but doesn't help you decide what to study first when you have 5 assignments due tomorrow.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-brand-1/30 bg-brand-1/5 h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-brand-1" />
                  <CardTitle className="text-xl text-brand-1">Unisync</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium text-brand-1">
                  Academic chaos → Decision
                </CardDescription>
                <CardDescription className="text-base leading-relaxed mt-2">
                  Analyzes everything at once, calculates risk, and tells you exactly what to do next. Not a study plan—a survival plan.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

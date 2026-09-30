import { motion } from "framer-motion";
import { Upload, Brain, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../primitives/Card";
import { cn } from "../../lib/utils";

interface HowItWorksProps {
  className?: string;
}

export function HowItWorks({ className }: HowItWorksProps) {
  const steps = [
    {
      icon: Upload,
      title: "Upload chaos",
      description: "Drop your PDFs, screenshots, notices, and lab manuals. No setup required.",
    },
    {
      icon: Brain,
      title: "AI extraction",
      description: "We extract deadlines, marks, attendance impact, and effort estimates automatically.",
    },
    {
      icon: Target,
      title: "Get your plan",
      description: "See exactly what to do next, ranked by risk. Panic mode for when you're really cooked.",
    },
  ];

  return (
    <section className={cn("py-16 md:py-20 px-5 md:px-8", className)}>
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-10 md:mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-brand-1/10 flex items-center justify-center mb-3">
                    <step.icon className="h-7 w-7 text-brand-1" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed mt-2">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

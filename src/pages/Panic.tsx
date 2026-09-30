import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "../components/primitives/Button";
import { HoursDial } from "../components/panic/HoursDial";
import { TimeBar } from "../components/panic/TimeBar";
import { PlanCard } from "../components/panic/PlanCard";
import { SkipList } from "../components/panic/SkipList";
import { RiskMeter } from "../components/panic/RiskMeter";
import { FocusTimer } from "../components/panic/FocusTimer";
import { usePanicStore } from "../store/panic";
import { usePanicPlan } from "../hooks/usePanic";
import { formatPanicPlanForShare } from "../lib/share";
import { copyToClipboard } from "../lib/utils";
import { toast } from "sonner";
import { Share2, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/shell/Page";

export function Panic() {
  const navigate = useNavigate();
  const { hoursAvailable, currentStep, setCurrentStep, setFocusTaskId, reset: resetPanic } = usePanicStore();
  const { data: panicPlan } = usePanicPlan(hoursAvailable, currentStep !== "input");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentStep === "input") {
      document.body.classList.add("panic");
    } else {
      document.body.classList.remove("panic");
    }

    return () => {
      document.body.classList.remove("panic");
    };
  }, [currentStep]);

  const handleGivePlan = () => {
    setCurrentStep("plan");
  };

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks((prev: Set<string>) => new Set([...prev, taskId]));
    
    const nextTask = panicPlan?.plan.find((p) => !completedTasks.has(p.task_id) && p.task_id !== taskId);
    if (nextTask) {
      setFocusTaskId(nextTask.task_id);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success("Damage contained!");
      resetPanic();
      navigate("/app");
    }
  };

  const handleStartFocus = (taskId: string) => {
    setFocusTaskId(taskId);
    setCurrentStep("focus");
  };

  const handleShare = async () => {
    if (!panicPlan) return;
    const text = formatPanicPlanForShare(panicPlan);
    await copyToClipboard(text);
    toast.success("Plan copied to clipboard");
  };



  if (currentStep === "focus" && panicPlan) {
    const currentTask = panicPlan.plan.find((p) => p.task_id === usePanicStore.getState().focusTaskId);
    if (!currentTask) {
      setCurrentStep("plan");
      return null;
    }

    return (
      <FocusTimer
        taskTitle={currentTask.title}
        totalMinutes={currentTask.allocated_minutes}
        onComplete={() => handleTaskComplete(currentTask.task_id)}
        onSkip={() => handleTaskComplete(currentTask.task_id)}
        onClose={() => setCurrentStep("plan")}
      />
    );
  }

  return (
    <div>
      <div className={currentStep === "input" ? "aurora-bg panic" : "aurora-bg"} />

      <Page width="default">
        <Button variant="ghost" onClick={() => navigate("/app")} className="mb-6 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {currentStep === "input" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 py-4"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl">
              How many hours do you have?
            </h1>

            <HoursDial value={hoursAvailable} onChange={(v) => usePanicStore.getState().setHoursAvailable(v)} />

            <Button size="xl" onClick={handleGivePlan}>
              Give me the plan
            </Button>
          </motion.div>
        )}

        {currentStep === "plan" && panicPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl md:text-4xl">
                {panicPlan.headline}
              </h1>
            </div>

            <div className="bg-surface-2 rounded-xl p-4 md:p-5">
              <TimeBar plan={panicPlan} />
            </div>

            <div className="space-y-6">
              {panicPlan.plan.map((item, index) => (
                <div key={item.task_id} className="relative">
                  <PlanCard
                    item={item}
                    hasNext={index < panicPlan.plan.length - 1}
                    completed={completedTasks.has(item.task_id)}
                    onComplete={() => handleTaskComplete(item.task_id)}
                  />
                </div>
              ))}
            </div>

            <SkipList skip={panicPlan.skip} />

            <RiskMeter before={panicPlan.projected.risk_before} after={panicPlan.projected.risk_after} />

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {panicPlan.plan.length > 0 && !completedTasks.has(panicPlan.plan[0].task_id) && (
                <Button onClick={() => handleStartFocus(panicPlan.plan[0].task_id)}>
                  Start #{panicPlan.plan[0].order} now
                </Button>
              )}
              <Button variant="secondary" onClick={() => setCurrentStep("input")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Adjust hours
              </Button>
              <Button variant="ghost" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share plan
              </Button>
            </div>
          </motion.div>
        )}
      </Page>
    </div>
  );
}

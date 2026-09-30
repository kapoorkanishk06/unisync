import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Badge } from "../components/primitives/Badge";
import { RiskGauge } from "../components/risk/RiskGauge";
import { FormulaStrip } from "../components/risk/FormulaStrip";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskDrawer } from "../components/tasks/TaskDrawer";
import { PlanTabs } from "../components/plan/PlanTabs";
import { AttendanceEditor } from "../components/attendance/AttendanceEditor";
import { WeekHeatStrip } from "../components/insights/WeekHeatStrip";
import { FocusTimer } from "../components/panic/FocusTimer";
import { useTriage } from "../hooks/useTriage";
import { usePlan } from "../hooks/usePlan";
import { useSubjects } from "../hooks/useSubjects";
import { useWeekInsights } from "../hooks/useInsights";
import { useUpdateTask } from "../hooks/useTasks";
import { formatDuration } from "../lib/time";
import { toast } from "sonner";
import { Page } from "../components/shell/Page";

export function Dashboard() {
  const { data: triage, isLoading: triageLoading } = useTriage();
  const { data: plan } = usePlan();
  const { data: subjects } = useSubjects();
  const { data: insights } = useWeekInsights();
  const updateTask = useUpdateTask();
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [focusTask, setFocusTask] = useState<{ title: string; minutes: number } | null>(null);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({ id: taskId, updates: { status: "done" } });
      toast.success("Task completed");
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const handleStartFocus = (taskTitle: string, minutes: number) => {
    setFocusTask({ title: taskTitle, minutes });
  };

  if (triageLoading) {
    return (
      <Page>
        <div className="grid gap-5">
          <div className="h-64 bg-surface-2 rounded-xl animate-pulse" />
          <div className="h-32 bg-surface-2 rounded-xl animate-pulse" />
          <div className="h-96 bg-surface-2 rounded-xl animate-pulse" />
        </div>
      </Page>
    );
  }

  if (!triage?.data) {
    return (
      <Page className="text-center py-16">
        <h2 className="font-display font-bold text-2xl mb-3">Nothing's on fire. Suspicious.</h2>
        <p className="text-text-dim">Upload something to get started.</p>
      </Page>
    );
  }

  if (focusTask) {
    return (
      <FocusTimer
        taskTitle={focusTask.title}
        totalMinutes={focusTask.minutes}
        onComplete={() => {
          setFocusTask(null);
          toast.success("Focus session complete!");
        }}
        onSkip={() => {
          setFocusTask(null);
        }}
        onClose={() => {
          setFocusTask(null);
        }}
      />
    );
  }

  return (
    <Page className="space-y-6">
      {/* Do this next hero card */}
      {triage.data.next_action && (() => {
        const nextAction = triage.data.next_action;
        return (
          <Card className="border-2 border-brand-1/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <span>Do this next</span>
                <Badge variant="brand">Priority</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
                <RiskGauge score={nextAction.task.risk.score} level={nextAction.task.risk.level} />
                <div className="flex-1 w-full">
                  <h3 className="font-display font-bold text-2xl mb-2">{nextAction.task.title}</h3>
                  <p className="text-text-dim mb-4">{nextAction.task.subject_name}</p>
                  <FormulaStrip factors={nextAction.task.risk.factors} result={nextAction.task.risk.score} />
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <Button onClick={() => handleStartFocus(nextAction.task.title, nextAction.minutes)}>
                      Start ({formatDuration(nextAction.minutes)})
                    </Button>
                    <Button variant="secondary" onClick={() => handleTaskComplete(nextAction.task.id)}>
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4">
          <div className="text-3xl font-display font-bold text-risk-critical leading-none">{triage.data.stats.critical}</div>
          <div className="text-sm text-text-dim mt-2">Critical</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-display font-bold text-risk-high leading-none">{triage.data.stats.due_24h}</div>
          <div className="text-sm text-text-dim mt-2">Due in 24h</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-display font-bold leading-none">{triage.data.stats.total_open}</div>
          <div className="text-sm text-text-dim mt-2">Open tasks</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-display font-bold text-risk-medium leading-none">{triage.data.stats.attendance_alerts}</div>
          <div className="text-sm text-text-dim mt-2">Attendance alerts</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Risk queue */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <h2 className="font-display font-bold text-2xl">Risk Queue</h2>
          <div className="space-y-3">
            {triage.data.queue.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                rank={index + 1}
                onClick={() => setSelectedTask(task.id)}
                onDone={() => handleTaskComplete(task.id)}
                onSkip={() => handleTaskComplete(task.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 min-w-0">
          {/* Plan tabs */}
          {plan && (
            <Card>
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <PlanTabs plan={plan.data} onTaskComplete={handleTaskComplete} />
              </CardContent>
            </Card>
          )}

          {/* Attendance rings */}
          {subjects && subjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => (
                  <AttendanceEditor key={subject.id} subject={subject} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Week heat strip */}
          {insights && (
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <WeekHeatStrip insights={insights} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TaskDrawer
        task={triage.data.queue.find((t: any) => t.id === selectedTask) || null}
        open={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
      />
    </Page>
  );
}

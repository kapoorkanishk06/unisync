import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { DropZone } from "../components/ingest/DropZone";
import { LiveLog } from "../components/ingest/LiveLog";
import { TaskFlyIn } from "../components/ingest/TaskFlyIn";
import { ReviewQueue } from "../components/ingest/ReviewQueue";
import { useIngestStream } from "../hooks/useIngestStream";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { demoSeed } from "../lib/api";
import { mockDemoSeed } from "../lib/mockApi";
import { apiMode } from "../hooks/useApiMode";
import { useTasks } from "../hooks/useTasks";
import { Page } from "../components/shell/Page";

export function Upload() {
  const navigate = useNavigate();
  const { state, uploadFiles, reset } = useIngestStream();
  const { data: tasks } = useTasks({ needs_review: true });
  const [reviewedTaskIds, setReviewedTaskIds] = useState<Set<string>>(new Set());

  const handleFilesDrop = (files: File[]) => {
    uploadFiles(files);
  };

  const handleDemo = async () => {
    try {
      const mode = apiMode();
      if (mode === "mock") {
        await mockDemoSeed();
      } else {
        await demoSeed();
      }
      toast.success("Demo data loaded");
      navigate("/app");
    } catch (error) {
      toast.error("Failed to load demo");
    }
  };

  const handleTaskReviewed = (taskId: string) => {
    setReviewedTaskIds((prev) => new Set([...prev, taskId]));
  };

  const stageEvents = state.events.filter((e) => e.event === "stage");
  const taskEvents = state.events.filter((e) => e.event === "task_found");
  const foundTasks = taskEvents.map((e) => (e as any).data.task);
  const pendingReviewTasks = tasks?.filter((t) => !reviewedTaskIds.has(t.id)) || [];

  return (
    <Page width="default" className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-3xl">Upload your chaos</h1>
        <p className="text-text-dim">PDFs, screenshots, notices, lab manuals</p>
      </div>

      {state.status === "idle" && (
        <>
          <DropZone onFilesDrop={handleFilesDrop} />
          <div className="text-center">
            <Button variant="ghost" onClick={handleDemo}>
              Load demo week instead
            </Button>
          </div>
        </>
      )}

      {(state.status === "uploading" || state.status === "processing") && (
          <Card>
            <CardHeader>
              <CardTitle>Processing...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
            <LiveLog entries={stageEvents.map((e) => (e as any).data)} />

            {foundTasks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tasks found ({foundTasks.length})</h3>
                <TaskFlyIn tasks={foundTasks} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {state.status === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="text-6xl">✨</div>
            <h2 className="font-display font-bold text-2xl">
              {state.tasksFound} tasks · {state.events.filter((e) => e.event === "attendance_found").length} subjects
            </h2>
          </div>

          {pendingReviewTasks.length > 0 && (
            <ReviewQueue
              tasks={pendingReviewTasks}
              onTaskReviewed={handleTaskReviewed}
            />
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/app")}>
              Go to Dashboard
            </Button>
            <Button variant="ghost" onClick={reset}>
              Upload more
            </Button>
          </div>
        </motion.div>
      )}

      {state.status === "error" && (
        <Card className="border-risk-critical">
          <CardContent className="text-center space-y-3">
            <h2 className="font-display font-bold text-xl text-risk-critical">Upload failed</h2>
            <p className="text-text-dim">{state.error}</p>
            <Button onClick={reset}>Try again</Button>
          </CardContent>
        </Card>
      )}
    </Page>
  );
}

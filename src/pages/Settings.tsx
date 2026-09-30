import { Card, CardHeader, CardTitle, CardContent } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { ThemeToggle } from "../components/shell/ThemeToggle";
import { useSettingsStore } from "../store/settings";
import { deleteAllData } from "../lib/api";
import { mockDeleteAllData } from "../lib/mockApi";
import { apiMode } from "../hooks/useApiMode";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Page } from "../components/shell/Page";

export function Settings() {
  const { requiredAttendancePct, setRequiredAttendancePct } = useSettingsStore();

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      return;
    }

    try {
      const mode = apiMode();
      if (mode === "mock") {
        await mockDeleteAllData();
      } else {
        await deleteAllData();
      }
      toast.success("All data deleted");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete data");
    }
  };

  return (
    <Page width="narrow" className="space-y-5">
      <h1 className="font-display font-bold text-3xl">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium">Theme</div>
              <div className="text-sm text-text-dim mt-0.5">Toggle between light and dark mode</div>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium">Required attendance %</div>
              <div className="text-sm text-text-dim mt-0.5">Default attendance requirement</div>
            </div>
            <input
              type="number"
              value={requiredAttendancePct}
              onChange={(e) => setRequiredAttendancePct(parseInt(e.target.value) || 75)}
              className="w-20 px-3 py-2 rounded-lg bg-surface-2 border border-border text-center shrink-0"
              min="50"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-risk-critical">
        <CardHeader>
          <CardTitle className="text-risk-critical flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="font-medium">Reset all my data</div>
              <div className="text-sm text-text-dim mt-0.5 mb-3">
                This will permanently delete all your tasks, subjects, and settings.
              </div>
              <Button variant="danger" onClick={handleResetData}>
                Delete all data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Unisync</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-dim">
          <p>
            <strong>Unisync</strong> — When college dumps everything on you at once, know exactly what to do next.
          </p>
          <p>
            AI-powered academic triage for overwhelmed engineering students.
          </p>
          <p className="pt-3 mt-1 border-t border-border">
            Academic Triage — not another study app.
          </p>
        </CardContent>
      </Card>
    </Page>
  );
}

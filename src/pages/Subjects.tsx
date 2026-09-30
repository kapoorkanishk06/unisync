import { Card, CardHeader, CardTitle, CardContent } from "../components/primitives/Card";
import { AttendanceEditor } from "../components/attendance/AttendanceEditor";
import { useSubjects } from "../hooks/useSubjects";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { Page } from "../components/shell/Page";

export function Subjects() {
  const { data: subjects, isLoading } = useSubjects();
  const { data: tasks } = useTasks();

  if (isLoading) {
    return (
      <Page>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-surface-2 rounded-xl animate-pulse" />
          ))}
        </div>
      </Page>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <Page className="text-center py-16">
        <h2 className="font-display font-bold text-2xl mb-3">No subjects yet</h2>
        <p className="text-text-dim">Upload files to get started</p>
      </Page>
    );
  }

  return (
    <Page className="space-y-5">
      <h1 className="font-display font-bold text-3xl">Subjects</h1>

      <div className="grid md:grid-cols-2 gap-5">
        {subjects.map((subject) => {
          const subjectTasks = tasks?.filter((t) => t.subject_id === subject.id) || [];

          return (
            <Card key={subject.id}>
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AttendanceEditor subject={subject} showName={false} />

                {subjectTasks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-text-dim">Open tasks</h3>
                    {subjectTasks.slice(0, 3).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                      />
                    ))}
                    {subjectTasks.length > 3 && (
                      <div className="text-sm text-text-dim text-center">
                        +{subjectTasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}

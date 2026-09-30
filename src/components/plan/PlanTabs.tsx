import { Tabs, TabsList, TabsTrigger, TabsContent } from "../primitives/Tabs";
import { PlanItemRow } from "./PlanItemRow";
import type { Plan } from "../../types/api";

interface PlanTabsProps {
  plan: Plan;
  onTaskComplete?: (taskId: string) => void;
}

export function PlanTabs({ plan, onTaskComplete }: PlanTabsProps) {
  return (
    <Tabs defaultValue="next_30_min">
      <TabsList>
        <TabsTrigger value="next_30_min">Next 30 min</TabsTrigger>
        <TabsTrigger value="tonight">Tonight</TabsTrigger>
        <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
        <TabsTrigger value="this_week">This week</TabsTrigger>
      </TabsList>
      <TabsContent value="next_30_min">
        {plan.buckets.next_30_min.length === 0 ? (
          <div className="text-center py-8 text-text-dim">Nothing in the next 30 minutes</div>
        ) : (
          <div className="space-y-2">
            {plan.buckets.next_30_min.map((item) => (
              <PlanItemRow key={item.task_id} item={item} onComplete={onTaskComplete} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="tonight">
        {plan.buckets.tonight.length === 0 ? (
          <div className="text-center py-8 text-text-dim">Nothing for tonight</div>
        ) : (
          <div className="space-y-2">
            {plan.buckets.tonight.map((item) => (
              <PlanItemRow key={item.task_id} item={item} onComplete={onTaskComplete} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="tomorrow">
        {plan.buckets.tomorrow.length === 0 ? (
          <div className="text-center py-8 text-text-dim">Nothing for tomorrow</div>
        ) : (
          <div className="space-y-2">
            {plan.buckets.tomorrow.map((item) => (
              <PlanItemRow key={item.task_id} item={item} onComplete={onTaskComplete} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="this_week">
        {plan.buckets.this_week.length === 0 ? (
          <div className="text-center py-8 text-text-dim">Nothing this week</div>
        ) : (
          <div className="space-y-2">
            {plan.buckets.this_week.map((item) => (
              <PlanItemRow key={item.task_id} item={item} onComplete={onTaskComplete} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

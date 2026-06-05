import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generatePlan } from "@/lib/ai.functions";
import { PageShell, CardDisclaimer, SectionCardTitle } from "@/components/page-shell";
import { ResultCard } from "@/components/result-card";
import { useLocalState } from "@/lib/threads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — ONE" },
      {
        name: "description",
        content:
          "Generate prioritized daily or weekly plans with focus and time-blocking tips.",
      },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "day" | "week";

function PlannerPage() {
  const run = useServerFn(generatePlan);
  const [goals, setGoals] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("day");
  const [result, setResult] = useLocalState<string>("apa.plan.last", "");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (!goals.trim()) {
      toast.error("Add tasks or goals to plan around.");
      return;
    }
    setLoading(true);
    try {
      const { plan } = await run({ data: { goals, horizon } });
      setResult(plan);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Focus"
      title="AI Task Planner"
      description="List what's on your plate. Get a prioritized, time-blocked plan in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <SectionCardTitle>Input</SectionCardTitle>
            <div className="space-y-4">
              <Tabs value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="day">Daily</TabsTrigger>
                  <TabsTrigger value="week">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-2">
                <Label htmlFor="goals" className="text-xs text-slate-500">
                  Tasks, goals, and constraints
                </Label>
                <Textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder={
                    horizon === "day"
                      ? "e.g. Ship onboarding email v2, review 3 PRs, 1:1 with Maya at 3pm."
                      : "e.g. Launch beta to 25 customers, finish Q3 forecast, draft hiring plan."
                  }
                  rows={6}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={onRun}
                disabled={loading}
                className="h-auto w-full gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Planning…" : `Generate ${horizon === "day" ? "daily" : "weekly"} plan`}
              </Button>
            </div>
          </Card>
          <CardDisclaimer />
        </div>

        <div>
          <ResultCard
            title="Output Card"
            content={result}
            loading={loading}
            emptyHint="A prioritized, time-blocked plan will appear here."
          />
          <CardDisclaimer />
        </div>
      </div>
    </PageShell>
  );
}

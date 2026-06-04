import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { researchTopic } from "@/lib/ai.functions";
import { PageShell, Disclaimer } from "@/components/page-shell";
import { ResultCard } from "@/components/result-card";
import { useLocalState } from "@/lib/threads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Praxis" },
      {
        name: "description",
        content:
          "Summarize articles, reports, or topics. Get insights, plain-language explanations, and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useLocalState<string>("apa.research.last", "");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (!topic.trim()) {
      toast.error("Paste a topic, article, or report.");
      return;
    }
    setLoading(true);
    try {
      const { brief } = await run({ data: { topic } });
      setResult(brief);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Knowledge"
      title="Research Assistant"
      description="Paste an article, a report, or a topic. Get a TL;DR, key insights, and recommendations."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic, article, or report</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Paste source material or describe the topic…"
                rows={16}
                className="resize-none"
              />
            </div>
            <Button onClick={onRun} disabled={loading} className="h-auto w-full gap-2 rounded-full bg-slate-900 py-3 text-base font-semibold text-white hover:bg-slate-800">
              <Sparkles className="h-4 w-4" />
              {loading ? "Researching…" : "Summarize & analyze"}
            </Button>
          </div>
        </Card>

        <ResultCard
          title="Research brief"
          content={result}
          loading={loading}
          emptyHint="A TL;DR, key insights, and recommendations will appear here."
        />
      </div>
      <Disclaimer />
    </PageShell>
  );
}

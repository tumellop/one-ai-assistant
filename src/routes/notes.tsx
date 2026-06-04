import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { summarizeNotes } from "@/lib/ai.functions";
import { PageShell, Disclaimer } from "@/components/page-shell";
import { ResultCard } from "@/components/result-card";
import { useLocalState } from "@/lib/threads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Praxis" },
      {
        name: "description",
        content:
          "Turn long meeting notes into a crisp summary with decisions and action items.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useLocalState<string>("apa.notes.last", "");
  const [loading, setLoading] = useState(false);

  const onRun = async () => {
    if (!notes.trim()) {
      toast.error("Paste some notes to summarize.");
      return;
    }
    setLoading(true);
    try {
      const { summary } = await run({ data: { notes } });
      setResult(summary);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Meetings"
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. Get a clean summary, decisions, and action items."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Raw notes or transcript</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste notes here…"
                rows={16}
                className="resize-none font-mono text-[13px] leading-relaxed"
              />
            </div>
            <Button onClick={onRun} disabled={loading} className="h-auto w-full gap-2 rounded-full bg-slate-900 py-3 text-base font-semibold text-white hover:bg-slate-800">
              <Sparkles className="h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize notes"}
            </Button>
          </div>
        </Card>

        <ResultCard
          title="Summary"
          content={result}
          loading={loading}
          emptyHint="A structured summary with decisions and action items will appear here."
        />
      </div>
      <Disclaimer />
    </PageShell>
  );
}

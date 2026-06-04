import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { PageShell, Disclaimer } from "@/components/page-shell";
import { ResultCard } from "@/components/result-card";
import { useLocalState } from "@/lib/threads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Praxis" },
      {
        name: "description",
        content:
          "Generate context-aware professional emails with tone and audience controls.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "formal" | "informal" | "persuasive";
type Audience = "client" | "manager" | "team";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [audience, setAudience] = useState<Audience>("client");
  const [result, setResult] = useLocalState<string>("apa.email.last", "");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!context.trim()) {
      toast.error("Tell me what the email should say.");
      return;
    }
    setLoading(true);
    try {
      const { email } = await run({ data: { context, tone, audience } });
      setResult(email);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Communication"
      title="Smart Email Generator"
      description="Describe the situation. Pick a tone and audience. Get a polished draft you can send."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="ctx">What do you want to convey?</Label>
              <Textarea
                id="ctx"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Follow up with Acme on the Q3 proposal. They've been quiet for 10 days; offer a 20-minute call next Tuesday."
                rows={8}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={onGenerate} disabled={loading} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Drafting…" : "Generate email"}
            </Button>
          </div>
        </Card>

        <ResultCard
          title="Draft"
          content={result}
          loading={loading}
          emptyHint="Your generated email will appear here."
        />
      </div>
      <Disclaimer />
    </PageShell>
  );
}

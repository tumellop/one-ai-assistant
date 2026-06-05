import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { PageShell, CardDisclaimer, SectionCardTitle } from "@/components/page-shell";
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
      { title: "Smart Email Generator — ONE" },
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
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
            <SectionCardTitle>Input</SectionCardTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ctx" className="text-xs text-slate-500">
                  What do you want to convey?
                </Label>
                <Textarea
                  id="ctx"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Follow up with Acme on the Q3 proposal."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="informal">Informal</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Audience</Label>
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
              <Button
                onClick={onGenerate}
                disabled={loading}
                className="h-auto w-full gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Drafting…" : "Generate email"}
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
            emptyHint="Your generated email will appear here."
          />
          <CardDisclaimer />
        </div>
      </div>
    </PageShell>
  );
}

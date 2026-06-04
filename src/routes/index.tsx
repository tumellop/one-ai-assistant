import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  ClipboardList,
  CalendarRange,
  BookOpenText,
  MessageSquareText,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Praxis — Your AI workplace copilot" },
      {
        name: "description",
        content:
          "A calm dashboard for professional AI workflows: emails, meeting notes, planning, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tiles = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    blurb:
      "Draft polished emails tuned to tone and audience — client, manager, or team.",
  },
  {
    to: "/notes",
    icon: ClipboardList,
    title: "Meeting Notes Summarizer",
    blurb:
      "Turn long notes into a crisp summary with decisions, action items, and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarRange,
    title: "AI Task Planner",
    blurb:
      "Generate prioritized daily or weekly plans with time-blocking and focus tips.",
  },
  {
    to: "/research",
    icon: BookOpenText,
    title: "Research Assistant",
    blurb:
      "Summarize articles and topics. Extract insights, simplify, and recommend.",
  },
  {
    to: "/chat",
    icon: MessageSquareText,
    title: "Assistant Chat",
    blurb:
      "An always-on workspace copilot for ad-hoc questions and quick iteration.",
  },
] as const;

function Dashboard() {
  return (
    <PageShell
      eyebrow="Workspace"
      title="Good work starts with calm tools."
      description="Five focused AI workflows to handle the busywork of a professional day — without the noise."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full overflow-hidden border-border/70 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <t.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 flex items-center gap-1.5 text-base font-semibold tracking-tight">
                {t.title}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.blurb}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/70 bg-surface p-6 md:p-8">
        <h3 className="font-display text-2xl">How Praxis is designed</h3>
        <div className="mt-4 grid gap-6 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <p className="font-medium text-foreground">Structured prompts</p>
            <p className="mt-1.5 leading-relaxed">
              Every workflow ships with a tuned system prompt so outputs stay
              professional and concrete.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Calm by default</p>
            <p className="mt-1.5 leading-relaxed">
              Warm off-white surfaces, dark charcoal text, and quiet accents
              designed to reduce eye strain.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Yours alone</p>
            <p className="mt-1.5 leading-relaxed">
              Conversations and drafts stay in your browser. No account, no
              cloud sync.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

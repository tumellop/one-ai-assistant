import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import avatarEmail from "@/assets/avatar-email.png";
import avatarNotes from "@/assets/avatar-notes.png";
import avatarPlanner from "@/assets/avatar-planner.png";
import avatarResearch from "@/assets/avatar-research.png";
import avatarChatbot from "@/assets/avatar-chatbot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Automate Your Workday with AI — AI Workplace Productivity Suite" },
      {
        name: "description",
        content:
          "AI native teams save time, get insights, and communicate better. Email, meeting notes, planning, research, and chat — all in one suite.",
      },
    ],
  }),
  component: Landing,
});

type Card = {
  title: string;
  description: string;
  bg: string;
  image: string;
  to: string;
  horizontal?: boolean;
};

const cards: Card[] = [
  {
    title: "Smart Email Generator",
    description:
      "Draft context-aware, polished emails instantly. Set tone and audience (Team, Client).",
    bg: "bg-cyan-100",
    image: avatarEmail,
    to: "/email",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Extract key points, actions, and deadlines from transcripts.",
    bg: "bg-purple-100",
    image: avatarNotes,
    to: "/notes",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize and schedule tasks based on project timeline.",
    bg: "bg-green-100",
    image: avatarPlanner,
    to: "/planner",
  },
  {
    title: "AI Research Assistant",
    description: "Gather insights and generate data summaries on business topics.",
    bg: "bg-rose-100",
    image: avatarResearch,
    to: "/research",
    horizontal: true,
  },
  {
    title: "AI Chatbot Interface",
    description: "Engage directly with your AI Workplace Assistant for instant support.",
    bg: "bg-orange-100",
    image: avatarChatbot,
    to: "/chat",
    horizontal: true,
  },
];

function Highlight({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "strong" | "soft";
}) {
  const bg =
    color === "strong"
      ? "linear-gradient(120deg, #ff5a8a 0%, #ff7aa3 100%)"
      : "linear-gradient(120deg, #ffc1d4 0%, #ffd7e3 100%)";
  return (
    <span className="relative inline-block">
      <span
        aria-hidden
        className="absolute inset-x-[-4px] bottom-[6%] top-[12%] -z-0 rotate-[-1deg] rounded-[6px]"
        style={{
          background: bg,
          filter: "url(#rough)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

function FeatureCard({ card }: { card: Card }) {
  return (
    <Link
      to={card.to}
      className={`group relative block overflow-hidden rounded-3xl ${card.bg} p-6 transition-transform duration-200 hover:-translate-y-1`}
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {/* Notch in top-right */}
      <div className="absolute right-0 top-0 z-10 flex h-14 w-14 items-end justify-start rounded-bl-2xl bg-slate-50">
        <div className="flex h-10 w-10 items-center justify-center">
          <ArrowUpRight className="h-5 w-5 text-slate-900" strokeWidth={2.5} />
        </div>
      </div>

      {card.horizontal ? (
        <div className="flex items-center gap-4">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            width={512}
            height={512}
            className="h-32 w-32 shrink-0 object-contain sm:h-40 sm:w-40"
          />
          <div className="min-w-0 pr-10">
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{card.description}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              AI-generated content may require human review.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex h-36 items-center justify-center">
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              width={512}
              height={512}
              className="h-36 w-auto object-contain"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{card.description}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              AI-generated content may require human review.
            </p>
          </div>
        </>
      )}
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* SVG filter for rough marker edges */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        {/* Hero */}
        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            The AI Workplace Productivity Suite
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            <Highlight color="strong">Automate</Highlight>{" "}
            <span>Your Workday with AI.</span>
          </h1>
          <p
            className="mt-5 text-xl italic text-slate-800 sm:text-2xl"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            AI native teams save time, get insights, and communicate{" "}
            <Highlight color="soft">better.</Highlight>
          </p>
        </header>

        {/* Grid: 3 + 2 on desktop */}
        <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {/* Row 1: 3 cards */}
          <div className="lg:col-span-2">
            <FeatureCard card={cards[0]} />
          </div>
          <div className="lg:col-span-2">
            <FeatureCard card={cards[1]} />
          </div>
          <div className="lg:col-span-2">
            <FeatureCard card={cards[2]} />
          </div>
          {/* Row 2: 2 cards centered (each spans 3 of 6) */}
          <div className="lg:col-span-3">
            <FeatureCard card={cards[3]} />
          </div>
          <div className="lg:col-span-3">
            <FeatureCard card={cards[4]} />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-slate-800">Developed by Tumello Phage</p>
        </footer>
      </div>
    </div>
  );
}

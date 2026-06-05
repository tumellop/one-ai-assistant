import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function PageShell({ eyebrow, title, description, children, actions }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              {eyebrow}
            </p>
          )}
          <h1 className="font-sans text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              {description}
            </p>
          )}
        </div>
        {actions}
      </header>
      {children}
    </div>
  );
}

export function Disclaimer() {
  return null;
}

export function CardDisclaimer({
  text = "AI-generated content may require human review before sending or sharing.",
}: {
  text?: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-100/70 px-4 py-2.5 text-[12px] leading-snug text-slate-600 backdrop-blur-sm">
      {text}
    </div>
  );
}

export function SectionCardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-base font-semibold tracking-tight text-slate-900">
      {children}
    </h2>
  );
}

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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl leading-[1.05] text-foreground md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
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
  return (
    <p className="mt-6 rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">Note:</span> AI-generated content
      may require human review.
    </p>
  );
}

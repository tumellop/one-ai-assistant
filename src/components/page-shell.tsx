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
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
              {eyebrow}
            </p>
          )}
          <h1 className="font-sans text-5xl font-black leading-[1.02] tracking-tight text-slate-900 md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl font-display text-xl italic leading-snug text-slate-600 md:text-2xl">
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
    <p className="mt-8 text-center text-xs text-slate-400">
      AI-generated content may require human review.
    </p>
  );
}

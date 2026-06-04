type Props = { className?: string };

export function BrandMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M9 22V12.5C9 10.567 10.567 9 12.5 9H16.5C18.985 9 21 11.015 21 13.5C21 15.985 18.985 18 16.5 18H13.5"
        stroke="var(--primary-foreground)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="22.5" r="2.25" fill="var(--teal)" />
    </svg>
  );
}

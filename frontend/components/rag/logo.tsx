export function Logo({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
          <path d="M8 7h6" />
          <path d="M8 11h8" />
          <circle cx="15.5" cy="15" r="3" />
          <path d="m18 17.5 2 2" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Lumen
        </span>
        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Doc Intelligence
        </span>
      </div>
    </div>
  )
}

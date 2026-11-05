import { cn } from "@/lib/utils";

/** Spinning tyre — used instead of a generic loading spinner. */
export function Tyre({ className, spinning = true }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-5", spinning && "animate-tyre", className)} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 2.2" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {[0, 72, 144, 216, 288].map((a) => (
        <line key={a} x1="20" y1="20" x2="20" y2="10" stroke="currentColor" strokeWidth="2" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

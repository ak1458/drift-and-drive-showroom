import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Headlights on = dark mode, headlights off = light mode. */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("theme:change"));
  };

  return (
    <button
      onClick={flip}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group flex h-9 items-center gap-2 border border-border px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-highlight",
        className,
      )}
    >
      <svg viewBox="0 0 32 20" className="h-3.5 w-6" aria-hidden>
        <path d="M2 10a8 8 0 0 1 8-8h3v16h-3a8 8 0 0 1-8-8Z" fill="currentColor" />
        <g className={cn("transition-opacity duration-300", dark ? "opacity-100" : "opacity-20")} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="17" y1="5" x2="30" y2="3" />
          <line x1="17" y1="10" x2="30" y2="10" />
          <line x1="17" y1="15" x2="30" y2="17" />
        </g>
      </svg>
      <span className="hidden sm:inline">{dark ? "Lights on" : "Lights off"}</span>
    </button>
  );
}

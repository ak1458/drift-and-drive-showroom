import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

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
    <Button
      variant="ghost"
      size="icon"
      onClick={flip}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "text-muted-foreground",
        className,
      )}
    >
      {dark ? <Sun/> : <Moon/>}
    </Button>
  );
}

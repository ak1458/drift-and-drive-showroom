import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
 return <header className="site-header"><div className="page-width flex h-20 items-center justify-between gap-4"><Link to="/" aria-label="Sky Car Rental home" className="font-display text-3xl leading-none">SKY<span className="text-highlight">/</span></Link><nav aria-label="Main navigation" className="flex items-center gap-6 text-sm"><Link to="/" hash="garage" className="text-muted-foreground hover:text-foreground">Cars</Link><Link to="/" hash="book" className="text-muted-foreground hover:text-foreground">Dates</Link><ThemeToggle/></nav></div></header>;
}

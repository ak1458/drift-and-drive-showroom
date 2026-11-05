import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="page-width flex h-20 items-center justify-between gap-4">
      <Link to="/" aria-label="Sky Car Rental home" className="brand-lockup"><span className="font-display text-4xl leading-none">SKY<span className="text-primary">/</span></span><span className="text-[10px] font-medium uppercase leading-tight">Car<br/>Rental</span></Link>
      <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Main navigation">
        <Link to="/" hash="garage">Our fleet</Link><Link to="/" hash="approach">The Sky way</Link><Link to="/" hash="questions">Good to know</Link>
      </nav>
      <div className="flex items-center gap-3"><ThemeToggle/><Button asChild className="hidden sm:inline-flex"><Link to="/" hash="book">Find your drive <ArrowUpRight/></Link></Button><Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button></div>
    </div>
    {open && <nav className="page-width flex flex-col gap-5 border-t border-border py-6 md:hidden" aria-label="Mobile navigation">{([{hash:"garage",label:"Our fleet"},{hash:"approach",label:"The Sky way"},{hash:"questions",label:"Good to know"},{hash:"book",label:"Find your drive"}]).map(({hash,label})=><Link key={hash} to="/" hash={hash} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
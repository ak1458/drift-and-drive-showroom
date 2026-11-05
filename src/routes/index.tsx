import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jeepFront from "@/assets/jeep-front.png";
import { DrivingCar } from "@/components/DrivingCar";
import { Booking } from "@/components/Booking";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tyre } from "@/components/Tyre";
import { inr, useFleet } from "@/lib/fleet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rubicon Rentals — Drive Lucknow in a Jeep Rubicon" },
      { name: "description", content: "Scroll-to-drive car rental in Lucknow. Pick your dates, choose your 4x4, book in seconds." },
      { property: "og:title", content: "Rubicon Rentals — Drive Lucknow" },
      { property: "og:description", content: "Pick your dates, choose your 4x4, book in seconds. Lucknow only." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const label = "font-mono text-[11px] uppercase tracking-[0.25em]";

const STEPS: [string, string][] = [
  ["Choose", "Pick your dates and vehicle in the booking console. Takes under a minute."],
  ["Delivered", "We bring the car to your door anywhere in Lucknow, fuelled and detailed."],
  ["Drive", "Keys in hand. Return it at your door when the trip ends."],
];

const FAQ: [string, string][] = [
  ["What documents do I need?", "A valid driving licence and a government photo ID (Aadhaar or passport)."],
  ["Is there a security deposit?", "Yes, a refundable deposit is collected at delivery and returned after the car is checked in."],
  ["Can I take the car outside Lucknow?", "Bookings start and end in Lucknow. Tell us about outstation plans when you book."],
  ["What about fuel?", "Cars are delivered with a full tank. Return it full, or we'll refuel at cost."],
];

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const { fleet } = useFleet();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-car", { y: 80, scale: 0.85, opacity: 0, duration: 1.4, ease: "power3.out" });
      gsap.from(".hero-word", { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.08, ease: "power3.out" });

      gsap.to(".hero-car", {
        scale: 2.1,
        y: "18vh",
        filter: "blur(6px)",
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero-fade", {
        letterSpacing: "0.2em",
        opacity: 0,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      // speedometer line fills as you read the steps
      gsap.fromTo(".rev-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#process", start: "top 70%", end: "bottom 60%", scrub: true } });

      gsap.to(".road", { backgroundPositionY: "1200px", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  // reveal cards that mount after fleet loads
  useEffect(() => {
    const t = gsap.fromTo(".fleet-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#garage", start: "top 75%" } });
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, [fleet.length]);

  return (
    <div ref={root} className="grain relative overflow-x-clip">
      <div className="road road-grid pointer-events-none fixed inset-0" aria-hidden />
      <DrivingCar />

      <header className="fixed inset-x-0 top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-gradient-to-b from-background/90 to-transparent px-5 py-4 md:px-10 md:py-5">
        <Link to="/" className="truncate font-display text-xl font-black uppercase tracking-wide">
          Rubicon<span className="text-primary">/</span>LKO
        </Link>
        <nav className="flex shrink-0 items-center gap-4 md:gap-6">
          <a href="#garage" className={`${label} hidden text-muted-foreground hover:text-primary sm:inline`}>Fleet</a>
          <a href="#faq" className={`${label} hidden text-muted-foreground hover:text-primary sm:inline`}>FAQ</a>
          <ThemeToggle />
          <a href="#book" className={`${label} flex h-9 items-center bg-primary px-3 text-primary-foreground`}>Book</a>
        </nav>
      </header>

      <main className="relative z-10">
        <div id="journey">
          {/* HERO */}
          <section id="hero" className="relative flex h-svh flex-col items-center justify-center overflow-hidden">
            <h1 className="hero-fade pointer-events-none absolute inset-x-0 top-[18svh] select-none text-center font-display font-black uppercase leading-[0.8] md:top-[14svh]">
              <span className="hero-word block text-[25vw] text-outline md:text-[17vw]">Rubicon</span>
            </h1>
            <img
              src={jeepFront}
              alt="Jeep Wrangler Rubicon, front view"
              width={1024}
              height={1024}
              fetchPriority="high"
              className="hero-car relative z-10 mt-[6svh] w-[min(86vw,560px)] md:mt-[10svh]"
            />
            <div className={`${label} hero-fade absolute inset-x-0 bottom-6 flex items-end justify-between px-5 text-muted-foreground md:bottom-8 md:px-10`}>
              <span className="hero-word">Lucknow only<br />From ₹4,500/day</span>
              <span className="hero-word flex flex-col items-center gap-2">
                Scroll
                <span className="h-10 w-px animate-pulse bg-primary" />
              </span>
              <span className="hero-word text-right">4×4 · Delivered<br />to your door</span>
            </div>
          </section>

          {/* 01 — car swings left; copy right (bottom on phones) */}
          <section className="flex h-svh items-end justify-end px-5 pb-[10svh] md:items-center md:px-16 md:pb-0">
            <div className="reveal max-w-md">
              <p className={`${label} text-primary`}>01 — Arrival</p>
              <h2 className="mt-4 font-display text-[15vw] font-black uppercase leading-[0.85] md:text-8xl">
                It doesn't park.<br />It arrives.
              </h2>
              <p className="mt-5 text-muted-foreground">Delivered to your door anywhere in Lucknow — Gomti Nagar to Hazratganj — fuelled, detailed, ready.</p>
            </div>
          </section>

          {/* 02 — car swings right; copy left */}
          <section className="flex h-svh items-end px-5 pb-[8svh] md:items-center md:px-16 md:pb-0">
            <div className="reveal w-full max-w-lg">
              <p className={`${label} text-primary`}>02 — Machine</p>
              <h2 className="mt-4 font-display text-[15vw] font-black uppercase leading-[0.85] md:text-8xl">Built for<br />every road.</h2>
              <dl className="mt-6 grid grid-cols-2 gap-px border border-border bg-border font-mono md:mt-8">
                {[
                  ["Engine", "2.0L Turbo"],
                  ["Drive", "4×4 Rock-Trac"],
                  ["Gearbox", "8-speed auto"],
                  ["Seats", "5 adults"],
                ].map(([k, v]) => (
                  <div key={k as string} className="bg-background p-3 md:p-4">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:text-[11px]">{k}</dt>
                    <dd className="mt-1 text-base md:text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        {/* 03 — BOOKING: car parks left (top on phones) */}
        <section id="book" className="flex min-h-svh scroll-mt-0 items-start justify-center px-5 pb-16 pt-[40svh] md:items-center md:justify-end md:px-16 md:pt-24">
          <div className="w-full max-w-md">
            <p className={`${label} mb-4 text-primary`}>03 — Your drive</p>
            <Booking />
          </div>
        </section>

        {/* 04 — GARAGE */}
        <section id="garage" className="px-5 py-24 md:px-16 md:py-32">
          <div className="reveal flex items-end justify-between gap-6">
            <div className="min-w-0">
              <p className={`${label} text-primary`}>04 — The garage</p>
              <h2 className="mt-4 font-display text-[14vw] font-black uppercase leading-[0.85] md:text-8xl">Pick your<br />machine.</h2>
            </div>
            <Link to="/fleet" className={`${label} hidden shrink-0 text-muted-foreground hover:text-primary md:inline`}>Manage fleet →</Link>
          </div>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:bg-border md:px-0 md:pb-0 lg:grid-cols-5">
            {fleet.map((v, idx) => (
              <a
                key={v.id}
                href="#book"
                className="fleet-card group relative flex w-[72vw] shrink-0 snap-start flex-col justify-between border border-border bg-background p-5 transition-colors hover:bg-secondary md:w-auto md:border-0"
              >
                <span className="font-mono text-xs text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                <div className="mt-16">
                  <p className="font-display text-3xl font-extrabold uppercase leading-none">{v.name}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">{v.type} · {v.seats} seats</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-sm text-primary">{inr(v.pricePerDay)}<span className="text-muted-foreground">/day</span></span>
                    <Tyre spinning={false} className="text-muted-foreground transition-transform duration-700 group-hover:rotate-[360deg] group-hover:text-primary" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 05 — PROCESS */}
        <section id="process" className="px-5 py-24 md:px-16 md:py-32">
          <p className={`${label} reveal text-primary`}>05 — How it works</p>
          <div className="relative mt-10">
            <div className="rev-line absolute left-0 top-0 h-px w-full origin-left bg-primary" />
            <div className="grid gap-10 pt-8 md:grid-cols-3 md:gap-8">
              {STEPS.map(([t, d], idx) => (
                <div key={t} className="reveal">
                  <span className="font-mono text-xs text-muted-foreground">Gear {idx + 1}</span>
                  <h3 className="mt-2 font-display text-5xl font-black uppercase">{t}</h3>
                  <p className="mt-3 max-w-xs text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — FAQ */}
        <section id="faq" className="grid gap-10 px-5 py-24 md:grid-cols-[1fr_1.4fr] md:px-16 md:py-32">
          <div className="reveal">
            <p className={`${label} text-primary`}>06 — Before you drive</p>
            <h2 className="mt-4 font-display text-[14vw] font-black uppercase leading-[0.85] md:text-7xl">Questions.</h2>
          </div>
          <Accordion type="single" collapsible className="reveal border-t border-border">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="py-5 text-left text-base hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="px-5 py-24 text-center md:py-36">
          <h2 className="reveal font-display text-[18vw] font-black uppercase leading-[0.8] md:text-[11vw]">
            Engine's<br /><span className="text-primary">running.</span>
          </h2>
          <a href="#book" className={`${label} group mx-auto mt-10 inline-flex h-14 items-center gap-3 bg-primary px-8 text-primary-foreground hover:glow`}>
            <Tyre spinning={false} className="transition-transform duration-500 group-hover:rotate-[360deg]" /> Book the drive
          </a>
        </section>

        <footer className={`${label} flex flex-col justify-between gap-2 border-t border-border px-5 py-6 text-muted-foreground md:flex-row md:px-10`}>
          <span>Rubicon/LKO — Lucknow, Uttar Pradesh</span>
          <span>Drive easy.</span>
        </footer>
      </main>
    </div>
  );
}

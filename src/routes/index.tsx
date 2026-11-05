import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jeepFront from "@/assets/jeep-front.png";
import { DrivingCar } from "@/components/DrivingCar";
import { Booking } from "@/components/Booking";

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

function Index() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Intro: headlights on, car rolls in
      gsap.from(".hero-car", { y: 80, scale: 0.85, opacity: 0, duration: 1.4, ease: "power3.out" });
      gsap.from(".hero-word", { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.08, ease: "power3.out" });

      // Front car drives "through" the camera as you start scrolling
      gsap.to(".hero-car", {
        scale: 2.1,
        y: "18vh",
        filter: "blur(6px)",
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero-word", {
        letterSpacing: "0.2em",
        opacity: 0,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });

      // Road markings slide by — sense of speed
      gsap.to(".road", { backgroundPositionY: "1200px", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="grain relative overflow-x-clip">
      <div className="road road-grid pointer-events-none fixed inset-0 -z-0" aria-hidden />
      <DrivingCar />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="font-display text-xl font-black uppercase tracking-wide">
          Rubicon<span className="text-primary">/</span>LKO
        </Link>
        <nav className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#book" className="hover:text-primary">Book</a>
          <Link to="/fleet" className="hover:text-primary">Fleet</Link>
        </nav>
      </header>

      <main className="relative z-10">
        <div id="journey">
          {/* HERO */}
          <section id="hero" className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
            <h1 className="pointer-events-none absolute inset-x-0 top-[16vh] select-none text-center font-display font-black uppercase leading-[0.8]">
              <span className="hero-word block text-[22vw] text-outline md:text-[17vw]">Rubicon</span>
            </h1>
            <img
              src={jeepFront}
              alt="Jeep Wrangler Rubicon, front view"
              width={1024}
              height={1024}
              className="hero-car relative z-10 mt-[10vh] w-[min(78vw,560px)] drop-shadow-2xl"
            />
            <div className="absolute inset-x-0 bottom-8 flex items-end justify-between px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:px-10">
              <span className="hero-word">Lucknow only<br />From ₹4,500/day</span>
              <span className="hero-word flex flex-col items-center gap-2">
                Scroll to drive
                <span className="h-10 w-px animate-pulse bg-primary" />
              </span>
              <span className="hero-word text-right">4×4 · Rock-Trac<br />Doorstep delivery</span>
            </div>
          </section>

          {/* DRIFT — car swings left, copy on right */}
          <section className="flex h-screen items-center justify-end px-6 md:px-16">
            <div className="reveal max-w-md">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">01 — Arrival</p>
              <h2 className="mt-4 font-display text-6xl font-black uppercase leading-[0.85] md:text-8xl">
                It doesn't park.<br />It arrives.
              </h2>
              <p className="mt-6 text-muted-foreground">
                Delivered to your door anywhere in Lucknow — Gomti Nagar to Hazratganj — fuelled, cleaned, ready.
              </p>
            </div>
          </section>

          {/* SPECS — car swings right, copy on left */}
          <section className="flex h-screen items-center px-6 md:px-16">
            <div className="reveal max-w-lg">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">02 — Machine</p>
              <h2 className="mt-4 font-display text-6xl font-black uppercase leading-[0.85] md:text-8xl">Built for<br />every road.</h2>
              <dl className="mt-8 grid grid-cols-2 gap-px border border-border bg-border font-mono">
                {[
                  ["Engine", "2.0L Turbo"],
                  ["Drive", "4×4 Rock-Trac"],
                  ["Gearbox", "8-speed auto"],
                  ["Seats", "5 adults"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-background p-4">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        {/* BOOKING — car parks on the left */}
        <section id="book" className="flex min-h-screen items-end justify-center px-6 pb-12 pt-[42vh] md:items-center md:justify-end md:px-16 md:pt-24">
          <div className="w-full max-w-md">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-primary">03 — Your drive</p>
            <Booking />
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-border px-6 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:px-10">
          <span>Rubicon/LKO — Lucknow, Uttar Pradesh</span>
          <span>Drive easy.</span>
        </footer>
      </main>
    </div>
  );
}

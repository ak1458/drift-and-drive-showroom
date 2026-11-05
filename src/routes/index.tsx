import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jeepHero from "@/assets/jeep-hero.png";
import { DrivingCar } from "@/components/DrivingCar";
import { Breakdown } from "@/components/Breakdown";
import { Booking } from "@/components/Booking";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tyre } from "@/components/Tyre";
import { inr, useFleet } from "@/lib/fleet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sky Car Rental — Premium Self-Drive in Lucknow" },
      { name: "description", content: "Scroll-to-drive car rental in Lucknow. Pick your dates, choose your 4x4, book in seconds." },
      { property: "og:title", content: "Sky Car Rental — Drive Lucknow" },
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

      // road rushing past under the car
      gsap.utils.toArray<HTMLElement>(".streak").forEach((el, k) => {
        gsap.fromTo(el, { xPercent: -120, left: "100%" }, { left: "-40%", duration: 0.6 + (k % 4) * 0.25, ease: "none", repeat: -1, delay: k * 0.13 });
      });
      // suspension bounce over the road + slight wander
      gsap.to(".hero-car", { y: -3, duration: 0.18, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-tilt", { xPercent: 2, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      // idle: engine running, body gently rocking
      gsap.to(".hero-float", { y: -6, rotation: -0.8, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      // hero car stays put at first, then drives off to the left
      // drives off left with a drift: nose swings, tyres smoke
      const car = document.querySelector<HTMLElement>(".hero-car")!;
      const puff = (n: number, big = 1) => {
        const r = car.getBoundingClientRect();
        if (r.right < 0) return;
        window.dispatchEvent(new CustomEvent("smoke:emit", { detail: { x: r.left + r.width * 0.72, y: r.top + r.height * 0.82, vx: 120, vy: -30, n, big } }));
        window.dispatchEvent(new CustomEvent("smoke:emit", { detail: { x: r.left + r.width * 0.3, y: r.top + r.height * 0.86, vx: 80, vy: -20, n: Math.ceil(n / 2), big } }));
      };
      let lastP = 0;
      gsap.timeline({
        scrollTrigger: {
          trigger: "#hero", start: "18% top", end: "bottom top", scrub: 0.6,
          onUpdate: (st) => { const d = Math.abs(st.progress - lastP); lastP = st.progress; if (d > 0.002) puff(Math.min(10, Math.ceil(d * 400))); },
        },
      })
        .to(".hero-drive", { rotation: 8, x: "4vw", scale: 1.05, duration: 0.3, ease: "power1.out" })
        .to(".hero-drive", { xPercent: -150, rotation: -14, scale: 0.9, duration: 0.7, ease: "power2.in" });

      // outline word slides opposite to the car
      gsap.to(".hero-word-big", { xPercent: 25, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });

      // pointer / tilt: car follows the cursor in 3D
      const tilt = document.querySelector<HTMLElement>(".hero-tilt")!;
      gsap.set(tilt, { transformPerspective: 900 });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
      const tx = gsap.quickTo(tilt, "x", { duration: 0.8, ease: "power3" });
      const spot = document.querySelector<HTMLElement>(".spotlight")!;
      const onMove = (e: PointerEvent) => {
        if (window.scrollY > window.innerHeight) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry(nx * 22); rx(-ny * 10); tx(nx * 30);
        spot.style.setProperty("--sx", `${50 + nx * 40}%`);
        spot.style.setProperty("--sy", `${55 + ny * 30}%`);
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // tap/click the car: rev the engine
      const rev = () => {
        gsap.timeline()
          .to(".hero-float", { x: -4, rotation: -2, duration: 0.05, repeat: 9, yoyo: true, ease: "none" })
          .to(".hero-float", { x: 0, rotation: 0, duration: 0.3, ease: "elastic.out(1,0.4)" });
        gsap.fromTo(".headlights", { opacity: 1 }, { opacity: 0.35, duration: 0.9, ease: "power2.out" });
        let k = 0;
        const iv = setInterval(() => { puff(6, 1.3); if (++k > 8) clearInterval(iv); }, 60);
      };
      car.addEventListener("click", rev);
      // gentle exhaust while idling
      const idle = setInterval(() => { if (window.scrollY < 40 && !document.hidden) puff(2, 0.8); }, 260);

      // sections: headlines lean into the scroll
      gsap.utils.toArray<HTMLElement>(".lean").forEach((el, n) => {
        gsap.fromTo(el, { xPercent: n % 2 ? -12 : 12, skewX: n % 2 ? 6 : -6 }, { xPercent: n % 2 ? 6 : -6, skewX: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // speed strip reacts to scroll velocity
      const strip = gsap.to(".strip-inner", { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
      ScrollTrigger.create({ onUpdate: (st) => {
        const v = st.getVelocity();
        strip.timeScale(1 + Math.min(Math.abs(v) / 150, 12) * (v < 0 ? -1 : 1));
        gsap.to(strip, { timeScale: 1, duration: 1, overwrite: true, delay: 0.1 });
        gsap.to(".strip-inner", { skewX: gsap.utils.clamp(-20, 20, -v / 120), duration: 0.3, overwrite: "auto" });
      } });

      return () => { window.removeEventListener("pointermove", onMove); car.removeEventListener("click", rev); clearInterval(idle); };
      gsap.to(".hero-fade", {
        opacity: 0,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "90% top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });

      // speedometer line fills as you read the steps
      gsap.fromTo(".rev-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#process", start: "top 70%", end: "bottom 60%", scrub: true } });

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
      <DrivingCar />

      <header className="fixed inset-x-0 top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-background/75 backdrop-blur-md px-5 py-4 md:px-10 md:py-5">
        <Link to="/" className="truncate font-display text-xl font-black uppercase tracking-wide">
          Sky<span className="text-highlight">.</span> <span className="font-mono text-[10px] font-normal tracking-[0.3em] text-muted-foreground">Car Rental</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-4 md:gap-6">
          <a href="#garage" className={`${label} hidden text-muted-foreground hover:text-highlight sm:inline`}>Fleet</a>
          <a href="#faq" className={`${label} hidden text-muted-foreground hover:text-highlight sm:inline`}>FAQ</a>
          <ThemeToggle />
          <a href="#book" className={`${label} flex h-9 items-center bg-primary px-3 text-primary-foreground`}>Book</a>
        </nav>
      </header>

      <main className="relative z-10">
        <div id="journey">
          {/* HERO */}
          <section id="hero" className="relative flex h-svh flex-col items-center justify-center overflow-hidden">
            <div className="spotlight pointer-events-none absolute inset-0" aria-hidden />
            <h1 className="hero-fade pointer-events-none absolute inset-x-0 top-[17svh] select-none text-center font-display font-black uppercase leading-[0.8] md:top-[11svh]">
              <span className="hero-word hero-word-big block text-[44vw] text-outline md:text-[26vw]">Sky</span>
              <span className="sr-only">Sky Car Rental — Lucknow</span>
            </h1>
            <p className={`${label} hero-word absolute inset-x-0 top-[13svh] text-center text-muted-foreground md:top-[9svh]`}>
              Self-drive · Lucknow
            </p>
            <div className="streaks pointer-events-none absolute inset-x-0 top-[62svh] h-[22svh] md:top-[58svh]" aria-hidden>
              {Array.from({ length: 9 }).map((_, k) => (
                <span key={k} className="streak absolute h-px bg-gradient-to-l from-transparent via-foreground/40 to-transparent" style={{ top: `${(k * 37) % 100}%`, width: `${18 + ((k * 23) % 30)}%` }} />
              ))}
            </div>
            <div className="hero-drive relative z-10 mt-[14svh] w-[min(100vw,720px)] md:mt-[16svh]">
              <div className="hero-tilt [transform-style:preserve-3d]" style={{ perspective: 900 }}>
              <div className="hero-float relative origin-bottom -rotate-3">
                <div className="headlights pointer-events-none absolute left-[18%] top-[38%] h-[30%] w-[45%] rounded-full bg-primary/40 opacity-35 blur-3xl" aria-hidden />
                <img
                  src={jeepHero}
                  alt="Jeep Wrangler Rubicon, three-quarter view"
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                  className="hero-car relative w-full cursor-pointer"
                  title="Tap to rev"
                />
              </div>
              </div>
              <div className="car-floor mx-auto -mt-[6%] h-10 w-[80%]" aria-hidden />
            </div>
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
              <p className={`${label} text-highlight`}>01 — Arrival</p>
              <h2 className="lean mt-4 font-display text-[15vw] font-black uppercase leading-[0.85] md:text-8xl">
                It doesn't park.<br />It arrives.
              </h2>
              <p className="mt-5 text-muted-foreground">Delivered to your door anywhere in Lucknow — Gomti Nagar to Hazratganj — fuelled, detailed, ready.</p>
            </div>
          </section>

          {/* 02 — car swings right; copy left */}
          <section className="flex h-svh items-end px-5 pb-[8svh] md:items-center md:px-16 md:pb-0">
            <div className="reveal w-full max-w-lg">
              <p className={`${label} text-highlight`}>02 — Machine</p>
              <h2 className="lean mt-4 font-display text-[15vw] font-black uppercase leading-[0.85] md:text-8xl">Built for<br />every road.</h2>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 font-mono md:mt-8">
                {[
                  ["Engine", "2.0L Turbo"],
                  ["Drive", "4×4 Rock-Trac"],
                  ["Gearbox", "8-speed auto"],
                  ["Seats", "5 adults"],
                ].map(([k, v]) => (
                  <div key={k as string} className="border-t border-border pt-3">
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
            <p className={`${label} mb-4 text-highlight`}>03 — Your drive</p>
            <Booking />
          </div>
        </section>

        <div className="overflow-hidden border-y border-border py-5" aria-hidden>
          <div className="strip-inner flex w-max gap-10 whitespace-nowrap font-display text-5xl font-black uppercase md:text-7xl">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex gap-10">
                {["Lucknow", "Self-drive", "Delivered", "4×4", "Full tank", "Sky Car Rental"].map((w) => (
                  <span key={w} className="flex items-center gap-10"><span className="text-outline">{w}</span><span className="text-highlight">✦</span></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <Breakdown />

        {/* 04 — GARAGE */}
        <section id="garage" className="px-5 py-24 md:px-16 md:py-32">
          <div className="reveal flex items-end justify-between gap-6">
            <div className="min-w-0">
              <p className={`${label} text-highlight`}>04 — The garage</p>
              <h2 className="lean mt-4 font-display text-[14vw] font-black uppercase leading-[0.85] md:text-8xl">Pick your<br />machine.</h2>
            </div>
            <Link to="/fleet" className={`${label} hidden shrink-0 text-muted-foreground hover:text-highlight md:inline`}>Manage fleet →</Link>
          </div>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:bg-border md:px-0 md:pb-0 lg:grid-cols-5">
            {fleet.map((v, idx) => (
              <a
                key={v.id}
                href="#book"
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); gsap.to(e.currentTarget, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 14, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 14, transformPerspective: 700, duration: 0.4 }); }}
                onPointerLeave={(e) => gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1,0.5)" })}
                className="fleet-card group relative flex w-[72vw] shrink-0 snap-start flex-col justify-between border border-border bg-background p-5 transition-colors hover:bg-secondary md:w-auto md:border-0"
              >
                <span className="font-mono text-xs text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                <div className="mt-16">
                  <p className="font-display text-3xl font-extrabold uppercase leading-none">{v.name}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">{v.type} · {v.seats} seats</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-sm text-highlight">{inr(v.pricePerDay)}<span className="text-muted-foreground">/day</span></span>
                    <Tyre spinning={false} className="text-muted-foreground transition-transform duration-700 group-hover:rotate-[360deg] group-hover:text-highlight" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 05 — PROCESS */}
        <section id="process" className="px-5 py-24 md:px-16 md:py-32">
          <p className={`${label} reveal text-highlight`}>05 — How it works</p>
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
            <p className={`${label} text-highlight`}>06 — Before you drive</p>
            <h2 className="lean mt-4 font-display text-[14vw] font-black uppercase leading-[0.85] md:text-7xl">Questions.</h2>
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
          <h2 className="reveal font-display text-[24vw] font-black uppercase leading-[0.82] md:text-[11vw]">
            Engine's<br /><span className="text-highlight">running.</span>
          </h2>
          <a href="#book" className={`${label} group mx-auto mt-10 inline-flex h-14 w-full max-w-xs justify-center items-center gap-3 bg-primary px-8 text-primary-foreground hover:glow`}>
            <Tyre spinning={false} className="transition-transform duration-500 group-hover:rotate-[360deg]" /> Book the drive
          </a>
        </section>

        <footer className={`${label} flex flex-col justify-between gap-2 border-t border-border px-5 py-6 text-muted-foreground md:flex-row md:px-10`}>
          <span>Sky Car Rental — Lucknow, Uttar Pradesh</span>
          <span>Drive easy.</span>
        </footer>
      </main>
    </div>
  );
}

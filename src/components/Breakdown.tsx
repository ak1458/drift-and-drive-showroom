import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import body from "@/assets/part-body.png";
import chassis from "@/assets/part-chassis.png";
import wheel from "@/assets/part-wheel.png";
import engine from "@/assets/part-engine.png";
import interior from "@/assets/part-interior.png";

const label = "font-mono text-[10px] uppercase tracking-[0.25em] md:text-[11px]";

/** Pinned exploded view: scrolling pulls the Jeep apart, part by part, then puts it back. */
export function Breakdown() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 1, anticipatePin: 1 },
      });
      tl.to(".bd-head", { opacity: 0.08, duration: 0.5 }, 0)
        .to(".bd-body", { yPercent: -60, duration: 1 }, 0)
        .to(".bd-interior", { yPercent: -18, opacity: 1, duration: 1 }, 0.15)
        .to(".bd-engine", { xPercent: 45, yPercent: -40, opacity: 1, rotation: -6, duration: 1 }, 0.25)
        .to(".bd-chassis", { yPercent: 40, duration: 1 }, 0.1)
        .to(".bd-wheel-r", { yPercent: 110, xPercent: -40, rotation: -540, duration: 1 }, 0.2)
        .to(".bd-wheel-f", { yPercent: 110, xPercent: 40, rotation: 540, duration: 1 }, 0.2)
        .fromTo(".bd-tag", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.8)
        .to({}, { duration: 0.6 })
        .to(".bd-tag", { opacity: 0, duration: 0.3 })
        .to(".bd-head", { opacity: 1, duration: 0.5 }, "<")
        .to([".bd-body", ".bd-interior", ".bd-engine", ".bd-chassis", ".bd-wheel-r", ".bd-wheel-f"], { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: "power3.inOut" }, "<")
        .to([".bd-interior", ".bd-engine"], { opacity: 0, duration: 0.4 }, "<0.6");
      // headline counter
      tl.fromTo(".bd-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  const part = "absolute pointer-events-none select-none";
  return (
    <section ref={root} id="breakdown" className="relative flex h-svh flex-col justify-center overflow-hidden px-5 md:px-16">
      <div className="bd-head mb-4 flex items-end justify-between gap-4 md:mb-0">
        <div>
          <p className={`${label} text-highlight`}>Breakdown</p>
          <h2 className="mt-3 font-display text-[13vw] font-black uppercase leading-[0.85] md:text-7xl">Every part,<br />checked.</h2>
        </div>
        <p className="hidden max-w-xs text-muted-foreground md:block">Scroll to take it apart. Every car is inspected piece by piece before it reaches your door.</p>
      </div>

      <div className="relative mx-auto mt-[12svh] aspect-[2/1.1] w-full max-w-5xl md:mt-0 md:w-[48%]">
        <img src={chassis} alt="" loading="lazy" className={`${part} bd-chassis left-[3%] top-[33%] z-10 w-[94%]`} />
        <img src={interior} alt="" loading="lazy" className={`${part} bd-interior left-[16%] top-[10%] z-20 w-[60%] opacity-0`} />
        <img src={engine} alt="" loading="lazy" className={`${part} bd-engine left-[66%] top-[20%] z-20 w-[22%] opacity-0`} />
        <img src={body} alt="Jeep body shell" loading="lazy" className={`${part} bd-body left-0 top-0 z-30 w-full`} />
        <img src={wheel} alt="" loading="lazy" className={`${part} bd-wheel-r left-[8.5%] top-[45%] z-40 w-[22%]`} />
        <img src={wheel} alt="" loading="lazy" className={`${part} bd-wheel-f left-[72%] top-[45%] z-40 w-[22%]`} />

        <span className={`${label} bd-tag absolute z-50 bg-background/70 px-1 -top-[30%] left-0 text-highlight`}>Body — steel + alloy</span>
        <span className={`${label} bd-tag absolute z-50 bg-background/70 px-1 -top-[2%] right-0 text-right text-highlight`}>2.0L turbo · 8-speed</span>
        <span className={`${label} bd-tag absolute z-50 bg-background/70 px-1 top-[38%] left-[30%] text-highlight`}>5-seat cabin</span>
        <span className={`${label} bd-tag absolute z-50 bg-background/70 px-1 top-[92%] left-[30%] text-highlight`}>Ladder frame · 4×4 axles</span>
        <span className={`${label} bd-tag absolute z-50 bg-background/70 px-1 top-[128%] left-0 text-highlight`}>33" mud terrain</span>
      </div>

      <div className="absolute inset-x-5 bottom-6 h-px bg-border md:inset-x-16">
        <div className="bd-progress h-px origin-left bg-primary" />
      </div>
    </section>
  );
}

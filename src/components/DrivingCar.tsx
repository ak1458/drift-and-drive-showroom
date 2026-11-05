import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jeepTop from "@/assets/jeep-top.png";

type Puff = { x: number; y: number; vx: number; vy: number; r: number; grow: number; age: number; life: number };

/**
 * One fixed layer above the page: a top-down Jeep driven by scroll,
 * plus a full-page smoke canvas fed from the rear tyres.
 */
export function DrivingCar() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const exit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const o = outer.current!;
    const i = inner.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = () => window.innerWidth < 768;
    const vw = () => window.innerWidth / 100;
    const vh = () => window.innerHeight / 100;

    // --- scroll path -------------------------------------------------------
    gsap.set(o, { xPercent: -50, yPercent: -50, x: () => 6 * vw(), y: () => 8 * vh(), rotation: 90, opacity: 0, scale: 0.85 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: "#journey", start: "top top", end: "bottom top", scrub: 1.2, invalidateOnRefresh: true },
    });
    // On phones the car stays in the upper half; copy sits at the bottom.
    // hold while the hero car drives off, then the top-down car drops in
    // the side-view hero car hands over here: same spot, facing the same way, then it drifts off
    tl.to({}, { duration: 0.55 })
      .to(o, { opacity: 1, scale: 1, duration: 0.25, ease: "power1.out" })
      .to(o, { x: 0, y: () => (mobile() ? -10 : -2) * vh(), rotation: 180, duration: 1, ease: "power2.inOut" })
      .to(o, { x: () => (mobile() ? -16 : -27) * vw(), y: () => (mobile() ? -20 : 12) * vh(), rotation: 118, duration: 1, ease: "sine.inOut" })
      .to(o, { x: () => (mobile() ? 16 : 27) * vw(), y: () => (mobile() ? -24 : 0) * vh(), rotation: 248, duration: 1.2, ease: "sine.inOut" })
      .to(o, {
        x: () => (mobile() ? 0 : -25 * vw()),
        y: () => (mobile() ? -30 : 4) * vh(),
        rotation: 450,
        duration: 1.4,
        ease: "power2.inOut",
      });

    // After booking the car stays "parked" in the page and scrolls away with it.
    const exitEl = exit.current!;
    const exitTween = gsap.to(exitEl, {
      y: () => -window.innerHeight,
      ease: "none",
      scrollTrigger: {
        trigger: "#book",
        start: () => (mobile() ? "top top" : "bottom bottom"),
        end: () => "+=" + window.innerHeight,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    ScrollTrigger.config({ ignoreMobileResize: true });

    // body roll / idle rumble
    const rumble = gsap.to(i.firstElementChild, { y: 1.2, duration: 0.07, yoyo: true, repeat: -1, ease: "none" });

    // --- launch / return (booking) ----------------------------------------
    let burst = 0;
    const onLaunch = () => {
      burst = 1;
      gsap.timeline()
        .to(i, { y: 10, duration: 0.25, ease: "power1.out" })
        .to(i, { y: () => -170 * vw(), duration: 1.5, ease: "power3.in" })
        .to({}, { duration: 0.01, onComplete: () => void (burst = 0) });
    };
    const onReturn = () => {
      burst = 0.6;
      gsap.fromTo(i, { y: () => 120 * vw() }, { y: 0, duration: 1.6, ease: "power3.out", onComplete: () => void (burst = 0) });
    };
    window.addEventListener("car:launch", onLaunch);
    window.addEventListener("car:return", onReturn);

    // --- smoke -------------------------------------------------------------
    const dpr = Math.min(window.devicePixelRatio || 1, mobile() ? 1.5 : 2);
    const resize = () => {
      cv.width = window.innerWidth * dpr;
      cv.height = window.innerHeight * dpr;
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 128;
    const sc = sprite.getContext("2d")!;
    let smokeAlpha = 0.42;
    const paintSprite = () => {
      const dark = document.documentElement.classList.contains("dark");
      // dark mode: pale champagne smoke · light mode: graphite smoke
      const c = dark ? ["236,228,212", "210,200,182", "180,170,152"] : ["90,84,76", "120,112,100", "150,142,130"];
      smokeAlpha = dark ? 0.6 : 0.42;
      sc.clearRect(0, 0, 128, 128);
      const g = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, `rgba(${c[0]},0.9)`);
      g.addColorStop(0.45, `rgba(${c[1]},0.45)`);
      g.addColorStop(1, `rgba(${c[2]},0)`);
      sc.fillStyle = g;
      sc.fillRect(0, 0, 128, 128);
    };
    paintSprite();
    window.addEventListener("theme:change", paintSprite);
    const maxPuffs = mobile() ? 450 : 1100;
    // other parts of the page (hero car) can puff smoke here
    const onEmit = (e: Event) => {
      const d = (e as CustomEvent).detail as { x: number; y: number; vx?: number; vy?: number; n?: number; big?: number };
      for (let k = 0; k < (d.n ?? 6); k++)
        puffs.push({
          x: d.x + (Math.random() - 0.5) * 90, y: d.y + window.scrollY + (Math.random() - 0.5) * 24,
          vx: (d.vx ?? 0) + (Math.random() - 0.5) * 80, vy: (d.vy ?? -20) + (Math.random() - 0.5) * 40,
          r: 14 + Math.random() * 18, grow: (60 + Math.random() * 90) * (d.big ?? 1), age: 0, life: 1.8 + Math.random() * 1.8,
        });
    };
    window.addEventListener("smoke:emit", onEmit);
    // pointer stirs the smoke
    const ptr = { x: -9999, y: -9999, vx: 0, vy: 0 };
    const onPtr = (e: PointerEvent) => { ptr.vx = e.clientX - ptr.x; ptr.vy = e.clientY - ptr.y; ptr.x = e.clientX; ptr.y = e.clientY; };
    window.addEventListener("pointermove", onPtr, { passive: true });

    const puffs: Puff[] = [];
    let last = { rot: 180, cx: 0, cy: 0, init: false };

    const tick = (_t: number, dtMs: number) => {
      const dt = Math.min(dtMs, 50) / 1000;
      const rect = i.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      // ignore the "parked, scrolling away" offset so it doesn't smoke
      const cy = rect.top + rect.height / 2 - (gsap.getProperty(exitEl, "y") as number);
      const rot = gsap.getProperty(o, "rotation") as number;
      if (!last.init) last = { rot, cx, cy, init: true };
      const dRot = Math.abs(rot - last.rot);
      const speed = Math.hypot(cx - last.cx, cy - last.cy);
      const mx = cx - last.cx;
      const my = cy - last.cy;
      last = { rot, cx, cy, init: true };

      const exitY = gsap.getProperty(exitEl, "y") as number;
      const onScreen = cy + exitY > -200 && cy + exitY < window.innerHeight + 200;
      let emit = Math.min(9, dRot * 3 + speed * 0.07 + burst * 6);
      if (!onScreen) emit = 0;
      if (emit > 0.15) {
        const W = i.offsetWidth;
        const H = i.offsetHeight;
        const rad = (rot * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        for (const side of [-1, 1]) {
          const lx = side * W * 0.38;
          const ly = H * 0.3;
          const px = cx + lx * cos - ly * sin;
          const py = cy + exitY + lx * sin + ly * cos;
          const n = Math.floor(emit) + (Math.random() < emit % 1 ? 1 : 0);
          for (let k = 0; k < n; k++) {
            puffs.push({
              x: px + (Math.random() - 0.5) * 14,
              y: py + window.scrollY + (Math.random() - 0.5) * 14,
              vx: -mx * 0.6 + (Math.random() - 0.5) * 40,
              vy: -my * 0.6 + (Math.random() - 0.5) * 40 - 8,
              r: 10 + Math.random() * 14,
              grow: 50 + Math.random() * 70,
              age: 0,
              life: 1.6 + Math.random() * 1.6,
            });
          }
        }
        if (puffs.length > maxPuffs) puffs.splice(0, puffs.length - maxPuffs);
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const sy = window.scrollY;
      for (let p = puffs.length - 1; p >= 0; p--) {
        const s = puffs[p]!;
        s.age += dt;
        if (s.age >= s.life) {
          puffs.splice(p, 1);
          continue;
        }
        const t = s.age / s.life;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const ddx = s.x - ptr.x, ddy = s.y - sy - ptr.y, dd = Math.hypot(ddx, ddy);
        if (dd < 160) { s.vx += ptr.vx * 0.9 + (ddx / (dd + 1)) * 30; s.vy += ptr.vy * 0.9 + (ddy / (dd + 1)) * 30; }
        s.vx *= 0.97;
        s.vy *= 0.97;
        const r = s.r + s.grow * Math.sqrt(t);
        ctx.globalAlpha = Math.pow(1 - t, 1.6) * smokeAlpha;
        ctx.drawImage(sprite, s.x - r, s.y - sy - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      ptr.vx *= 0.5; ptr.vy *= 0.5;
    };
    if (!reduce) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      tl.scrollTrigger?.kill();
      tl.kill();
      rumble.kill();
      exitTween.scrollTrigger?.kill();
      exitTween.kill();
      window.removeEventListener("theme:change", paintSprite);
      window.removeEventListener("resize", resize);
      window.removeEventListener("car:launch", onLaunch);
      window.removeEventListener("car:return", onReturn);
      window.removeEventListener("smoke:emit", onEmit);
      window.removeEventListener("pointermove", onPtr);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-20" aria-hidden />
      <div ref={exit} className="pointer-events-none fixed inset-0 z-30">
      <div ref={outer} className="absolute left-1/2 top-1/2 will-change-transform">
        <div ref={inner}>
          <img
            src={jeepTop}
            alt="Jeep Wrangler Rubicon, top view"
            width={768}
            height={1280}
            className="h-[min(40svh,58vw)] w-auto car-shadow"
          />
        </div>
      </div>
      </div>
    </>
  );
}

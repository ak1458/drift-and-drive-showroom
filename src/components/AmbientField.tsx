import { useEffect, useRef } from "react";

type P = { x: number; y: number; z: number; vx: number; vy: number; rot: number; vr: number; s: number; c: number };

/**
 * Full-page drifting field of outlined triangle sparks behind the content.
 * Reacts to the pointer (pushes away) and to scroll speed (streams past like road debris).
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let palette: string[] = [];
    const paint = () => {
      const dark = document.documentElement.classList.contains("dark");
      palette = dark
        ? ["255,192,0", "255,192,0", "145,115,0", "245,245,242", "168,175,184"]
        : ["145,115,0", "145,115,0", "200,150,0", "10,10,10", "46,50,56"];
    };
    paint();
    window.addEventListener("theme:change", paint);

    const N = mobile ? 70 : 160;
    const ps: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.8,
      s: 2 + Math.random() * 5, c: Math.floor(Math.random() * 5),
    }));

    const ptr = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.active = true; };
    const onLeave = () => { ptr.active = false; ptr.x = ptr.y = -9999; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    let lastY = window.scrollY, vel = 0, raf = 0, prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - prev, 50) / 1000; prev = now;
      const sy = window.scrollY;
      vel += ((sy - lastY) - vel) * 0.2; lastY = sy;
      ctx.clearRect(0, 0, W, H);
      const R = mobile ? 90 : 140;
      for (const p of ps) {
        // pointer repel
        const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
        if (d < R && d > 0.1) {
          const f = (1 - d / R) * 900 * p.z;
          p.vx += (dx / d) * f * dt; p.vy += (dy / d) * f * dt; p.vr += 4 * dt;
        }
        p.vx *= 0.96; p.vy *= 0.96; p.vr *= 0.985;
        p.x += (p.vx + Math.sin(now / 2000 + p.c) * 4) * dt;
        p.y += p.vy * dt - vel * p.z * 0.9; // scroll parallax / streaming
        p.rot += (p.vr + 0.2) * dt;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

        const s = p.s * (1 + p.z);
        const stretch = 1 + Math.min(Math.abs(vel) * 0.08, 3) * p.z;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(1, stretch);
        ctx.rotate(p.rot);
        ctx.strokeStyle = `rgba(${palette[p.c]},${0.18 + p.z * 0.45})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -s); ctx.lineTo(s * 0.87, s * 0.5); ctx.lineTo(-s * 0.87, s * 0.5); ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("theme:change", paint);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);
    document.body.classList.add("has-cursor");
    return () => document.body.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!on || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    let mag: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as HTMLElement;
      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (m !== mag) { if (mag) gsap.to(mag, { x: 0, y: 0, duration: 0.4 }); mag = m; }
      if (m) {
        const r = m.getBoundingClientRect();
        gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3 });
      }
      const card = t.closest("[data-cursor='card']");
      const click = t.closest("a,button,input");
      gsap.to(ring.current, { scale: card ? 2.4 : click ? 1.6 : 1, opacity: card ? 0.5 : 1, duration: 0.3 });
    };
    const down = () => gsap.to(dot.current, { scale: 0.5, duration: 0.15 });
    const up = () => gsap.to(dot.current, { scale: 1, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, [on]);

  if (!on) return null;
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 h-10 w-10 rounded-full border border-primary/60" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[101] -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary" />
    </>
  );
}

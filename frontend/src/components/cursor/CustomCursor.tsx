"use client";

import { useEffect, useRef } from "react";
import { useCustomCursorEnabled } from "@/hooks/useCustomCursorEnabled";

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label[for], [data-cursor-hover]';

const DOT_LERP = 0.38;
const RING_LERP = 0.11;
const MAGNETIC_PULL = 0.22;

type Vec2 = { x: number; y: number };

export function CustomCursor() {
  const enabled = useCustomCursorEnabled();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef<Vec2>({ x: 0, y: 0 });
  const dot = useRef<Vec2>({ x: 0, y: 0 });
  const ring = useRef<Vec2>({ x: 0, y: 0 });
  const magnetic = useRef<Vec2 | null>(null);
  const hovering = useRef(false);
  const dotScale = useRef(1);
  const ringScale = useRef(1);
  const rafId = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;

      if (magnetic.current) {
        x += (magnetic.current.x - x) * MAGNETIC_PULL;
        y += (magnetic.current.y - y) * MAGNETIC_PULL;
      }

      mouse.current = { x, y };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest(INTERACTIVE) as HTMLElement | null;
      hovering.current = !!el;

      if (el) {
        const rect = el.getBoundingClientRect();
        magnetic.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      } else {
        magnetic.current = null;
      }

      ringRef.current?.classList.toggle("is-hover", hovering.current);
      dotRef.current?.classList.toggle("is-hover", hovering.current);
    };

    const tick = () => {
      dot.current.x += (mouse.current.x - dot.current.x) * DOT_LERP;
      dot.current.y += (mouse.current.y - dot.current.y) * DOT_LERP;
      ring.current.x += (mouse.current.x - ring.current.x) * RING_LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * RING_LERP;

      const targetDotScale = hovering.current ? 0.625 : 1;
      const targetRingScale = hovering.current ? 1.7 : 1;

      dotScale.current += (targetDotScale - dotScale.current) * 0.15;
      ringScale.current += (targetRingScale - ringScale.current) * 0.15;

      const dotEl = dotRef.current;
      const ringEl = ringRef.current;

      if (dotEl) {
        dotEl.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale.current})`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${ringScale.current})`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="custom-cursor" aria-hidden>
      <div ref={ringRef} className="custom-cursor__ring" />
      <div ref={dotRef} className="custom-cursor__dot" />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/store/settings";
import { useGame } from "@/store/game";
import { levelForXp } from "@/lib/scoring";
import { PixelSprite } from "./PixelSprite";

const SPEED = 260; // px per second
const SPRITE_SCALE = 6;
const SPRITE_W = 16 * SPRITE_SCALE; // sprite is 16x22 base units
const SPRITE_H = 22 * SPRITE_SCALE;
const KEYS = new Set([
  "w", "a", "s", "d",
  "arrowup", "arrowdown", "arrowleft", "arrowright",
]);

/**
 * The controllable hero. Rendered on every page; only obeys WASD/arrows
 * while Game Mode is on. Can be hidden entirely from the nav.
 */
export function CharacterOverlay() {
  const { gameMode, characterHidden, character } = useSettings();
  const username = useGame((s) => s.username);
  const xp = useGame((s) => s.xp);
  const level = levelForXp(xp);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const posRef = useRef({ x: 40, y: 0 });
  const elRef = useRef<HTMLDivElement | null>(null);
  const pressed = useRef<Set<string>>(new Set());
  const raf = useRef<number>(0);

  // Start at the bottom-left once we know the viewport.
  useEffect(() => {
    posRef.current.y = window.innerHeight - SPRITE_H;
    if (elRef.current) {
      elRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    }
  }, []);

  useEffect(() => {
    if (!gameMode) {
      pressed.current.clear();
      setWalking(false);
      return;
    }

    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        el.isContentEditable ||
        // Don't steal keys from Monaco / Sandpack editors.
        !!el.closest(".monaco-editor, .sp-wrapper")
      );
    };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!KEYS.has(k) || isTyping(e.target)) return;
      e.preventDefault();
      pressed.current.add(k);
    };
    const up = (e: KeyboardEvent) => {
      pressed.current.delete(e.key.toLowerCase());
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = pressed.current;
      let dx = 0;
      let dy = 0;
      if (p.has("a") || p.has("arrowleft")) dx -= 1;
      if (p.has("d") || p.has("arrowright")) dx += 1;
      if (p.has("w") || p.has("arrowup")) dy -= 1;
      if (p.has("s") || p.has("arrowdown")) dy += 1;

      const moving = dx !== 0 || dy !== 0;
      setWalking((w) => (w === moving ? w : moving));
      if (dx < 0) setFacing("left");
      if (dx > 0) setFacing("right");

      if (moving) {
        const len = Math.hypot(dx, dy) || 1;
        const pos = posRef.current;
        pos.x = Math.max(0, Math.min(window.innerWidth - SPRITE_W, pos.x + (dx / len) * SPEED * dt));
        pos.y = Math.max(0, Math.min(window.innerHeight - SPRITE_H, pos.y + (dy / len) * SPEED * dt));
        if (elRef.current) {
          elRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(raf.current);
    };
  }, [gameMode]);

  if (characterHidden) return null;

  return (
    <div
      ref={elRef}
      className="fixed left-0 top-0 z-50 pointer-events-none select-none"
      style={{ transform: `translate(${posRef.current.x}px, ${posRef.current.y}px)` }}
      aria-hidden
    >
      <div className="relative w-fit">
        {username?.trim() && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 font-pixel text-[11px] text-gold text-center whitespace-nowrap drop-shadow-[1px_1px_0_#000]">
            <span className="text-mp">Lv{level}</span> {username}
          </div>
        )}
        <div className={walking ? "sprite-walk" : undefined}>
          <PixelSprite config={character} scale={SPRITE_SCALE} walking={walking} facing={facing} />
        </div>
      </div>
    </div>
  );
}

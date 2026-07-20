"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGame } from "@/store/game";
import { useSettings } from "@/store/settings";
import { rankForXp } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { PixelButton } from "@/components/ui/pixel";
import { chiptune, TRACKS } from "@/components/audio/chiptune";

const LINKS = [
  { href: "/arena", label: "Arena" },
  { href: "/learn", label: "Learn" },
  { href: "/glossary", label: "Glossary" },
  { href: "/dashboard", label: "Stats" },
  { href: "/leaderboard", label: "Ranks" },
  { href: "/profile", label: "Hero" },
];

export function Nav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { xp, streakCount } = useGame();
  const {
    muted,
    gameMode,
    characterHidden,
    musicTrack,
    toggleMuted,
    toggleGameMode,
    toggleCharacterHidden,
    setMusicTrack,
  } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // The interview room hides the nav for focus.
  if (pathname?.startsWith("/interview/")) return null;

  return (
    <header className="sticky top-0 z-40 bg-panel border-b-4 border-border-px">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-pixel text-gold text-sm shrink-0">
          ACE<span className="text-mp">LOOP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "font-pixel text-[9px] px-3 py-2 uppercase hover:text-gold-2",
                pathname?.startsWith(l.href) ? "text-gold" : "text-ink-dim"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {mounted && (
            <>
              <span className="font-pixel text-[9px] text-hp" title="Daily streak">
                🔥{streakCount}
              </span>
              <span
                className="font-pixel text-[9px] text-xpbar hidden sm:inline"
                title={`Rank: ${rankForXp(xp)}`}
              >
                {xp}xp
              </span>
              <PixelButton
                size="sm"
                variant={gameMode ? "green" : "ghost"}
                onClick={toggleGameMode}
                title="Toggle Game Mode: control your hero with WASD / arrows"
              >
                {gameMode ? "◼ Game Mode" : "▶ Game Mode"}
              </PixelButton>
              <PixelButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  // Unlock audio inside the gesture before flipping state; the
                  // MusicController effect that starts the loop runs too late.
                  if (muted) chiptune.unlock();
                  toggleMuted();
                }}
                title={muted ? "Unmute the theme song" : "Mute the theme song"}
                aria-label={muted ? "Unmute music" : "Mute music"}
              >
                {muted ? "🔇" : "🔊"}
              </PixelButton>
              <PixelButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  const next = (musicTrack + 1) % TRACKS.length;
                  chiptune.unlock();
                  setMusicTrack(next);
                }}
                title={`Music: ${TRACKS[musicTrack]?.name ?? "?"} — click to change`}
                aria-label="Change music track"
                className="hidden sm:inline-flex"
              >
                🎵 {TRACKS[musicTrack]?.name ?? ""}
              </PixelButton>
              <PixelButton
                size="sm"
                variant="ghost"
                onClick={toggleCharacterHidden}
                title={characterHidden ? "Show your hero" : "Hide your hero"}
                className="hidden sm:inline-flex"
              >
                {characterHidden ? "👤" : "🫥"}
              </PixelButton>
            </>
          )}
          <button
            className="md:hidden font-pixel text-gold text-sm px-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            ≡
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t-4 border-border-px bg-panel-2 px-4 py-2 flex flex-wrap gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "font-pixel text-[9px] px-3 py-2 uppercase",
                pathname?.startsWith(l.href) ? "text-gold" : "text-ink-dim"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

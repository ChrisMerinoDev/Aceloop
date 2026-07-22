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
          <a
            href="https://github.com/ChrismerinoDev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-pixel text-[8px] text-ink-dim hover:text-gold-2 uppercase"
            title="Developed by ChrismerinoDev — view GitHub profile"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="leading-none">Developed by</span>
          </a>
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

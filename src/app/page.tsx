"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PixelButton, PixelPanel, PixelBadge } from "@/components/ui/pixel";
import { PixelSprite } from "@/components/character/PixelSprite";
import { useSettings } from "@/store/settings";
import { QUESTIONS } from "@/content";
import { glossaryTerms } from "@/content/glossary";

export default function LandingPage() {
  const character = useSettings((s) => s.character);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center gap-10 pt-16 pb-12">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-pixel text-2xl md:text-3xl leading-relaxed text-ink"
          >
            GRIND THE <span className="text-gold">INTERVIEW</span>
            <br />
            LIKE IT&apos;S AN <span className="text-mp">RPG</span>
          </motion.h1>
          <p className="mt-5 text-xl text-ink-dim max-w-xl">
            The most-asked DSA and senior-frontend questions, forged into timed
            boss fights. Solve them in a real editor, get scored like a real
            interview, earn XP, keep your streak alive, and climb from Bronze
            to Master.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/arena">
              <PixelButton size="lg" variant="gold">
                ⚔ Enter the Arena
              </PixelButton>
            </Link>
            <Link href="/interview/two-sum">
              <PixelButton size="lg" variant="green">
                Try a Quest (no account)
              </PixelButton>
            </Link>
            <Link href="/auth">
              <PixelButton size="lg" variant="ghost">
                Sign In / Save Progress
              </PixelButton>
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="pixel-border bg-panel p-8"
        >
          <PixelSprite config={character} scale={8} />
          <div className="font-pixel text-[8px] text-center text-ink-dim mt-3">
            YOUR HERO ·{" "}
            <Link href="/profile" className="text-mp hover:text-gold-2">
              CUSTOMIZE
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="grid md:grid-cols-3 gap-6 mt-6">
        <PixelPanel title="⏱ Interview Simulation">
          <p className="text-ink-dim">
            A countdown timer, hidden test sets, and a 0-100 score with a
            letter grade. Auto-submit at zero — just like the real pressure.
          </p>
        </PixelPanel>
        <PixelPanel title="🗺 Level Map">
          <p className="text-ink-dim">
            {QUESTIONS.length} hand-built quests across 6 regions, from Novice
            Meadows to Big-O Castle. Clear a region to unlock the next.
          </p>
        </PixelPanel>
        <PixelPanel title="🔥 Streaks & Ranks">
          <p className="text-ink-dim">
            XP, combo multipliers, achievements, a daily flame, and spaced
            repetition that resurfaces the quests that beat you.
          </p>
        </PixelPanel>
        <PixelPanel title="📖 Learn Mode">
          <p className="text-ink-dim">
            Every quest ships a lesson: intuition → brute force → optimization
            → Big-O → pitfalls. Learn the pattern, not the answer.
          </p>
        </PixelPanel>
        <PixelPanel title="📜 Glossary">
          <p className="text-ink-dim">
            {glossaryTerms.length} advanced terms — event loop, hydration,
            memoization, tree shaking — cross-linked inside every prompt.
          </p>
        </PixelPanel>
        <PixelPanel title="🎮 Actually Fun">
          <p className="text-ink-dim">
            Chiptune soundtrack, confetti crits, a customizable pixel hero you
            can walk around the screen in Game Mode. Nostalgia included.
          </p>
        </PixelPanel>
      </section>

      <section className="mt-14 text-center">
        <div className="font-pixel text-[10px] text-ink-dim uppercase mb-4">
          Patterns you&apos;ll master
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[...new Set(QUESTIONS.map((q) => q.pattern))].map((p) => (
            <PixelBadge key={p} color="dim">
              {p}
            </PixelBadge>
          ))}
        </div>
        <p className="font-pixel text-[9px] text-ink-dim mt-10 blink">
          PRESS START — YOUR STREAK BEGINS TODAY
        </p>
      </section>
    </main>
  );
}

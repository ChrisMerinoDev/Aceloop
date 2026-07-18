"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LEVELS, QUESTIONS, questionsForLevel, isLevelUnlocked } from "@/content";
import { useGame, selectReviewQueue } from "@/store/game";
import { PixelBadge, PixelButton, PixelPanel } from "@/components/ui/pixel";
import { cn } from "@/lib/utils";

export default function ArenaPage() {
  const [mounted, setMounted] = useState(false);
  const game = useGame();
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center font-pixel text-[10px] text-ink-dim">
        LOADING WORLD MAP<span className="blink">…</span>
      </main>
    );
  }

  const reviewQueue = selectReviewQueue(game);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">WORLD MAP</h1>
      <p className="text-center text-ink-dim mt-2">
        Clear 60% of a region&apos;s quests (and gather XP) to unlock the next.
      </p>

      {reviewQueue.length > 0 && (
        <PixelPanel title="👻 Haunted Quests — due for review" className="mt-8 border-purple">
          <p className="text-ink-dim mb-3">
            These beat you before, or you peeked at the solution. Defeat them
            again to banish them.
          </p>
          <div className="flex flex-wrap gap-2">
            {reviewQueue.map((slug) => {
              const title = QUESTIONS.find((x) => x.slug === slug)?.title ?? slug;
              return (
                <Link key={slug} href={`/interview/${slug}`}>
                  <PixelButton size="sm" variant="purple">
                    {title}
                  </PixelButton>
                </Link>
              );
            })}
          </div>
        </PixelPanel>
      )}

      <div className="mt-10 space-y-2">
        {LEVELS.map((meta, i) => {
          const unlocked = isLevelUnlocked(meta.level, game.xp, game.isSolved);
          const questions = questionsForLevel(meta.level);
          const solved = questions.filter((q) => game.isSolved(q.slug)).length;
          const cleared = questions.length > 0 && solved === questions.length;

          return (
            <div key={meta.level}>
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <span className="font-pixel text-border-px text-xs">▼ ▼ ▼</span>
                </div>
              )}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "pixel-border p-5",
                  unlocked ? "bg-panel" : "bg-panel/40 grayscale"
                )}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-pixel text-2xl">
                    {cleared ? "🏆" : unlocked ? "🗡" : "🔒"}
                  </span>
                  <div>
                    <h2 className="font-pixel text-[13px] text-gold-2">
                      LV.{meta.level} — {meta.name.toUpperCase()}
                    </h2>
                    <p className="text-ink-dim">{meta.tagline}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-pixel text-[10px] text-xpbar">
                      {solved}/{questions.length}
                    </div>
                    {!unlocked && (
                      <div className="font-pixel text-[8px] text-ink-dim mt-1">
                        needs {meta.xpRequired}xp
                      </div>
                    )}
                  </div>
                </div>

                {unlocked && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    {questions.map((q) => {
                      const p = game.progress[q.slug];
                      const isSolved = p?.status === "solved";
                      return (
                        <Link
                          key={q.slug}
                          href={`/interview/${q.slug}`}
                          className={cn(
                            "border-4 p-3 flex items-center gap-2 hover:border-gold transition-colors",
                            isSolved
                              ? "border-xpbar/50 bg-xpbar/5"
                              : "border-border-px bg-panel-2"
                          )}
                        >
                          <span>{isSolved ? "⭐" : q.category === "frontend" ? "🎨" : "⚔️"}</span>
                          <span className="flex-1 leading-tight">{q.title}</span>
                          <span className="flex flex-col items-end gap-1">
                            <PixelBadge
                              color={
                                q.difficulty === "easy"
                                  ? "green"
                                  : q.difficulty === "medium"
                                  ? "gold"
                                  : "red"
                              }
                            >
                              {q.difficulty}
                            </PixelBadge>
                            {p !== undefined && p.bestScore > 0 && (
                              <span className="font-pixel text-[8px] text-ink-dim">
                                best {p.bestScore}
                              </span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            </div>
          );
        })}
      </div>
    </main>
  );
}

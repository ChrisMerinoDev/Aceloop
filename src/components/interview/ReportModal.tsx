"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { AttemptSummary } from "@/store/game";
import type { Question } from "@/lib/types";
import { coachingFeedback } from "@/lib/scoring";
import { formatClock } from "@/lib/utils";
import { PixelButton, PixelBadge, PixelBar } from "@/components/ui/pixel";
import { ACHIEVEMENTS } from "@/content/achievements";
import { chiptune } from "@/components/audio/chiptune";
import { useSettings } from "@/store/settings";

export function ReportModal({
  summary,
  question,
  failedLabels,
  nextSlug,
  onRevealSolution,
  onClose,
}: {
  summary: AttemptSummary;
  question: Question;
  failedLabels: string[];
  nextSlug: string | null;
  onRevealSolution: () => void;
  onClose: () => void;
}) {
  const muted = useSettings((s) => s.muted);

  useEffect(() => {
    if (summary.passed) {
      confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 } });
      confetti({ particleCount: 60, angle: 60, spread: 50, origin: { x: 0 } });
      confetti({ particleCount: 60, angle: 120, spread: 50, origin: { x: 1 } });
      if (!muted) chiptune.jingle();
    } else if (!muted) {
      chiptune.buzz();
    }
  }, [summary.passed, muted]);

  const rankUp = summary.rankBefore !== summary.rankAfter;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.45 }}
        className="pixel-border bg-panel w-full max-w-lg p-6 my-8"
      >
        <div className="text-center">
          <div className="font-pixel text-[10px] text-ink-dim uppercase">
            {summary.passed ? "Quest Complete!" : "Quest Failed"}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`font-pixel text-6xl my-3 ${summary.passed ? "text-gold" : "text-hp"}`}
          >
            {summary.grade}
          </motion.div>
          <div className="font-pixel text-sm text-ink">{summary.score}/100</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <Stat label="Tests" value={`${summary.testsPassed}/${summary.testsTotal}`} />
          <Stat label="Time" value={formatClock(summary.timeTakenSeconds)} />
          <Stat label="XP Earned" value={`+${summary.xpEarned}`} accent="text-xpbar" />
          <Stat label="Combo" value={`x${summary.combo}`} accent="text-purple" />
        </div>

        <p className="mt-4 text-ink-dim border-l-4 border-gold pl-3">
          {coachingFeedback({
            passed: summary.testsPassed,
            total: summary.testsTotal,
            failedLabels,
            timeTakenSeconds: summary.timeTakenSeconds,
            timeLimitSeconds: question.timeLimitSeconds,
          })}
        </p>

        <div className="mt-4">
          <PixelBar
            label={`Streak: ${summary.streakCount} days`}
            value={summary.streakCount % 7}
            max={7}
            color="var(--color-hp)"
          />
        </div>

        {rankUp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 border-4 border-gold bg-gold/10 p-3 text-center"
          >
            <span className="font-pixel text-[11px] text-gold-2">
              ⬆ RANK UP! {summary.rankBefore} → {summary.rankAfter}
            </span>
          </motion.div>
        )}

        {summary.unlockedLevels.length > 0 && (
          <div className="mt-3 border-4 border-mp bg-mp/10 p-3 text-center">
            <span className="font-pixel text-[10px] text-mp">
              🗺 New area unlocked: Level {summary.unlockedLevels.join(", ")}
            </span>
          </div>
        )}

        {summary.newAchievements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {summary.newAchievements.map((key) => {
              const a = ACHIEVEMENTS.find((x) => x.key === key);
              if (!a) return null;
              return (
                <PixelBadge key={key} color="purple">
                  {a.icon} {a.name}
                </PixelBadge>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {!summary.passed && (
            <PixelButton variant="ghost" onClick={onClose}>
              Try Again
            </PixelButton>
          )}
          <PixelButton variant="ghost" onClick={onRevealSolution}>
            Reveal Solution
          </PixelButton>
          <Link href={`/learn/${question.slug}`}>
            <PixelButton variant="blue">Open Lesson</PixelButton>
          </Link>
          {summary.passed && nextSlug !== null && (
            <Link href={`/interview/${nextSlug}`}>
              <PixelButton variant="gold">Next Quest →</PixelButton>
            </Link>
          )}
          {summary.passed && (
            <Link href="/arena">
              <PixelButton variant="green">Level Map</PixelButton>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="border-2 border-border-px bg-panel-2 p-2">
      <div className="font-pixel text-[8px] text-ink-dim uppercase">{label}</div>
      <div className={`font-pixel text-[13px] mt-1 ${accent ?? "text-ink"}`}>{value}</div>
    </div>
  );
}

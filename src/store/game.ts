"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AttemptRecord,
  Question,
  QuestionProgress,
  RankName,
  RunReport,
} from "@/lib/types";
import {
  computeScore,
  computeXp,
  letterGrade,
  rankForXp,
} from "@/lib/scoring";
import { isLevelUnlocked, LEVELS, QUESTIONS, questionsForLevel } from "@/content";
import { ACHIEVEMENTS } from "@/content/achievements";
import { todayKey, daysBetween, uid } from "@/lib/utils";
import { syncAfterAttempt, syncProfile } from "@/lib/supabase/sync";

export interface AttemptSummary {
  score: number;
  grade: string;
  passed: boolean;
  xpEarned: number;
  testsPassed: number;
  testsTotal: number;
  timeTakenSeconds: number;
  combo: number;
  rankBefore: RankName;
  rankAfter: RankName;
  newAchievements: string[];
  unlockedLevels: number[];
  streakCount: number;
}

interface GameState {
  username: string;
  xp: number;
  combo: number;
  streakCount: number;
  streakFreezes: number;
  lastActiveDay: string | null;
  attempts: AttemptRecord[];
  progress: Record<string, QuestionProgress>;
  achievements: Record<string, string>; // key -> earned ISO date
  revealedSolutions: Record<string, boolean>;
  /** Supabase user id when signed in; null = guest/local-only. */
  userId: string | null;

  setUsername: (name: string) => void;
  setUserId: (id: string | null) => void;
  markSolutionRevealed: (slug: string) => void;
  touchStreak: () => void;
  recordAttempt: (
    question: Question,
    report: RunReport,
    timeTakenSeconds: number
  ) => AttemptSummary;
  isSolved: (slug: string) => boolean;
  hydrateFromRemote: (data: Partial<GameState>) => void;
  resetAll: () => void;
}

const emptyProgress = (): QuestionProgress => ({
  status: "unlocked",
  bestScore: 0,
  timesAttempted: 0,
  lastAttemptedAt: null,
  reviewDueAt: null,
});

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      username: "Hero",
      xp: 0,
      combo: 0,
      streakCount: 0,
      streakFreezes: 1,
      lastActiveDay: null,
      attempts: [],
      progress: {},
      achievements: {},
      revealedSolutions: {},
      userId: null,

      setUsername: (name) => {
        set({ username: name });
        void syncProfile(get());
      },
      setUserId: (id) => set({ userId: id }),

      markSolutionRevealed: (slug) =>
        set((s) => ({
          revealedSolutions: { ...s.revealedSolutions, [slug]: true },
        })),

      touchStreak: () => {
        const s = get();
        const today = todayKey();
        if (s.lastActiveDay === today) return;
        if (s.lastActiveDay === null) {
          set({ streakCount: 1, lastActiveDay: today });
          return;
        }
        const gap = daysBetween(s.lastActiveDay, today);
        if (gap === 1) {
          set({ streakCount: s.streakCount + 1, lastActiveDay: today });
        } else if (gap === 2 && s.streakFreezes > 0) {
          // A streak freeze eats exactly one missed day.
          set({
            streakCount: s.streakCount + 1,
            streakFreezes: s.streakFreezes - 1,
            lastActiveDay: today,
          });
        } else if (gap > 1) {
          set({ streakCount: 1, lastActiveDay: today });
        }
      },

      isSolved: (slug) => get().progress[slug]?.status === "solved",

      recordAttempt: (question, report, timeTakenSeconds) => {
        const state = get();
        state.touchStreak();

        const prev = state.progress[question.slug] ?? emptyProgress();
        const firstTry = prev.timesAttempted === 0;
        const passed = report.ok && report.total > 0;
        const revealed = !!state.revealedSolutions[question.slug];

        const score = computeScore({
          testsPassed: report.passed,
          testsTotal: report.total,
          timeTakenSeconds,
          timeLimitSeconds: question.timeLimitSeconds,
          firstTry,
        });

        const combo = passed ? get().combo + 1 : 0;
        const firstSolve = passed && prev.status !== "solved";
        const xpEarned = passed
          ? computeXp({
              difficulty: question.difficulty,
              score,
              firstSolve,
              combo: combo - 1,
            })
          : 0;

        const rankBefore = rankForXp(state.xp);
        const xp = state.xp + xpEarned;
        const rankAfter = rankForXp(xp);

        const now = new Date();
        const attempt: AttemptRecord = {
          id: uid(),
          questionSlug: question.slug,
          code: "",
          passed,
          score,
          testsPassed: report.passed,
          testsTotal: report.total,
          timeTakenSeconds,
          xpEarned,
          submittedAt: now.toISOString(),
        };

        // Spaced repetition: failures come back tomorrow, hint-assisted
        // solves in 3 days, clean solves leave the queue.
        let reviewDueAt: string | null = null;
        if (!passed) reviewDueAt = new Date(now.getTime() + 86_400_000).toISOString();
        else if (revealed) reviewDueAt = new Date(now.getTime() + 3 * 86_400_000).toISOString();

        const progress: QuestionProgress = {
          status: passed ? "solved" : prev.status === "solved" ? "solved" : "unlocked",
          bestScore: Math.max(prev.bestScore, score),
          timesAttempted: prev.timesAttempted + 1,
          lastAttemptedAt: now.toISOString(),
          reviewDueAt,
        };

        const prevUnlocked = LEVELS.filter((l) =>
          isLevelUnlocked(l.level, state.xp, state.isSolved)
        ).map((l) => l.level);

        set((s) => ({
          xp,
          combo,
          attempts: [...s.attempts, attempt].slice(-500),
          progress: { ...s.progress, [question.slug]: progress },
        }));

        const after = get();
        const nowUnlocked = LEVELS.filter((l) =>
          isLevelUnlocked(l.level, after.xp, after.isSolved)
        ).map((l) => l.level);
        const unlockedLevels = nowUnlocked.filter((l) => !prevUnlocked.includes(l));

        const newAchievements = evaluateAchievements(after, {
          question,
          passed,
          score,
          timeTakenSeconds,
          revealed,
          unlockedLevels,
        });
        if (newAchievements.length > 0) {
          const earned = { ...after.achievements };
          const iso = now.toISOString();
          for (const k of newAchievements) earned[k] = iso;
          set({ achievements: earned });
        }

        void syncAfterAttempt(get(), attempt, question.slug);

        return {
          score,
          grade: letterGrade(score),
          passed,
          xpEarned,
          testsPassed: report.passed,
          testsTotal: report.total,
          timeTakenSeconds,
          combo,
          rankBefore,
          rankAfter,
          newAchievements,
          unlockedLevels,
          streakCount: get().streakCount,
        };
      },

      hydrateFromRemote: (data) => set((s) => ({ ...s, ...data })),

      resetAll: () =>
        set({
          xp: 0,
          combo: 0,
          streakCount: 0,
          streakFreezes: 1,
          lastActiveDay: null,
          attempts: [],
          progress: {},
          achievements: {},
          revealedSolutions: {},
        }),
    }),
    { name: "aceloop-game" }
  )
);

function evaluateAchievements(
  s: GameState,
  ctx: {
    question: Question;
    passed: boolean;
    score: number;
    timeTakenSeconds: number;
    revealed: boolean;
    unlockedLevels: number[];
  }
): string[] {
  const earned: string[] = [];
  const has = (k: string) => k in s.achievements || earned.includes(k);
  const grant = (k: string) => {
    if (!has(k)) earned.push(k);
  };

  const solvedSlugs = Object.entries(s.progress)
    .filter(([, p]) => p.status === "solved")
    .map(([slug]) => slug);
  const solvedQuestions = QUESTIONS.filter((q) => solvedSlugs.includes(q.slug));

  if (ctx.passed) {
    grant("first-blood");
    if (ctx.timeTakenSeconds < 300) grant("speed-demon");
    if (!ctx.revealed) grant("no-hints");
    if (ctx.score >= 100) grant("perfect-score");
    if (s.combo >= 3) grant("combo-3");
    if (s.combo >= 5) grant("combo-5");
    const hour = new Date().getHours();
    if (hour < 5) grant("night-owl");
  }
  if (s.streakCount >= 7) grant("streak-7");
  if (s.streakCount >= 30) grant("streak-30");
  if (solvedQuestions.filter((q) => q.category === "frontend").length >= 5)
    grant("frontend-five");
  if (solvedQuestions.filter((q) => q.category === "dsa").length >= 10)
    grant("dsa-ten");
  if (ctx.unlockedLevels.includes(3)) grant("level-3");
  if (rankForXp(s.xp) !== "Bronze" && ["Gold", "Platinum", "Diamond", "Master"].includes(rankForXp(s.xp)))
    grant("rank-gold");

  for (const pattern of ["Sliding Window", "Two Pointers", "Dynamic Programming"]) {
    const key = `pattern-${pattern.toLowerCase().replace(/\s+/g, "-")}`;
    const all = QUESTIONS.filter((q) => q.pattern === pattern);
    if (all.length > 0 && all.every((q) => solvedSlugs.includes(q.slug))) grant(key);
  }

  return earned.filter((k) => ACHIEVEMENTS.some((a) => a.key === k));
}

/** Questions due for spaced-repetition review. */
export function selectReviewQueue(s: Pick<GameState, "progress">): string[] {
  const now = Date.now();
  return Object.entries(s.progress)
    .filter(([, p]) => p.reviewDueAt !== null && new Date(p.reviewDueAt).getTime() <= now)
    .map(([slug]) => slug);
}

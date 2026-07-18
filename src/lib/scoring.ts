import type { Difficulty, RankName } from "./types";

/** Score = test pass % (70) + speed bonus (20) + first-try bonus (10). */
export function computeScore(opts: {
  testsPassed: number;
  testsTotal: number;
  timeTakenSeconds: number;
  timeLimitSeconds: number;
  firstTry: boolean;
}): number {
  const passRatio = opts.testsTotal === 0 ? 0 : opts.testsPassed / opts.testsTotal;
  const testPoints = passRatio * 70;

  // Full speed bonus under 40% of the limit, scaling to 0 at the limit.
  const t = Math.min(1, opts.timeTakenSeconds / Math.max(1, opts.timeLimitSeconds));
  const speedRatio = t <= 0.4 ? 1 : Math.max(0, (1 - t) / 0.6);
  // Speed only counts if the solution actually works.
  const speedPoints = passRatio === 1 ? speedRatio * 20 : 0;

  const firstTryPoints = opts.firstTry && passRatio === 1 ? 10 : 0;

  return Math.round(testPoints + speedPoints + firstTryPoints);
}

export function letterGrade(score: number): string {
  if (score >= 97) return "S";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 55) return "D";
  return "F";
}

const XP_BASE: Record<Difficulty, number> = { easy: 50, medium: 100, hard: 175 };

export function computeXp(opts: {
  difficulty: Difficulty;
  score: number;
  firstSolve: boolean;
  combo: number;
}): number {
  const base = XP_BASE[opts.difficulty] * (opts.score / 100);
  const comboMult = 1 + Math.min(opts.combo, 5) * 0.1;
  const repeatMult = opts.firstSolve ? 1 : 0.25;
  return Math.round(base * comboMult * repeatMult);
}

export const RANKS: { name: RankName; minXp: number }[] = [
  { name: "Bronze", minXp: 0 },
  { name: "Silver", minXp: 300 },
  { name: "Gold", minXp: 800 },
  { name: "Platinum", minXp: 1600 },
  { name: "Diamond", minXp: 2800 },
  { name: "Master", minXp: 4500 },
];

export function rankForXp(xp: number): RankName {
  let current: RankName = "Bronze";
  for (const r of RANKS) if (xp >= r.minXp) current = r.name;
  return current;
}

export function nextRank(xp: number): { name: RankName; minXp: number } | null {
  for (const r of RANKS) if (xp < r.minXp) return r;
  return null;
}

/** Coaching line for the report screen. */
export function coachingFeedback(opts: {
  passed: number;
  total: number;
  failedLabels: string[];
  timeTakenSeconds: number;
  timeLimitSeconds: number;
}): string {
  const { passed, total, failedLabels } = opts;
  if (total === 0) return "No tests ran — check your code for syntax errors.";
  if (passed === total) {
    const fast = opts.timeTakenSeconds < opts.timeLimitSeconds * 0.4;
    return fast
      ? `Flawless — all ${total} tests passed with a big speed bonus. Interview-ready pace.`
      : `All ${total} tests passed. Next goal: solve it faster for the full speed bonus.`;
  }
  if (passed === 0) {
    return `0/${total} passed — re-read the problem statement and try the sample cases by hand before coding.`;
  }
  const edge = failedLabels.slice(0, 3).join(", ");
  return `Passed ${passed}/${total} — you missed: ${edge}. Walk through those inputs line by line; edge cases are where interviews are won.`;
}

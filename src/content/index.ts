import type { Question } from "@/lib/types";
import { dsaQuestions } from "./questions/dsa";
import { frontendQuestions } from "./questions/frontend";

export const QUESTIONS: Question[] = [...dsaQuestions, ...frontendQuestions];

const bySlug = new Map(QUESTIONS.map((q) => [q.slug, q]));

export function getQuestion(slug: string): Question | undefined {
  return bySlug.get(slug);
}

export interface LevelMeta {
  level: number;
  name: string;
  tagline: string;
  /** XP required (in addition to prior-level clear rate) to unlock. */
  xpRequired: number;
}

export const LEVELS: LevelMeta[] = [
  { level: 1, name: "Novice Meadows", tagline: "Where every hero writes their first loop.", xpRequired: 0 },
  { level: 2, name: "Binary Forest", tagline: "The trees here split in two. Search wisely.", xpRequired: 150 },
  { level: 3, name: "Hashmap Hollow", tagline: "O(1) lookups echo through the caves.", xpRequired: 400 },
  { level: 4, name: "Recursion Ruins", tagline: "To understand the ruins, first understand the ruins.", xpRequired: 800 },
  { level: 5, name: "Graph Grotto", tagline: "Every path connects. Some flood. Some burn.", xpRequired: 1400 },
  { level: 6, name: "Big-O Castle", tagline: "The final boss punishes quadratic heroes.", xpRequired: 2200 },
];

export function questionsForLevel(level: number): Question[] {
  return QUESTIONS.filter((q) => q.level === level);
}

/** Fraction of a level's questions that must be solved to open the next. */
export const LEVEL_CLEAR_RATIO = 0.6;

export function isLevelUnlocked(
  level: number,
  xp: number,
  isSolved: (slug: string) => boolean
): boolean {
  if (level <= 1) return true;
  const meta = LEVELS.find((l) => l.level === level);
  if (!meta || xp < meta.xpRequired) return false;
  const prev = questionsForLevel(level - 1);
  if (prev.length === 0) return true;
  const solved = prev.filter((q) => isSolved(q.slug)).length;
  return solved >= Math.ceil(prev.length * LEVEL_CLEAR_RATIO);
}

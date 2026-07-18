export type Category = "dsa" | "frontend" | "system";
export type Difficulty = "easy" | "medium" | "hard";
export type EditorType = "monaco" | "sandpack";

export interface TestCase {
  /** Arguments passed to the user's function, in order. */
  input: unknown[];
  expected: unknown;
  /** Hidden cases only run on Submit, visible ones on Run. */
  hidden: boolean;
  label?: string;
}

export interface SandpackSpec {
  /** Starter files keyed by path, e.g. { "/App.js": "..." } */
  files: Record<string, string>;
  /** Model solution files shown on reveal. */
  solutionFiles: Record<string, string>;
  /** Jest-style test file content (run by SandpackTests). */
  testCode: string;
}

export interface Question {
  slug: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  /** Tier 1..6 on the level map. */
  level: number;
  promptMd: string;
  starterCode: string;
  /** Name of the function the harness calls (monaco questions). */
  functionName: string;
  solutionCode: string;
  solutionMd: string;
  lessonMd: string;
  testCases: TestCase[];
  /** Transferable pattern, e.g. "Two Pointers", "Sliding Window". */
  pattern: string;
  tags: string[];
  timeLimitSeconds: number;
  editorType: EditorType;
  /**
   * "strict" (default): deep-equal. "any": arrays are canonicalized
   * (recursively sorted) before comparison, for answers where element
   * order doesn't matter (e.g. Group Anagrams, Top-K Frequent).
   */
  resultOrder?: "strict" | "any";
  sandpack?: SandpackSpec;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  /** Alternate strings that should also match when cross-linking inline. */
  aliases: string[];
  definition: string;
  whyItExists: string;
  purpose: string;
  whenToUse: string;
  relatedTerms: string[];
  category: "fundamentals" | "javascript" | "react" | "performance" | "architecture";
}

export interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: string;
}

export type QuestionStatus = "locked" | "unlocked" | "solved";

export interface QuestionProgress {
  status: QuestionStatus;
  bestScore: number;
  timesAttempted: number;
  lastAttemptedAt: string | null;
  /** Failed or hint-assisted solves resurface for spaced repetition. */
  reviewDueAt: string | null;
}

export interface AttemptRecord {
  id: string;
  questionSlug: string;
  code: string;
  passed: boolean;
  score: number;
  testsPassed: number;
  testsTotal: number;
  timeTakenSeconds: number;
  xpEarned: number;
  submittedAt: string;
}

export type RankName =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master";

export interface CaseResult {
  label: string;
  passed: boolean;
  input: unknown[];
  expected: unknown;
  actual: unknown;
  error?: string;
  hidden: boolean;
}

export interface RunReport {
  ok: boolean;
  results: CaseResult[];
  passed: number;
  total: number;
  /** Compile/setup error (syntax error, missing function, timeout). */
  fatalError?: string;
  durationMs: number;
}

export interface CharacterConfig {
  hairStyle: "spiky" | "bowl" | "long" | "mohawk" | "bald";
  hairColor: string;
  skinTone: string;
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  weapon: "none" | "laptop" | "keyboard" | "coffee" | "sword" | "wand";
}

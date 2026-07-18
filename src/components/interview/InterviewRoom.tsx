"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Question, RunReport } from "@/lib/types";
import { runTests } from "@/lib/runner";
import { useCountdown } from "./useCountdown";
import { TestResults } from "./TestResults";
import { ReportModal } from "./ReportModal";
import { useGame, type AttemptSummary } from "@/store/game";
import { isLevelUnlocked, questionsForLevel, LEVELS } from "@/content";
import { formatClock, cn } from "@/lib/utils";
import { Markdown } from "@/components/Markdown";
import { PixelButton, PixelBadge, PixelPanel } from "@/components/ui/pixel";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full grid place-items-center font-pixel text-[10px] text-ink-dim">
      LOADING EDITOR<span className="blink">…</span>
    </div>
  ),
});

import { SandpackRoom } from "./SandpackRoom";

export interface SandpackResultsHandle {
  passed: number;
  total: number;
  ran: boolean;
}

const TIMER_CHOICES = [
  { label: "15 min", seconds: 15 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "45 min", seconds: 45 * 60 },
];

export function InterviewRoom({ question }: { question: Question }) {
  const game = useGame();
  const [phase, setPhase] = useState<"brief" | "live">("brief");
  const [limit, setLimit] = useState(question.timeLimitSeconds);
  const [code, setCode] = useState(question.starterCode);
  const [running, setRunning] = useState(false);
  const [runReport, setRunReport] = useState<RunReport | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<AttemptSummary | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const sandpackResults = useRef<SandpackResultsHandle>({ passed: 0, total: 0, ran: false });
  const codeRef = useRef(code);
  codeRef.current = code;
  // Stable identity: SandpackRoom is memoized and must not re-render on
  // timer ticks, or its tests client never finishes initializing.
  const handleSandpackResults = useCallback((r: SandpackResultsHandle) => {
    sandpackResults.current = r;
  }, []);

  const unlocked = isLevelUnlocked(question.level, game.xp, game.isSolved);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (running) return;
      setRunning(true);
      let report: RunReport;
      if (question.editorType === "monaco") {
        report = await runTests({
          code: codeRef.current,
          functionName: question.functionName,
          cases: question.testCases,
          resultOrder: question.resultOrder,
        });
      } else {
        const r = sandpackResults.current;
        report = {
          ok: r.ran && r.total > 0 && r.passed === r.total,
          results: [],
          passed: r.passed,
          total: r.total,
          fatalError:
            !r.ran && !auto
              ? "Run the tests panel at least once before submitting."
              : undefined,
          durationMs: 0,
        };
        if (report.fatalError !== undefined) {
          setRunReport(report);
          setRunning(false);
          return;
        }
      }
      setRunReport(report);
      setSubmitted(true);
      const s = game.recordAttempt(question, report, Math.round(elapsedRef.current));
      setSummary(s);
      setRunning(false);
    },
    [question, running, game]
  );

  const { secondsLeft, elapsedSeconds, warn50, warn90 } = useCountdown({
    totalSeconds: limit,
    running: phase === "live" && summary === null,
    onExpire: () => void handleSubmit(true),
  });
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsedSeconds;

  const handleRun = useCallback(async () => {
    if (running || question.editorType !== "monaco") return;
    setRunning(true);
    setSubmitted(false);
    const report = await runTests({
      code: codeRef.current,
      functionName: question.functionName,
      cases: question.testCases.filter((c) => !c.hidden),
      resultOrder: question.resultOrder,
    });
    setRunReport(report);
    setRunning(false);
  }, [question, running]);

  const nextSlug = useMemo(() => {
    const candidates = [
      ...questionsForLevel(question.level),
      ...LEVELS.filter((l) => l.level > question.level).flatMap((l) =>
        questionsForLevel(l.level)
      ),
    ];
    return (
      candidates.find((q) => q.slug !== question.slug && !game.isSolved(q.slug))
        ?.slug ?? null
    );
  }, [question, game]);

  if (!unlocked) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <PixelPanel title="🔒 Area Locked" className="max-w-md text-center">
          <p className="text-ink-dim">
            This challenge lives in a region you haven&apos;t unlocked yet. Clear
            more quests in earlier levels to open the path.
          </p>
          <Link href="/arena" className="inline-block mt-4">
            <PixelButton>Back to Level Map</PixelButton>
          </Link>
        </PixelPanel>
      </div>
    );
  }

  // ---- Pre-start briefing ----
  if (phase === "brief") {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pixel-border bg-panel max-w-xl w-full p-6"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <PixelBadge color={question.difficulty === "easy" ? "green" : question.difficulty === "medium" ? "gold" : "red"}>
              {question.difficulty}
            </PixelBadge>
            <PixelBadge color="blue">{question.category}</PixelBadge>
            <PixelBadge color="dim">Lv.{question.level}</PixelBadge>
          </div>
          <h1 className="font-pixel text-gold-2 text-lg mt-4 leading-relaxed">
            {question.title}
          </h1>
          <p className="text-ink-dim mt-2">
            An interviewer sits across the table. The clock starts when you do.
            Run sample tests as often as you like — Submit runs the hidden set.
          </p>
          <div className="mt-5">
            <div className="font-pixel text-[9px] text-ink-dim uppercase mb-2">
              Session Timer
            </div>
            <div className="flex gap-2 flex-wrap">
              <PixelButton
                size="sm"
                variant={limit === question.timeLimitSeconds ? "gold" : "ghost"}
                onClick={() => setLimit(question.timeLimitSeconds)}
              >
                Suggested {Math.round(question.timeLimitSeconds / 60)}m
              </PixelButton>
              {TIMER_CHOICES.map((c) => (
                <PixelButton
                  key={c.seconds}
                  size="sm"
                  variant={limit === c.seconds ? "gold" : "ghost"}
                  onClick={() => setLimit(c.seconds)}
                >
                  {c.label}
                </PixelButton>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <PixelButton variant="green" size="lg" onClick={() => setPhase("live")}>
              ▶ Start Interview
            </PixelButton>
            <Link href="/arena">
              <PixelButton variant="ghost" size="lg">
                Retreat
              </PixelButton>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- Live interview room ----
  const timerColor = warn90 ? "text-hp" : warn50 ? "text-gold" : "text-xpbar";

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-2 bg-panel border-b-4 border-border-px shrink-0">
        <Link href="/arena" className="font-pixel text-[9px] text-ink-dim hover:text-hp">
          ✕ QUIT
        </Link>
        <span className="font-pixel text-[10px] text-ink truncate">{question.title}</span>
        <span className="ml-auto" />
        {warn90 && summary === null && (
          <span className="font-pixel text-[9px] text-hp blink">HURRY!</span>
        )}
        <span
          className={cn("font-pixel text-sm tabular-nums", timerColor, warn90 && "blink")}
          aria-live="polite"
        >
          ⏱ {formatClock(secondsLeft)}
        </span>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Prompt */}
        <div className="lg:w-[42%] overflow-y-auto p-4 border-b-4 lg:border-b-0 lg:border-r-4 border-border-px max-h-[45vh] lg:max-h-none">
          <Markdown source={question.promptMd} linkTerms />
          {runReport !== null && (
            <div className="mt-4">
              <TestResults report={runReport} submitted={submitted} />
            </div>
          )}
          {showSolution && (
            <div className="mt-4 border-4 border-purple bg-panel p-3">
              <div className="font-pixel text-[10px] text-purple mb-2">MODEL SOLUTION</div>
              <Markdown source={question.solutionMd} />
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 flex flex-col">
          {question.editorType === "monaco" ? (
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v ?? "")}
                onMount={(editor) => {
                  // Test/automation hook (harmless in production).
                  (window as unknown as Record<string, unknown>).__aceloopEditor = editor;
                }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  tabSize: 2,
                }}
              />
            </div>
          ) : (
            <SandpackRoom
              question={question}
              showSolution={showSolution}
              onResults={handleSandpackResults}
            />
          )}

          <div className="flex items-center gap-2 p-3 bg-panel border-t-4 border-border-px shrink-0">
            {question.editorType === "monaco" ? (
              <PixelButton variant="blue" onClick={() => void handleRun()} disabled={running}>
                {running ? "Running…" : "▶ Run Samples"}
              </PixelButton>
            ) : (
              <span className="text-ink-dim text-base">
                Press ▶ in the TESTS panel to run, then submit.
              </span>
            )}
            <PixelButton variant="gold" onClick={() => void handleSubmit()} disabled={running}>
              ⚔ Submit
            </PixelButton>
            <span className="ml-auto" />
            <PixelButton
              variant="ghost"
              size="sm"
              onClick={() => {
                game.markSolutionRevealed(question.slug);
                setShowSolution(true);
              }}
            >
              Reveal Solution
            </PixelButton>
          </div>
        </div>
      </div>

      {summary !== null && (
        <ReportModal
          summary={summary}
          question={question}
          failedLabels={
            runReport?.results.filter((r) => !r.passed).map((r) => r.label) ?? []
          }
          nextSlug={nextSlug}
          onRevealSolution={() => {
            game.markSolutionRevealed(question.slug);
            setShowSolution(true);
            setSummary(null);
          }}
          onClose={() => {
            setSummary(null);
            setSubmitted(false);
          }}
        />
      )}
    </div>
  );
}

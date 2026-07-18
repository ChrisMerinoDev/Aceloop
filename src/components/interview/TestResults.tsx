"use client";

import type { RunReport } from "@/lib/types";
import { cn } from "@/lib/utils";

const show = (v: unknown) => {
  const s = JSON.stringify(v);
  return s !== undefined && s.length > 120 ? s.slice(0, 120) + "…" : s ?? "undefined";
};

export function TestResults({ report, submitted }: { report: RunReport; submitted: boolean }) {
  if (report.fatalError !== undefined) {
    return (
      <div className="border-4 border-hp bg-panel-2 p-3">
        <div className="font-pixel text-[10px] text-hp mb-1">RUNTIME ERROR</div>
        <pre className="text-hp text-base whitespace-pre-wrap">{report.fatalError}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="font-pixel text-[10px] mb-2">
        <span className={report.ok ? "text-xpbar" : "text-hp"}>
          {report.passed}/{report.total} TESTS PASSED
        </span>
        <span className="text-ink-dim ml-3">{Math.round(report.durationMs)}ms</span>
      </div>
      {report.results.map((r, i) => (
        <div
          key={i}
          className={cn(
            "border-2 px-2 py-1 text-base flex flex-wrap gap-x-3",
            r.passed ? "border-xpbar/40 bg-xpbar/5" : "border-hp/60 bg-hp/10"
          )}
        >
          <span className={cn("font-pixel text-[9px] mt-0.5", r.passed ? "text-xpbar" : "text-hp")}>
            {r.passed ? "PASS" : "FAIL"}
          </span>
          <span className="text-ink-dim">{r.label}</span>
          {!r.passed && (!r.hidden || submitted) && (
            <span className="w-full text-ink-dim break-all">
              input: <span className="text-ink">{show(r.input)}</span>
              {" · "}expected: <span className="text-xpbar">{show(r.expected)}</span>
              {" · "}got:{" "}
              <span className="text-hp">{r.error !== undefined ? r.error : show(r.actual)}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

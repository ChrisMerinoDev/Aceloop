"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import type { SandpackResultsHandle } from "./InterviewRoom";
import { PixelButton } from "@/components/ui/pixel";

/** Recursively counts pass/fail across Sandpack's spec tree. */
function countTests(node: unknown): { passed: number; total: number } {
  let passed = 0;
  let total = 0;
  if (node === null || typeof node !== "object") return { passed, total };
  const rec = node as Record<string, unknown>;

  const tests = rec.tests;
  if (tests !== null && typeof tests === "object") {
    for (const t of Object.values(tests as Record<string, unknown>)) {
      const status = (t as Record<string, unknown>).status;
      if (status === "pass" || status === "fail") {
        total++;
        if (status === "pass") passed++;
      }
    }
  }
  const describes = rec.describes;
  if (describes !== null && typeof describes === "object") {
    for (const d of Object.values(describes as Record<string, unknown>)) {
      const sub = countTests(d);
      passed += sub.passed;
      total += sub.total;
    }
  }
  return { passed, total };
}

export function SandpackRoom({
  question,
  showSolution,
  onResults,
}: {
  question: Question;
  showSolution: boolean;
  onResults: (r: SandpackResultsHandle) => void;
}) {
  const [tab, setTab] = useState<"preview" | "tests">("preview");
  const spec = question.sandpack;

  const files = useMemo(() => {
    if (!spec) return {};
    const base = showSolution ? spec.solutionFiles : spec.files;
    return { ...base, "/App.test.js": spec.testCode };
  }, [spec, showSolution]);

  if (!spec) {
    return (
      <div className="flex-1 grid place-items-center text-hp font-pixel text-[10px]">
        Missing sandpack config for this question.
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SandpackProvider
        key={showSolution ? "solution" : "starter"}
        template="react"
        files={files}
        customSetup={{
          dependencies: {
            "@testing-library/react": "^14.0.0",
            "@testing-library/dom": "^9.3.0",
          },
        }}
        theme="dark"
        options={{ visibleFiles: ["/App.js"], activeFile: "/App.js" }}
      >
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          <div className="flex-1 min-h-[200px]">
            <SandpackCodeEditor
              style={{ height: "100%" }}
              showTabs
              showLineNumbers
              showInlineErrors
            />
          </div>
          <div className="flex-1 min-h-[220px] flex flex-col border-t-4 lg:border-t-0 lg:border-l-4 border-border-px">
            <div className="flex gap-1 p-1 bg-panel">
              <PixelButton
                size="sm"
                variant={tab === "preview" ? "blue" : "ghost"}
                onClick={() => setTab("preview")}
              >
                Preview
              </PixelButton>
              <PixelButton
                size="sm"
                variant={tab === "tests" ? "blue" : "ghost"}
                onClick={() => setTab("tests")}
              >
                Tests
              </PixelButton>
            </div>
            <div className="flex-1 min-h-0" style={{ display: tab === "preview" ? "block" : "none" }}>
              <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} />
            </div>
            <div className="flex-1 min-h-0" style={{ display: tab === "tests" ? "block" : "none" }}>
              <SandpackTests
                style={{ height: "100%" }}
                onComplete={(specs) => {
                  let passed = 0;
                  let total = 0;
                  for (const s of Object.values(specs)) {
                    const c = countTests(s);
                    passed += c.passed;
                    total += c.total;
                  }
                  onResults({ passed, total, ran: total > 0 });
                }}
              />
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}

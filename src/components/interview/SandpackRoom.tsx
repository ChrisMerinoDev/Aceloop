"use client";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { memo, useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import type { SandpackResultsHandle } from "./InterviewRoom";
import { PixelButton } from "@/components/ui/pixel";
import { TestsPanel } from "./TestsPanel";

/**
 * Memoized: the interview room re-renders 4x/second for the countdown, and
 * re-rendering SandpackProvider that often keeps the tests client stuck in
 * "initialising" forever. Props must stay referentially stable.
 */
export const SandpackRoom = memo(function SandpackRoom({
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
        options={{
          visibleFiles: ["/App.js"],
          activeFile: "/App.js",
          // The tests client renders a hidden iframe; lazy init would never
          // fire for it, so initialize all clients immediately.
          initMode: "immediate",
        }}
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
            {/* Both stay laid out (hidden via visibility, not display:none) so
                the tests client's hidden iframe can initialize. */}
            <div className="flex-1 min-h-0 relative">
              <div
                className="absolute inset-0"
                style={{
                  visibility: tab === "preview" ? "visible" : "hidden",
                  zIndex: tab === "preview" ? 1 : 0,
                }}
              >
                <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  visibility: tab === "tests" ? "visible" : "hidden",
                  zIndex: tab === "tests" ? 1 : 0,
                }}
              >
                <TestsPanel onResults={onResults} />
              </div>
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
})

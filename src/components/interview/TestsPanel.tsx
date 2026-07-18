"use client";

import { useEffect, useRef, useState } from "react";
import { useSandpackClient } from "@codesandbox/sandpack-react";
import { PixelButton } from "@/components/ui/pixel";
import { cn } from "@/lib/utils";
import type { SandpackResultsHandle } from "./InterviewRoom";

interface TestRow {
  name: string;
  status: "pass" | "fail";
  error?: string;
}

/**
 * Custom test runner panel. We drive the Sandpack client ourselves instead of
 * using <SandpackTests>: its built-in auto-run drops its dispatch when the
 * provider mounts from a click (client not yet registered), leaving the panel
 * stuck on "initialising" forever. Listening on our own client and dispatching
 * from inside the listener can't race.
 */
export function TestsPanel({
  onResults,
}: {
  onResults: (r: SandpackResultsHandle) => void;
}) {
  const { iframe } = useSandpackClient();
  const [status, setStatus] = useState<"boot" | "running" | "done">("boot");
  const [rows, setRows] = useState<TestRow[]>([]);
  // Keyed by test name: overlapping runs (e.g. StrictMode double-compile)
  // converge instead of double-counting.
  const collected = useRef<Map<string, TestRow>>(new Map());
  const protocolId = useRef<unknown>(null);
  const onResultsRef = useRef(onResults);
  onResultsRef.current = onResults;

  // Post directly into our iframe with the protocol's $id — the React-layer
  // dispatch reads a client registry that is empty when the provider mounts
  // from a click (upstream bug), so we talk to the bundler ourselves.
  const runAll = () => {
    const win = iframe.current?.contentWindow;
    if (!win) return;
    setStatus("running");
    win.postMessage(
      { type: "run-all-tests", $id: protocolId.current, codesandbox: true },
      "*"
    );
  };
  const runAllRef = useRef(runAll);
  runAllRef.current = runAll;

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // Only handle messages coming from our own hidden iframe.
      if (!iframe.current || e.source !== iframe.current.contentWindow) return;
      const m = e.data as {
        type?: string;
        event?: string;
        $id?: unknown;
        test?: { name: string; status?: string; errors?: unknown[]; blocks?: string[] };
      };
      if (!m || m.type !== "test") return;
      if (m.$id !== undefined) protocolId.current = m.$id;

      switch (m.event) {
        case "initialize_tests":
          // Bundle (re)compiled with the jest runtime ready — run everything.
          collected.current = new Map();
          runAllRef.current();
          break;
        case "total_test_start":
          collected.current = new Map();
          setStatus("running");
          break;
        case "test_end": {
          const t = m.test;
          if (!t) break;
          const failed = t.status === "fail";
          const firstError = failed
            ? String(
                (t.errors?.[0] as { message?: string } | undefined)?.message ??
                  t.errors?.[0] ??
                  "failed"
              )
            : undefined;
          const name = [...(t.blocks ?? []), t.name].join(" › ");
          collected.current.set(name, {
            name,
            status: failed ? "fail" : "pass",
            error: firstError,
          });
          break;
        }
        case "total_test_end": {
          const done = [...collected.current.values()];
          setRows(done);
          setStatus("done");
          const passed = done.filter((r) => r.status === "pass").length;
          onResultsRef.current({ passed, total: done.length, ran: done.length > 0 });
          break;
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframe]);

  const passed = rows.filter((r) => r.status === "pass").length;

  return (
    <div className="h-full flex flex-col bg-[#101020]">
      {/* The client renders into this hidden iframe. */}
      <iframe ref={iframe} style={{ display: "none" }} title="Test runner" />
      <div className="flex items-center gap-2 p-2 border-b-2 border-border-px shrink-0">
        <PixelButton
          size="sm"
          variant="green"
          disabled={status === "running"}
          onClick={runAll}
        >
          {status === "running" ? "Running…" : "▶ Run Tests"}
        </PixelButton>
        {status === "done" && (
          <span
            className={cn(
              "font-pixel text-[9px]",
              passed === rows.length ? "text-xpbar" : "text-hp"
            )}
          >
            {passed}/{rows.length} PASSED
          </span>
        )}
        {status === "boot" && (
          <span className="font-pixel text-[8px] text-ink-dim">
            BOOTING TEST RUNNER<span className="blink">…</span>
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {status === "boot" && (
          <p className="text-ink-dim">
            Installing dependencies and compiling — tests run automatically in
            a moment (needs network for the Sandpack bundler).
          </p>
        )}
        {rows.map((r, i) => (
          <div
            key={i}
            className={cn(
              "border-2 px-2 py-1 text-base",
              r.status === "pass"
                ? "border-xpbar/40 bg-xpbar/5"
                : "border-hp/60 bg-hp/10"
            )}
          >
            <span
              className={cn(
                "font-pixel text-[8px] mr-2",
                r.status === "pass" ? "text-xpbar" : "text-hp"
              )}
            >
              {r.status === "pass" ? "PASS" : "FAIL"}
            </span>
            {r.name}
            {r.error !== undefined && (
              <div className="text-hp text-sm mt-1 whitespace-pre-wrap break-words">
                {r.error.slice(0, 300)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

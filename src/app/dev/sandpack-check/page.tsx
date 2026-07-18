"use client";

// Isolation harness for the Sandpack tests pipeline (not linked from the app).
// Mounts the real SandpackRoom behind a click, exactly like the interview
// room does — the mount-from-click path is what once broke SandpackTests'
// auto-run upstream, so keep exercising it here when touching SandpackRoom.

import { useCallback, useState } from "react";
import { SandpackRoom } from "@/components/interview/SandpackRoom";
import { getQuestion } from "@/content";

export default function SandpackCheck() {
  const q = getQuestion("controlled-input");
  const [live, setLive] = useState(false);

  const onResults = useCallback((r: unknown) => {
    (window as unknown as Record<string, unknown>).__results = r;
    console.log("RESULTS", JSON.stringify(r));
  }, []);

  if (!q) return <div>question missing</div>;
  if (!live) {
    return (
      <button onClick={() => setLive(true)} style={{ padding: 20 }}>
        start interview
      </button>
    );
  }
  return (
    <div style={{ height: "85vh", display: "flex", flexDirection: "column" }}>
      <SandpackRoom question={q} showSolution={false} onResults={onResults} />
    </div>
  );
}

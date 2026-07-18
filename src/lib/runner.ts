import type { CaseResult, RunReport, TestCase } from "./types";

/**
 * Runs user code against test cases inside a Web Worker built from a Blob,
 * so nothing touches the page context and infinite loops can be killed by
 * terminating the worker.
 */
export function runTests(opts: {
  code: string;
  functionName: string;
  cases: TestCase[];
  resultOrder?: "strict" | "any";
  timeoutMs?: number;
}): Promise<RunReport> {
  const { code, functionName, cases } = opts;
  const timeoutMs = opts.timeoutMs ?? Math.max(3000, cases.length * 400);
  const started = performance.now();

  const workerSource = `
"use strict";
${HARNESS_HELPERS}
self.onmessage = async (e) => {
  const { code, functionName, cases, anyOrder } = e.data;
  let fn;
  try {
    fn = new Function(code + "\\n;return typeof " + functionName + " === 'function' ? " + functionName + " : null;")();
  } catch (err) {
    self.postMessage({ fatalError: "Your code failed to load: " + (err && err.message ? err.message : String(err)) });
    return;
  }
  if (!fn) {
    self.postMessage({ fatalError: "Function '" + functionName + "' was not found. Keep the starter function name." });
    return;
  }
  const results = [];
  for (const c of cases) {
    const args = clone(c.input);
    let actual, error;
    try {
      actual = fn.apply(null, args);
      if (actual && typeof actual.then === "function") actual = await actual;
    } catch (err) {
      error = err && err.message ? err.message : String(err);
    }
    const passed = error === undefined && deepEqual(
      anyOrder ? canonicalize(actual) : actual,
      anyOrder ? canonicalize(c.expected) : c.expected
    );
    results.push({
      label: c.label || "case",
      passed,
      input: c.input,
      expected: c.expected,
      actual: error === undefined ? sanitize(actual) : null,
      error,
      hidden: c.hidden,
    });
  }
  self.postMessage({ results });
};
`;

  return new Promise<RunReport>((resolve) => {
    const blobUrl = URL.createObjectURL(
      new Blob([workerSource], { type: "text/javascript" })
    );
    const worker = new Worker(blobUrl);
    let settled = false;

    const finish = (report: RunReport) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve(report);
    };

    const timer = setTimeout(() => {
      finish({
        ok: false,
        results: [],
        passed: 0,
        total: cases.length,
        fatalError: `Time limit exceeded (${(timeoutMs / 1000).toFixed(1)}s) — check for an infinite loop.`,
        durationMs: performance.now() - started,
      });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent) => {
      clearTimeout(timer);
      const data = e.data as { fatalError?: string; results?: CaseResult[] };
      if (data.fatalError !== undefined || !data.results) {
        finish({
          ok: false,
          results: [],
          passed: 0,
          total: cases.length,
          fatalError: data.fatalError ?? "Unknown worker error.",
          durationMs: performance.now() - started,
        });
        return;
      }
      const passed = data.results.filter((r) => r.passed).length;
      finish({
        ok: passed === data.results.length,
        results: data.results,
        passed,
        total: data.results.length,
        durationMs: performance.now() - started,
      });
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      finish({
        ok: false,
        results: [],
        passed: 0,
        total: cases.length,
        fatalError: e.message || "Worker crashed while running your code.",
        durationMs: performance.now() - started,
      });
    };

    worker.postMessage({
      code,
      functionName,
      cases,
      anyOrder: opts.resultOrder === "any",
    });
  });
}

/** Helper functions injected into the worker source. */
const HARNESS_HELPERS = `
function clone(v) {
  if (v === null || typeof v !== "object") return v;
  return JSON.parse(JSON.stringify(v));
}
function sanitize(v) {
  if (v === undefined) return null;
  try { return JSON.parse(JSON.stringify(v)); } catch { return String(v); }
}
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
  return true;
}
function canonicalize(v) {
  if (Array.isArray(v)) {
    const mapped = v.map(canonicalize);
    return mapped.sort((x, y) => {
      const sx = JSON.stringify(x), sy = JSON.stringify(y);
      return sx < sy ? -1 : sx > sy ? 1 : 0;
    });
  }
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = canonicalize(v[k]);
    return out;
  }
  return v;
}
`;

"use client";

import Link from "next/link";
import { useState } from "react";
import { QUESTIONS } from "@/content";
import { PixelBadge, PixelInput } from "@/components/ui/pixel";
import { cn } from "@/lib/utils";

export default function LearnIndexPage() {
  const [query, setQuery] = useState("");
  const [pattern, setPattern] = useState<string | null>(null);

  const patterns = [...new Set(QUESTIONS.map((q) => q.pattern))].sort();
  const filtered = QUESTIONS.filter((q) => {
    const matchesQuery =
      query === "" ||
      q.title.toLowerCase().includes(query.toLowerCase()) ||
      q.tags.some((t) => t.includes(query.toLowerCase()));
    const matchesPattern = pattern === null || q.pattern === pattern;
    return matchesQuery && matchesPattern;
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">SPELLBOOK</h1>
      <p className="text-center text-ink-dim mt-2">
        Every quest, taught step by step — the why, not just the answer.
      </p>

      <div className="mt-8">
        <PixelInput
          placeholder="Search lessons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search lessons"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => setPattern(null)}>
            <PixelBadge color={pattern === null ? "gold" : "dim"}>All</PixelBadge>
          </button>
          {patterns.map((p) => (
            <button key={p} onClick={() => setPattern(p === pattern ? null : p)}>
              <PixelBadge color={pattern === p ? "gold" : "dim"}>{p}</PixelBadge>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {filtered.map((q) => (
          <Link
            key={q.slug}
            href={`/learn/${q.slug}`}
            className={cn(
              "pixel-border bg-panel p-4 flex items-center gap-3 hover:bg-panel-2 transition-colors block"
            )}
          >
            <span className="text-2xl">{q.category === "frontend" ? "🎨" : "📖"}</span>
            <div className="flex-1">
              <div className="text-ink text-lg leading-tight">{q.title}</div>
              <div className="font-pixel text-[8px] text-ink-dim mt-1 uppercase">
                {q.pattern} · Level {q.level}
              </div>
            </div>
            <PixelBadge
              color={q.difficulty === "easy" ? "green" : q.difficulty === "medium" ? "gold" : "red"}
            >
              {q.difficulty}
            </PixelBadge>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-ink-dim py-10">
            No lessons match — try another search.
          </p>
        )}
      </div>
    </main>
  );
}

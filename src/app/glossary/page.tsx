"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { glossaryTerms } from "@/content/glossary";
import { PixelBadge, PixelInput, PixelPanel } from "@/components/ui/pixel";

const CATEGORIES = ["fundamentals", "javascript", "react", "performance", "architecture"] as const;

function GlossaryContent() {
  const params = useSearchParams();
  const highlight = params.get("term");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  const filtered = glossaryTerms.filter((t) => {
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      t.term.toLowerCase().includes(q) ||
      t.aliases.some((a) => a.includes(q)) ||
      t.definition.toLowerCase().includes(q);
    return matchesQuery && (category === null || t.category === category);
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">TOME OF TERMS</h1>
      <p className="text-center text-ink-dim mt-2">
        The advanced words interviewers throw at you — what they are, why they
        exist, and when to reach for them.
      </p>

      <div className="mt-8">
        <PixelInput
          placeholder="Search the tome…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search glossary"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => setCategory(null)}>
            <PixelBadge color={category === null ? "gold" : "dim"}>All</PixelBadge>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c === category ? null : c)}>
              <PixelBadge color={category === c ? "gold" : "dim"}>{c}</PixelBadge>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((t) => (
          <div key={t.id} ref={t.id === highlight ? highlightRef : undefined}>
            <PixelPanel
              className={t.id === highlight ? "border-gold" : undefined}
              title={`📜 ${t.term}`}
            >
              <p className="text-ink">{t.definition}</p>
              <dl className="mt-3 space-y-2">
                <div>
                  <dt className="font-pixel text-[8px] text-mp uppercase">Why it exists</dt>
                  <dd className="text-ink-dim">{t.whyItExists}</dd>
                </div>
                <div>
                  <dt className="font-pixel text-[8px] text-mp uppercase">Purpose</dt>
                  <dd className="text-ink-dim">{t.purpose}</dd>
                </div>
                <div>
                  <dt className="font-pixel text-[8px] text-mp uppercase">When to use it</dt>
                  <dd className="text-ink-dim">{t.whenToUse}</dd>
                </div>
              </dl>
              {t.relatedTerms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <span className="font-pixel text-[8px] text-ink-dim uppercase">Related:</span>
                  {t.relatedTerms.map((r) => (
                    <PixelBadge key={r} color="purple">
                      {r}
                    </PixelBadge>
                  ))}
                </div>
              )}
            </PixelPanel>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-ink-dim py-10">Nothing in the tome matches.</p>
        )}
      </div>
    </main>
  );
}

export default function GlossaryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-16 text-center font-pixel text-[10px] text-ink-dim">
          OPENING TOME<span className="blink">…</span>
        </main>
      }
    >
      <GlossaryContent />
    </Suspense>
  );
}

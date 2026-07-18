"use client";

import Link from "next/link";
import { useState } from "react";
import type { GlossaryTerm } from "@/lib/types";

/** Dotted-underline term that reveals its glossary card on hover/tap. */
export function TermPopover({ term, text }: { term: GlossaryTerm; text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="term-link"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`Definition of ${term.term}`}
      >
        {text}
      </button>
      {open && (
        <span className="absolute left-0 top-full z-50 mt-1 block w-72 max-w-[80vw] border-4 border-border-px bg-panel-2 p-3 text-base leading-snug shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
          <span className="font-pixel block text-[9px] uppercase text-gold-2">
            {term.term}
          </span>
          <span className="mt-1 block text-ink">{term.definition}</span>
          <Link
            href={`/glossary?term=${encodeURIComponent(term.id)}`}
            className="font-pixel mt-2 block text-[8px] uppercase text-mp hover:text-gold-2"
          >
            Full entry →
          </Link>
        </span>
      )}
    </span>
  );
}

"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { glossaryTerms } from "@/content/glossary";
import type { GlossaryTerm } from "@/lib/types";
import { TermPopover } from "./TermPopover";
import { cn } from "@/lib/utils";

// term/alias (lowercased) -> glossary entry, longest first so
// "sliding window" wins over "window".
const termIndex: { needle: string; entry: GlossaryTerm }[] = glossaryTerms
  .flatMap((entry) => [
    { needle: entry.term.toLowerCase(), entry },
    ...entry.aliases.map((a) => ({ needle: a.toLowerCase(), entry })),
  ])
  .sort((a, b) => b.needle.length - a.needle.length);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const termRegex = new RegExp(
  `\\b(${termIndex.map((t) => escapeRe(t.needle)).join("|")})\\b`,
  "gi"
);

function linkTermsInText(text: string, keyPrefix: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  let count = 0;
  for (const m of text.matchAll(termRegex)) {
    if (count >= 4) break; // don't over-decorate long paragraphs
    const idx = m.index ?? 0;
    const found = termIndex.find((t) => t.needle === m[0].toLowerCase());
    if (!found) continue;
    parts.push(text.slice(last, idx));
    parts.push(
      <TermPopover key={`${keyPrefix}-${idx}`} term={found.entry} text={m[0]} />
    );
    last = idx + m[0].length;
    count++;
  }
  if (parts.length === 0) return text;
  parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

function LinkedText({ children, id }: { children: ReactNode; id: string }) {
  if (typeof children === "string") return <>{linkTermsInText(children, id)}</>;
  if (Array.isArray(children)) {
    return (
      <>
        {children.map((c, i) =>
          typeof c === "string" ? (
            <Fragment key={i}>{linkTermsInText(c, `${id}-${i}`)}</Fragment>
          ) : (
            <Fragment key={i}>{c}</Fragment>
          )
        )}
      </>
    );
  }
  return <>{children}</>;
}

export function Markdown({
  source,
  linkTerms = false,
  className,
}: {
  source: string;
  /** Wrap known glossary terms with hover definitions. */
  linkTerms?: boolean;
  className?: string;
}) {
  const components = useMemo(() => {
    if (!linkTerms) return {};
    let n = 0;
    return {
      p: ({ children }: { children?: ReactNode }) => (
        <p>
          <LinkedText id={`p${n++}`}>{children}</LinkedText>
        </p>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li>
          <LinkedText id={`li${n++}`}>{children}</LinkedText>
        </li>
      ),
    };
  }, [linkTerms]);

  return (
    <div className={cn("prose-retro", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}

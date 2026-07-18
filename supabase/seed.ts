/**
 * Seeds questions, glossary terms, and achievements into Supabase.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 *
 * Run: npm run seed
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { QUESTIONS } from "../src/content";
import { glossaryTerms } from "../src/content/glossary";
import { ACHIEVEMENTS } from "../src/content/achievements";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const sb = createClient(url, serviceKey);

async function main() {
  console.log(`Seeding ${QUESTIONS.length} questions...`);
  const { error: qErr } = await sb.from("questions").upsert(
    QUESTIONS.map((q) => ({
      slug: q.slug,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      level: q.level,
      prompt_md: q.promptMd,
      starter_code: q.starterCode,
      solution_md: q.solutionMd,
      lesson_md: q.lessonMd,
      test_cases: q.testCases,
      pattern: q.pattern,
      tags: q.tags,
      time_limit_seconds: q.timeLimitSeconds,
      editor_type: q.editorType,
    })),
    { onConflict: "slug" }
  );
  if (qErr) throw qErr;

  console.log(`Seeding ${glossaryTerms.length} glossary terms...`);
  const { error: gErr } = await sb.from("glossary_terms").upsert(
    glossaryTerms.map((t) => ({
      term: t.term,
      definition: t.definition,
      why_it_exists: t.whyItExists,
      purpose: t.purpose,
      when_to_use: t.whenToUse,
      related_terms: t.relatedTerms,
      category: t.category,
    })),
    { onConflict: "term" }
  );
  if (gErr) throw gErr;

  console.log(`Seeding ${ACHIEVEMENTS.length} achievements...`);
  const { error: aErr } = await sb.from("achievements").upsert(
    ACHIEVEMENTS.map((a) => ({
      key: a.key,
      name: a.name,
      description: a.description,
      icon: a.icon,
    })),
    { onConflict: "key" }
  );
  if (aErr) throw aErr;

  console.log("✅ Seed complete.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

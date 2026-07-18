import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestion, QUESTIONS } from "@/content";
import { Markdown } from "@/components/Markdown";
import { PixelBadge, PixelButton, PixelPanel } from "@/components/ui/pixel";

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ slug: q.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-24">
      <div className="flex items-center gap-2 flex-wrap">
        <PixelBadge color={q.difficulty === "easy" ? "green" : q.difficulty === "medium" ? "gold" : "red"}>
          {q.difficulty}
        </PixelBadge>
        <PixelBadge color="blue">{q.pattern}</PixelBadge>
        <PixelBadge color="dim">Level {q.level}</PixelBadge>
      </div>
      <h1 className="font-pixel text-lg text-gold-2 mt-4 leading-relaxed">{q.title}</h1>

      <PixelPanel title="The Quest" className="mt-6">
        <Markdown source={q.promptMd} linkTerms />
      </PixelPanel>

      <PixelPanel title="📖 The Lesson" className="mt-6">
        <Markdown source={q.lessonMd} linkTerms />
      </PixelPanel>

      <PixelPanel title="⚗️ Model Solution" className="mt-6">
        <Markdown source={q.solutionMd} />
      </PixelPanel>

      <div className="mt-8 flex gap-3 justify-center">
        <Link href={`/interview/${q.slug}`}>
          <PixelButton variant="gold" size="lg">
            ⚔ Fight This Quest
          </PixelButton>
        </Link>
        <Link href="/learn">
          <PixelButton variant="ghost" size="lg">
            Back to Spellbook
          </PixelButton>
        </Link>
      </div>
    </main>
  );
}

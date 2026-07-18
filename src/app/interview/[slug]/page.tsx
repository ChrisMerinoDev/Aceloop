import { notFound } from "next/navigation";
import { getQuestion, QUESTIONS } from "@/content";
import { InterviewRoom } from "@/components/interview/InterviewRoom";

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ slug: q.slug }));
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = getQuestion(slug);
  if (!question) notFound();
  return <InterviewRoom question={question} />;
}

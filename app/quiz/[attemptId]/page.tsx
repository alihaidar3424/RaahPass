import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { QuizClient } from "@/components/quiz/QuizClient";
import { getQuizQuestions } from "@/lib/quiz";
import { dirForLanguage } from "@/lib/translations";

type QuizPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const { attemptId } = await params;

  let data;
  try {
    data = await getQuizQuestions(attemptId);
  } catch {
    notFound();
  }

  if (data.submitted) {
    redirect(`/result/${attemptId}`);
  }

  const rtl = dirForLanguage(data.language) === "rtl";

  return (
    <AppShell lang={data.language} rtl={rtl} nav="none">
      <QuizClient
        attemptId={attemptId}
        language={data.language}
        questions={data.questions}
      />
    </AppShell>
  );
}

import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AttemptNotFound } from "@/components/quiz/AttemptNotFound";
import { QuizClient } from "@/components/quiz/QuizClient";
import { resolveLanguage } from "@/lib/resolve-language";
import { getQuizQuestions } from "@/lib/quiz";
import { isQuizNotFound } from "@/lib/quiz-errors";
import { dirForLanguage } from "@/lib/translations";

type QuizPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const { attemptId } = await params;

  let data;
  try {
    data = await getQuizQuestions(attemptId);
  } catch (error) {
    if (isQuizNotFound(error)) {
      const lang = await resolveLanguage(undefined);
      return <AttemptNotFound lang={lang} />;
    }
    throw error;
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

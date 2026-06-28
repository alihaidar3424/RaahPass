"use server";

import { CorrectOption, Language as PrismaLanguage } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QUIZ_NOT_FOUND } from "@/lib/quiz-errors";
import { calculateScore } from "@/lib/score";
import { resolveExplanation } from "@/lib/explanations";
import {
  createAttemptSchema,
  QUIZ_SIZE,
  submitQuizSchema,
  type Language,
} from "@/lib/validations";
import { shuffle } from "@/lib/utils";

export type QuizOption = {
  key: CorrectOption;
  label: string;
};

export type QuizQuestionDto = {
  attemptQuestionId: string;
  orderIndex: number;
  questionText: string;
  imageUrl: string | null;
  imageAlt: string | null;
  options: QuizOption[];
};

export type ReviewQuestionDto = QuizQuestionDto & {
  selectedOption: CorrectOption | null;
  correctOption: CorrectOption;
  isCorrect: boolean;
  explanation: string;
};

function pickLocalized(
  language: Language,
  en: string,
  ur: string,
): string {
  return language === "ur" ? ur : en;
}

function buildOptions(
  language: Language,
  question: {
    optionAEn: string;
    optionAUr: string;
    optionBEn: string;
    optionBUr: string;
    optionCEn: string;
    optionCUr: string;
    optionDEn: string;
    optionDUr: string;
  },
): QuizOption[] {
  const options: QuizOption[] = [
    {
      key: "A",
      label: pickLocalized(language, question.optionAEn, question.optionAUr),
    },
    {
      key: "B",
      label: pickLocalized(language, question.optionBEn, question.optionBUr),
    },
    {
      key: "C",
      label: pickLocalized(language, question.optionCEn, question.optionCUr),
    },
  ];

  const optionD = pickLocalized(language, question.optionDEn, question.optionDUr).trim();
  if (optionD) {
    options.push({
      key: "D",
      label: optionD,
    });
  }

  return options;
}

function mapQuizQuestion(
  language: Language,
  row: {
    id: string;
    orderIndex: number;
    question: {
      questionEn: string;
      questionUr: string;
      imageUrl: string | null;
      imageAltEn: string | null;
      imageAltUr: string | null;
      optionAEn: string;
      optionAUr: string;
      optionBEn: string;
      optionBUr: string;
      optionCEn: string;
      optionCUr: string;
      optionDEn: string;
      optionDUr: string;
    };
  },
): QuizQuestionDto {
  return {
    attemptQuestionId: row.id,
    orderIndex: row.orderIndex,
    questionText: pickLocalized(
      language,
      row.question.questionEn,
      row.question.questionUr,
    ),
    imageUrl: row.question.imageUrl,
    imageAlt: row.question.imageUrl
      ? pickLocalized(
          language,
          row.question.imageAltEn ?? "",
          row.question.imageAltUr ?? "",
        ) || null
      : null,
    options: buildOptions(language, row.question),
  };
}

export async function createAttempt(input: {
  name: string;
  phone: string;
  language: Language;
}): Promise<{ attemptId: string }> {
  const parsed = createAttemptSchema.parse(input);

  const activeQuestions = await prisma.question.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  if (activeQuestions.length < QUIZ_SIZE) {
    throw new Error("INSUFFICIENT_QUESTIONS");
  }

  const selected = shuffle(activeQuestions).slice(0, QUIZ_SIZE);

  const attempt = await prisma.attempt.create({
    data: {
      name: parsed.name,
      phone: parsed.phone,
      language: parsed.language as PrismaLanguage,
      attemptQuestions: {
        create: selected.map((question, index) => ({
          questionId: question.id,
          orderIndex: index + 1,
        })),
      },
    },
    select: { id: true },
  });

  return { attemptId: attempt.id };
}

export async function createAttemptAndRedirect(formData: FormData): Promise<void> {
  const result = await createAttemptFormAction(null, formData);
  if (result?.attemptId) {
    redirect(`/quiz/${result.attemptId}`);
  }
}

export type CreateAttemptState = {
  error?: string;
  attemptId?: string;
};

export async function createAttemptFormAction(
  _prev: CreateAttemptState | null,
  formData: FormData,
): Promise<CreateAttemptState> {
  const parsed = createAttemptSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    language: String(formData.get("language") ?? "en"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  try {
    const { attemptId } = await createAttempt(parsed.data);
    redirect(`/quiz/${attemptId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_QUESTIONS") {
      return { error: "INSUFFICIENT_QUESTIONS" };
    }
    throw error;
  }

  return {};
}

export async function getQuizQuestions(attemptId: string): Promise<{
  language: Language;
  name: string;
  submitted: boolean;
  questions: QuizQuestionDto[];
}> {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      attemptQuestions: {
        include: { question: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!attempt) {
    throw new Error(QUIZ_NOT_FOUND);
  }

  const language = attempt.language as Language;

  return {
    language,
    name: attempt.name,
    submitted: attempt.submittedAt !== null,
    questions: attempt.attemptQuestions.map((row) =>
      mapQuizQuestion(language, row),
    ),
  };
}

export async function submitQuiz(input: {
  attemptId: string;
  answers: { attemptQuestionId: string; selectedOption: CorrectOption }[];
}): Promise<{ correctAnswers: number; wrongAnswers: number; percentage: number; status: "PASS" | "FAIL" }> {
  const parsed = submitQuizSchema.parse(input);

  const attempt = await prisma.attempt.findUnique({
    where: { id: parsed.attemptId },
    include: {
      attemptQuestions: {
        include: { question: true },
      },
    },
  });

  if (!attempt) {
    throw new Error(QUIZ_NOT_FOUND);
  }

  if (attempt.submittedAt) {
    throw new Error("ALREADY_SUBMITTED");
  }

  const attemptQuestionIds = new Set(
    attempt.attemptQuestions.map((row) => row.id),
  );

  for (const answer of parsed.answers) {
    if (!attemptQuestionIds.has(answer.attemptQuestionId)) {
      throw new Error("INVALID_ANSWER");
    }
  }

  let correctAnswers = 0;

  await prisma.$transaction(async (tx) => {
    for (const answer of parsed.answers) {
      const row = attempt.attemptQuestions.find(
        (item) => item.id === answer.attemptQuestionId,
      );
      if (!row) continue;

      const isCorrect = row.question.correctOption === answer.selectedOption;
      if (isCorrect) correctAnswers += 1;

      await tx.attemptQuestion.update({
        where: { id: answer.attemptQuestionId },
        data: {
          selectedOption: answer.selectedOption,
          isCorrect,
        },
      });
    }

    const score = calculateScore(correctAnswers);

    await tx.attempt.update({
      where: { id: parsed.attemptId },
      data: {
        correctAnswers: score.correctAnswers,
        wrongAnswers: score.wrongAnswers,
        percentage: score.percentage,
        status: score.status,
        submittedAt: new Date(),
      },
    });
  });

  const score = calculateScore(correctAnswers);

  revalidatePath(`/result/${parsed.attemptId}`);
  revalidatePath(`/review/${parsed.attemptId}`);

  return score;
}

export async function submitQuizAndRedirect(input: {
  attemptId: string;
  answers: { attemptQuestionId: string; selectedOption: CorrectOption }[];
}): Promise<void> {
  await submitQuiz(input);
  redirect(`/result/${input.attemptId}`);
}

export async function getResult(attemptId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt || !attempt.submittedAt) {
    throw new Error(QUIZ_NOT_FOUND);
  }

  return {
    id: attempt.id,
    name: attempt.name,
    language: attempt.language as Language,
    correctAnswers: attempt.correctAnswers ?? 0,
    wrongAnswers: attempt.wrongAnswers ?? 0,
    percentage: attempt.percentage ?? 0,
    status: attempt.status ?? "FAIL",
    totalQuestions: attempt.totalQuestions,
  };
}

export async function getReview(attemptId: string): Promise<{
  language: Language;
  name: string;
  questions: ReviewQuestionDto[];
}> {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      attemptQuestions: {
        include: { question: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!attempt || !attempt.submittedAt) {
    throw new Error(QUIZ_NOT_FOUND);
  }

  const language = attempt.language as Language;

  return {
    language,
    name: attempt.name,
    questions: attempt.attemptQuestions.map((row) => {
      const mapped = mapQuizQuestion(language, row);
      const stored = pickLocalized(
        language,
        row.question.explanationEn,
        row.question.explanationUr,
      );
      return {
        ...mapped,
        selectedOption: row.selectedOption,
        correctOption: row.question.correctOption,
        isCorrect: row.isCorrect ?? false,
        explanation: resolveExplanation(
          language,
          stored,
          row.question.correctOption,
          mapped.options,
        ),
      };
    }),
  };
}

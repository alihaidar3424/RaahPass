import { QUIZ_SIZE, PASS_THRESHOLD } from "@/lib/validations";

export type AttemptStatus = "PASS" | "FAIL";

export function calculateScore(correctCount: number, total: number = QUIZ_SIZE) {
  const wrongAnswers = total - correctCount;
  const percentage = (correctCount / total) * 100;
  const status: AttemptStatus = percentage >= PASS_THRESHOLD ? "PASS" : "FAIL";
  return { correctAnswers: correctCount, wrongAnswers, percentage, status };
}

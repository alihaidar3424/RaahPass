import { z } from "zod";

export const QUIZ_SIZE = 20;
export const PASS_THRESHOLD = 70;

export const languageSchema = z.enum(["en", "ur"]);

export const createAttemptSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[\d+\-\s()]+$/, "Enter a valid phone number"),
  language: languageSchema,
});

export const submitQuizSchema = z.object({
  attemptId: z.string().min(1),
  answers: z
    .array(
      z.object({
        attemptQuestionId: z.string().min(1),
        selectedOption: z.enum(["A", "B", "C", "D"]),
      }),
    )
    .length(QUIZ_SIZE, `All ${QUIZ_SIZE} questions must be answered`),
});

export type Language = z.infer<typeof languageSchema>;

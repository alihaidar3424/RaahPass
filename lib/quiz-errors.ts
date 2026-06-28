export const QUIZ_NOT_FOUND = "NOT_FOUND";

export function isQuizNotFound(error: unknown): boolean {
  return error instanceof Error && error.message === QUIZ_NOT_FOUND;
}

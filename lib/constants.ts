/** Cookie / storage keys — changing these resets saved prefs for existing users. */
export const LANG_COOKIE = "raahpass-lang";
export const THEME_STORAGE_KEY = "raahpass-theme";
export const PWA_DISMISS_KEY = "raahpass-pwa-dismissed";

export function quizProgressKey(attemptId: string) {
  return `raahpass-quiz-${attemptId}`;
}

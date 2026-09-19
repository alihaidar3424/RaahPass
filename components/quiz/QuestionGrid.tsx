"use client";

import { cn } from "@/lib/utils";
import type { QuizOptionKey } from "@/components/quiz/OptionButton";

type QuestionGridProps = {
  total: number;
  currentIndex: number;
  answers: Record<string, QuizOptionKey | undefined>;
  questionIds: string[];
  disabled?: boolean;
  onJump: (index: number) => void;
};

export function QuestionGrid({
  total,
  currentIndex,
  answers,
  questionIds,
  disabled = false,
  onJump,
}: QuestionGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-5 gap-2 sm:grid-cols-10",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {Array.from({ length: total }, (_, index) => {
        const id = questionIds[index];
        const answered = id ? Boolean(answers[id]) : false;
        const isCurrent = index === currentIndex;

        return (
          <button
            key={id ?? index}
            type="button"
            disabled={disabled}
            onClick={() => onJump(index)}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold transition-colors",
              isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              answered
                ? "bg-success-muted text-success"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
            aria-label={`Question ${index + 1}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

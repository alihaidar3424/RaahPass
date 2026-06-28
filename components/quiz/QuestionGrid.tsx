"use client";

import { CorrectOption } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type QuestionGridProps = {
  total: number;
  currentIndex: number;
  answers: Record<string, CorrectOption>;
  questionIds: string[];
  onJump: (index: number) => void;
};

export function QuestionGrid({
  total,
  currentIndex,
  answers,
  questionIds,
  onJump,
}: QuestionGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, index) => {
        const id = questionIds[index];
        const answered = id ? Boolean(answers[id]) : false;
        const isCurrent = index === currentIndex;

        return (
          <button
            key={id ?? index}
            type="button"
            onClick={() => onJump(index)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
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

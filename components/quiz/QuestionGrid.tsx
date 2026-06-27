"use client";

import { CorrectOption } from "@prisma/client";
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
              isCurrent && "ring-2 ring-blue-600 ring-offset-1",
              answered ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600",
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

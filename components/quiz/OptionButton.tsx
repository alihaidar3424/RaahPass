"use client";

import { CorrectOption } from "@prisma/client";
import { cn } from "@/lib/utils";

type OptionButtonProps = {
  optionKey: CorrectOption;
  label: string;
  selected: boolean;
  onSelect: (key: CorrectOption) => void;
  rtl?: boolean;
};

export function OptionButton({
  optionKey,
  label,
  selected,
  onSelect,
  rtl = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(optionKey)}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-start transition-colors",
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300",
        rtl && "flex-row-reverse text-right",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-blue-600" : "border-slate-400",
        )}
      >
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
      </span>
      <span className="flex-1 text-base leading-6">
        <span className="font-semibold">{optionKey}. </span>
        {label}
      </span>
    </button>
  );
}

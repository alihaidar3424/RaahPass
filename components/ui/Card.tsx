import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: "none" | "primary" | "success" | "danger";
};

export function Card({ children, className, accent = "none" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:p-5",
        accent === "primary" && "border-l-4 border-l-primary",
        accent === "success" && "border-l-4 border-l-success",
        accent === "danger" && "border-l-4 border-l-destructive",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function inputClassName(className?: string) {
  return cn(
    "min-h-11 w-full rounded-xl border border-border bg-input px-4 text-base text-foreground",
    "placeholder:text-muted-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    "focus:border-primary focus:ring-2 focus:ring-primary/25",
    className,
  );
}

export function labelClassName(className?: string) {
  return cn("text-sm font-medium text-foreground", className);
}

export function mutedTextClassName(className?: string) {
  return cn("text-sm text-muted-foreground", className);
}

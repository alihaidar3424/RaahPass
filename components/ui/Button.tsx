import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  size?: "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        size === "md" && "min-h-11",
        size === "lg" && "min-h-14 text-base",
        fullWidth && "w-full",
        variant === "primary" && "bg-blue-600 text-white shadow-md hover:bg-blue-700",
        variant === "secondary" &&
          "border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-900 hover:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  className,
  variant = "primary",
  fullWidth,
  size = "md",
  children,
}: {
  href: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  size?: "md" | "lg";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98]",
        size === "md" && "min-h-11",
        size === "lg" && "min-h-14 text-base",
        fullWidth && "w-full",
        variant === "primary" && "bg-blue-600 text-white shadow-md hover:bg-blue-700",
        variant === "secondary" &&
          "border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-900 hover:bg-slate-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}

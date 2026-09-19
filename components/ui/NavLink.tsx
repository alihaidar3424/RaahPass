"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

type NavLinkProps = ComponentProps<typeof Link> & {
  showSpinner?: boolean;
  /** Stretch to parent width (cards / list rows). */
  fullWidth?: boolean;
};

export function NavLink({
  className,
  children,
  showSpinner = false,
  fullWidth = false,
  ...props
}: NavLinkProps) {
  return (
    <Link className={cn(fullWidth && "block w-full", className)} {...props}>
      <NavLinkStatus showSpinner={showSpinner} fullWidth={fullWidth}>
        {children}
      </NavLinkStatus>
    </Link>
  );
}

function NavLinkStatus({
  children,
  showSpinner,
  fullWidth,
}: {
  children: ReactNode;
  showSpinner: boolean;
  fullWidth: boolean;
}) {
  const { pending } = useLinkStatus();

  return (
    <span
      className={cn(
        fullWidth ? "block w-full" : "inline-flex items-center gap-1.5",
        pending && "pointer-events-none opacity-60",
      )}
      aria-busy={pending || undefined}
    >
      {showSpinner && pending ? <Spinner className="size-3.5 shrink-0" /> : null}
      {children}
    </span>
  );
}
